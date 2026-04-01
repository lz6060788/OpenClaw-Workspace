// utils/openclaw-http.ts
export interface StreamChunk {
  delta: string
  done: boolean
}

export class OpenClawHttpClient {
  private apiUrl: string

  constructor(apiUrl: string = '/api/openclaw') {
    this.apiUrl = apiUrl
  }

  async sendMessage(
    message: string,
    onProgress?: (delta: string) => void
  ): Promise<string> {
    const url = `${this.apiUrl}/chat`

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          messages: [
            { role: 'user', content: message }
          ],
          stream: !!onProgress
        })
      })

      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(`HTTP ${response.status}: ${errorText}`)
      }

      // 处理流式响应
      if (onProgress && response.body) {
        const reader = response.body.getReader()
        const decoder = new TextDecoder()
        let fullContent = ''

        try {
          while (true) {
            const { done, value } = await reader.read()
            if (done) break

            const chunk = decoder.decode(value, { stream: true })
            const lines = chunk.split('\n')

            for (const line of lines) {
              if (line.startsWith('data: ')) {
                const data = line.slice(6)
                if (data === '[DONE]') continue

                try {
                  const parsed = JSON.parse(data)
                  const delta = parsed.choices?.[0]?.delta?.content || ''
                  if (delta) {
                    fullContent += delta
                    onProgress(delta)
                  }
                } catch (e) {
                  console.error('[OpenClaw] Parse error:', e)
                }
              }
            }
          }
        } catch (readError) {
          // 如果已经收到了内容，认为是成功的
          if (fullContent) {
            console.warn('[OpenClaw] Stream read interrupted, but content received:', fullContent.length, 'chars')
            return fullContent
          }
          throw readError
        }

        return fullContent
      }

      // 处理非流式响应
      const data = await response.json()
      return data.choices?.[0]?.message?.content || ''
    } catch (error) {
      console.error('[OpenClaw] Request error:', error)
      throw error
    }
  }

  async testConnection(): Promise<boolean> {
    try {
      const response = await fetch(`${this.apiUrl}/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          messages: [
            { role: 'user', content: 'ping' }
          ],
          stream: false
        })
      })

      return response.ok
    } catch (error) {
      console.error('[OpenClaw] Connection test failed:', error)
      return false
    }
  }
}
