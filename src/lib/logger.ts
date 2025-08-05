type LogLevel = 'info' | 'warn' | 'error' | 'debug'

interface LogEntry {
  timestamp: string
  level: LogLevel
  message: string
  data?: any
  userId?: string
  orderId?: string
  sessionId?: string
}

class Logger {
  private sessionId: string

  constructor() {
    this.sessionId = this.generateSessionId()
  }

  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  private formatLog(level: LogLevel, message: string, data?: any, context?: { userId?: string; orderId?: string }): LogEntry {
    return {
      timestamp: new Date().toISOString(),
      level,
      message,
      data,
      sessionId: this.sessionId,
      ...context
    }
  }

  private log(level: LogLevel, message: string, data?: any, context?: { userId?: string; orderId?: string }) {
    const logEntry = this.formatLog(level, message, data, context)
    
    // Console log com formatação
    const emoji = {
      info: 'ℹ️',
      warn: '⚠️',
      error: '❌',
      debug: '🐛'
    }[level]

    console.group(`${emoji} [${level.toUpperCase()}] ${message}`)
    console.log('Timestamp:', logEntry.timestamp)
    console.log('Session ID:', logEntry.sessionId)
    if (context?.userId) console.log('User ID:', context.userId)
    if (context?.orderId) console.log('Order ID:', context.orderId)
    if (data) console.log('Data:', data)
    console.groupEnd()

    // Em produção, enviar para serviço de monitoramento
    if (import.meta.env.PROD) {
      this.sendToMonitoring(logEntry)
    }
  }

  private async sendToMonitoring(logEntry: LogEntry) {
    try {
      // Aqui você pode integrar com serviços como Sentry, LogRocket, etc.
      // Por enquanto, apenas simulamos o envio
      if (logEntry.level === 'error') {
        // Enviar erro crítico para monitoramento
        console.error('🚨 CRITICAL ERROR - Should be sent to monitoring service:', logEntry)
      }
    } catch (error) {
      console.error('Failed to send log to monitoring:', error)
    }
  }

  info(message: string, data?: any, context?: { userId?: string; orderId?: string }) {
    this.log('info', message, data, context)
  }

  warn(message: string, data?: any, context?: { userId?: string; orderId?: string }) {
    this.log('warn', message, data, context)
  }

  error(message: string, error?: Error, context?: { userId?: string; orderId?: string }) {
    this.log('error', message, {
      error: error?.message,
      stack: error?.stack,
      name: error?.name
    }, context)
  }

  debug(message: string, data?: any, context?: { userId?: string; orderId?: string }) {
    if (import.meta.env.DEV) {
      this.log('debug', message, data, context)
    }
  }

  // Logs específicos para eventos de negócio
  orderCreated(orderId: string, orderData: any, userId?: string) {
    this.info('Order created', orderData, { orderId, userId })
  }

  orderStatusChanged(orderId: string, oldStatus: string, newStatus: string, userId?: string) {
    this.info('Order status changed', { oldStatus, newStatus }, { orderId, userId })
  }

  paymentProcessed(orderId: string, paymentData: any, userId?: string) {
    this.info('Payment processed', paymentData, { orderId, userId })
  }

  paymentFailed(orderId: string, error: Error, userId?: string) {
    this.error('Payment failed', error, { orderId, userId })
  }

  ifoodIntegration(orderId: string, action: string, data: any, userId?: string) {
    this.info(`iFood integration: ${action}`, data, { orderId, userId })
  }

  userAction(action: string, data: any, userId?: string) {
    this.info(`User action: ${action}`, data, { userId })
  }

  adminAction(action: string, data: any, userId: string) {
    this.info(`Admin action: ${action}`, data, { userId })
  }
}

export const logger = new Logger() 