import { AxiosResponse, InternalAxiosRequestConfig } from "axios";
import { Logger } from "@config/logger.config";

export const requestLoggerInterceptor =
  (logger: Logger) =>
  (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
    logger.debug(
      {
        method: config.method?.toUpperCase(),
        url: config.url,
      },
      "Request",
    );
    // logger.debug({ headers: config.headers }, "Request headers");
    // logger.debug({ data: config.data }, "Request data");
    return config;
  };

export const responseLoggerInterceptor =
  (logger: Logger) =>
  (response: AxiosResponse): AxiosResponse => {
    logger.debug(
      {
        method: response.config.method?.toUpperCase(),
        url: response.config.url,
        status: response.status,
      },
      "Response from xxx",
    );
    // logger.debug({ headers: response.headers }, "Response headers");
    // logger.debug({ data: response.data }, "Response data");
    return response;
  };
