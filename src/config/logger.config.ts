import type { Level, TransportTargetOptions } from "pino";
import environment from "@config/environment.config";

/**
 * Single log-method signature shared by all levels.
 * Preferred: `logger.info({ key: val }, "message")` — context first, message second.
 * Plain:     `logger.info("message")` — when there is no context to attach.
 */
export type LogFn = {
  (obj: object, msg?: string): void;
  (msg: string): void;
};

/**
 * Isomorphic logger interface — works on both server (Pino) and client (console fallback).
 * Use `child({ reqId })` to create a derived logger that auto-includes bindings in every entry.
 */
export interface Logger {
  error: LogFn;
  warn: LogFn;
  info: LogFn;
  debug: LogFn;
  /** Creates a child logger with extra fields merged into every log entry. */
  child(bindings: Record<string, unknown>): Logger;
}

// Level hierarchy — same order as Pino.
const LOG_LEVELS = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
} as const;
type ClientLevel = keyof typeof LOG_LEVELS;

// eslint-disable-next-line no-empty-function
function noop(_obj?: unknown, _msg?: string): void {}

/**
 * Builds a browser-safe logger backed by the native `console` API.
 * Respects `NEXT_PUBLIC_LOG_LEVEL` and `NEXT_PUBLIC_LOG_OUTPUT` env vars.
 * Pino is never loaded in the browser.
 */
function buildConsoleFallback(): Logger {
  const { level, output } = environment.log.client;

  if (!output.includes("console")) {
    return {
      error: noop,
      warn: noop,
      info: noop,
      debug: noop,
      child() {
        return this;
      },
    };
  }

  const minRank = LOG_LEVELS[level as ClientLevel] ?? LOG_LEVELS.info;
  const allow = (lvl: ClientLevel) => LOG_LEVELS[lvl] >= minRank;

  /* eslint-disable no-console */
  return {
    error: allow("error") ? (o: any, m?: string) => console.error(m ?? o, m ? o : "") : noop,
    warn: allow("warn") ? (o: any, m?: string) => console.warn(m ?? o, m ? o : "") : noop,
    info: allow("info") ? (o: any, m?: string) => console.info(m ?? o, m ? o : "") : noop,
    debug: allow("debug") ? (o: any, m?: string) => console.debug(m ?? o, m ? o : "") : noop,
    child() {
      return this;
    },
  };
  /* eslint-enable no-console */
}

const consoleFallback: Logger = buildConsoleFallback();

// Persist across HMR reloads in Next.js dev — module-level vars reset on each reload
// but `global` survives. In production there is no HMR so this is a no-op.
const _global = global as typeof global & { __pinoLogger?: Logger };

/**
 * Builds the Pino server logger (Node only).
 * Lazy `require()` keeps Pino out of the browser bundle entirely.
 * Transports: `pino-pretty` in dev, raw JSON stdout in prod, optional file via `LOG_FILE_PATH`.
 */
function buildServerLogger(): Logger {
  const pinoModule = require("pino"); // eslint-disable-line @typescript-eslint/no-require-imports, unicorn/prefer-module
  const pino = (pinoModule.default ?? pinoModule) as {
    (opts: object, transport?: object): Logger;
    transport(opts: object): object;
  };

  const { level, output, file } = environment.log.server;
  const isDev = process.env.NODE_ENV !== "production";

  const targets: TransportTargetOptions[] = [];

  if (output.includes("console")) {
    targets.push(
      isDev
        ? {
            target: "pino-pretty",
            options: {
              colorize: true,
              translateTime: "SYS:standard",
              ignore: "pid,hostname",
            },
            level,
          }
        : {
            target: "pino/file",
            options: { destination: 1 },
            level,
          },
    );
  }

  if (output.includes("file") && file?.path) {
    targets.push({
      target: "pino/file",
      options: {
        destination: file.path,
        mkdir: true,
      },
      level,
    });
  }

  if (targets.length === 0) {
    targets.push({
      target: "pino/file",
      options: { destination: 1 },
      level,
    });
  }

  const transport = targets.length > 1 ? pino.transport({ targets }) : pino.transport(targets[0]);
  return pino({ level: level as Level }, transport) as unknown as Logger;
}

/**
 * Returns the appropriate logger for the current context.
 *
 * | type        | server              | browser                        |
 * |-------------|---------------------|--------------------------------|
 * | `"server"`  | Pino (singleton)    | **throws** — hard boundary     |
 * | `"client"`  | Pino (singleton)    | console fallback               |
 * | `"default"` | Pino (singleton)    | console fallback               |
 *
 * @example — Server Component / API route
 * ```ts
 * const logger = getLogger("server");
 * logger.info({ userId }, "User fetched");
 * ```
 * @example — Client Component
 * ```ts
 * const logger = getLogger("client");
 * logger.warn("Something odd happened");
 * ```
 */
export function getLogger(type: "client" | "server" | "default" = "default"): Logger {
  if (typeof window !== "undefined") {
    if (type === "server") {
      throw new Error(
        '[logger] getLogger("server") was called in a browser context. ' +
          'Use getLogger("client") or getLogger() in Client Components.',
      );
    }
    return consoleFallback;
  }
  return (_global.__pinoLogger ??= buildServerLogger());
}
