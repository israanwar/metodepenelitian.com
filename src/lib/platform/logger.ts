/**
 * Platform Phase 0 — structured, redacted logger.
 *
 * Emits one JSON line per log call so log output stays parseable, and
 * redacts any field whose key name looks like a secret before it is ever
 * serialized. This is a deliberately small, dependency-free logger — Phase 0
 * requires structured, redacted logs, not a specific logging vendor.
 *
 * Redaction is key-name based, not value-content scanning: a secret-shaped
 * string passed under an unrelated key name is not caught. Call sites must
 * name secret-bearing fields so they match `SENSITIVE_KEY_PATTERN` (or add
 * to it) rather than relying on this module to detect secrets by shape.
 * See docs/implementation/P0 BACKEND IMPLEMENTATION SEQUENCE.md, Phase 0.
 */

export type LogLevel = "debug" | "info" | "warn" | "error";

export interface LogFields {
  correlationId?: string;
  [key: string]: unknown;
}

export interface LogRecord {
  level: LogLevel;
  message: string;
  time: string;
  [key: string]: unknown;
}

/** Key names treated as secret-shaped and redacted regardless of value. */
const SENSITIVE_KEY_PATTERN = /(key|secret|token|password|credential|authorization|cookie)/i;
const REDACTED = "[REDACTED]";

function redact(value: unknown): unknown {
  if (Array.isArray(value)) {
    return value.map(redact);
  }
  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value as Record<string, unknown>).map(([key, val]) => [
        key,
        SENSITIVE_KEY_PATTERN.test(key) ? REDACTED : redact(val),
      ])
    );
  }
  return value;
}

function write(level: LogLevel, line: string) {
  if (level === "error") {
    console.error(line);
  } else if (level === "warn") {
    console.warn(line);
  } else {
    console.log(line);
  }
}

function emit(level: LogLevel, message: string, fields: LogFields = {}): LogRecord {
  const redactedFields = redact(fields) as Record<string, unknown>;
  const record: LogRecord = {
    level,
    message,
    time: new Date().toISOString(),
    ...redactedFields,
  };
  write(level, JSON.stringify(record));
  return record;
}

export const logger = {
  debug: (message: string, fields?: LogFields) => emit("debug", message, fields),
  info: (message: string, fields?: LogFields) => emit("info", message, fields),
  warn: (message: string, fields?: LogFields) => emit("warn", message, fields),
  error: (message: string, fields?: LogFields) => emit("error", message, fields),
};
