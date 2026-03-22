import axios, { AxiosError } from "axios";
import { baseRequestConfig } from "@config/axios/base-request.config";
import { Logger } from "@config/logger.config";
import {
  requestLoggerInterceptor,
  responseLoggerInterceptor,
} from "@config/interceptors/logger.interceptor";

export { baseRequestConfig } from "@config/axios/base-request.config";
export default function httpClient({ logger }: { logger: Logger }) {
  const instance = axios.create({
    ...baseRequestConfig,
  });
  instance.interceptors.request.use(requestLoggerInterceptor(logger), (error: any) => {
    logger.error({ error: error.message }, "Outgoing request failed");
    return Promise.reject(error);
  });
  instance.interceptors.response.use(responseLoggerInterceptor(logger), (error: AxiosError) => {
    const { trace: _, ...data } = (error.response?.data ?? {}) as Record<string, unknown>;
    logger.error({ error: error.message, ...data }, "Upstream API error");
    return Promise.reject(error);
  });
  return instance;
}
