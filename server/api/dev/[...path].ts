// server/api/dev/[...path].ts
export default defineEventHandler(async (event) => {
  const path = event.path.replace('/api/dev/', '')
  const [port, ...rest] = path.split('/')
  const targetPath = rest.join('/')

  if (!port || isNaN(parseInt(port))) {
    throw createError({ statusCode: 400, message: 'Invalid port' })
  }

  const targetUrl = `http://127.0.0.1:${port}/${targetPath}`

  try {
    const response = await $fetch.raw(targetUrl, {
      headers: {
        ...getRequestHeaders(event),
        host: 'localhost',
      },
      responseType: 'arrayBuffer',
    })

    // 设置响应头
    const contentType = response.headers.get('content-type')
    if (contentType) {
      setHeader(event, 'Content-Type', contentType)
    }
    setHeader(event, 'Access-Control-Allow-Origin', '*')

    return response._data
  } catch (error) {
    throw createError({
      statusCode: 502,
      message: `Failed to proxy to http://127.0.0.1:${port}`,
    })
  }
})
