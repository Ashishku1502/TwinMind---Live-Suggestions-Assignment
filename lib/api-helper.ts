/**
 * Resilient API helper with exponential backoff and jitter.
 * Designed to handle Groq API rate limits (429) and transient server errors.
 */

export async function withRetries<T>(
  operation: () => Promise<T>,
  options: {
    maxRetries?: number
    initialDelay?: number
    maxDelay?: number
    onRetry?: (error: any, attempt: number, delay: number) => void
  } = {}
): Promise<T> {
  const { 
    maxRetries = 3, 
    initialDelay = 1000, 
    maxDelay = 10000,
    onRetry
  } = options

  let lastError: any

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await operation()
    } catch (error: any) {
      lastError = error

      // Check if the error is retryable
      // 429: Rate Limit
      // 503: Service Unavailable
      // 500+: Internal Server Errors
      const status = error?.status || error?.response?.status
      const isRateLimit = status === 429
      const isTransient = status === 503 || (status >= 500 && status <= 599)
      
      if (!(isRateLimit || isTransient) || attempt === maxRetries) {
        throw error
      }

      // Calculate exponential backoff: initial * 2^attempt
      // Plus some jitter to prevent synchronized retries
      const backoffDelay = Math.min(initialDelay * Math.pow(2, attempt), maxDelay)
      const jitter = backoffDelay * 0.2 * (Math.random() - 0.5)
      const finalDelay = backoffDelay + jitter

      if (onRetry) {
        onRetry(error, attempt + 1, finalDelay)
      } else {
        console.warn(
          `[API Helper] Attempt ${attempt + 1} failed (Status: ${status}). ` +
          `Retrying in ${Math.round(finalDelay)}ms...`
        )
      }

      await new Promise(resolve => setTimeout(resolve, finalDelay))
    }
  }

  throw lastError
}

/**
 * Specifically handles Groq API errors and formats them for the client.
 */
export function handleGroqError(error: any, context: string) {
  const status = error?.status || error?.response?.status
  let message = error?.message || 'Cognitive engine request failed'
  
  if (status === 429) {
    message = 'Rate limit reached. The neural engine is cooling down. Please wait a moment.'
  }

  console.error(`[${context}] Error:`, message, error)
  
  return {
    error: message,
    status: status || 500,
    details: error?.message
  }
}
