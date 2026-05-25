async function connectWithRetry(label, connectFn, options = {}) {
  const { maxRetries = 15, delayMs = 2000 } = options

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await connectFn()
    } catch (err) {
      const isLast = attempt === maxRetries
      console.warn(
        `[${label}] Tentativa ${attempt}/${maxRetries} falhou: ${err.message}`,
      )
      if (isLast) throw err
      await new Promise((resolve) => setTimeout(resolve, delayMs))
    }
  }
}

module.exports = { connectWithRetry }
