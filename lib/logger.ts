type LogLevel = 'info' | 'warn' | 'error';

interface LogPayload {
  action: string;
  userId?: number | string;
  [key: string]: unknown;
}

class Logger {
  private formatLog(level: LogLevel, message: string, payload?: LogPayload, error?: unknown) {
    const logEntry: Record<string, unknown> = {
      timestamp: new Date().toISOString(),
      level,
      message,
      ...payload,
    };

    if (error) {
      if (error instanceof Error) {
        logEntry['error_name'] = error.name;
        logEntry['error_message'] = error.message;
        logEntry['stack_trace'] = error.stack;
      } else {
        logEntry['error_raw'] = String(error);
      }
    }

    return JSON.stringify(logEntry);
  }

  info(message: string, payload?: LogPayload) {
    console.log(this.formatLog('info', message, payload));
  }

  warn(message: string, payload?: LogPayload) {
    console.warn(this.formatLog('warn', message, payload));
  }

  error(message: string, error: unknown, payload?: LogPayload) {
    console.error(this.formatLog('error', message, payload, error));
  }
}

export const SystemLogger = new Logger();
