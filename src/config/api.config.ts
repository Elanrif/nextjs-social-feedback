import httpClient from "@config/axios.config";
import { anonTokenInterceptor, ownTokenInterceptor } from "@config/interceptors/auth.interceptor";
import { getLogger } from "@config/logger.config";

const logger = getLogger("server");

export type Config = {
  access_token?: string;
  headers?: Headers;
};

const apiLogger = (config?: Config) => {
  if (config?.headers) {
    const headers = new Headers(config.headers);
    const reqId = headers.get("X-Request-ID");
    if (reqId) return logger.child({ reqId });
  }
  return logger;
};

export default function apiClient(anon?: boolean, config?: Config) {
  const instance = httpClient({
    logger: apiLogger(config),
  });
  instance.interceptors.request.use(
    anon ? anonTokenInterceptor : (c) => ownTokenInterceptor(c, config?.access_token),
  );
  return instance;
}
