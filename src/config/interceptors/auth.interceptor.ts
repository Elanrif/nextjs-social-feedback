import environment from "@config/environment.config";
import { InternalAxiosRequestConfig } from "axios";
import { getLogger } from "@config/logger.config";
import { ApiError_ } from "@/shared/errors/api-error";

const { api: apiConfig } = environment;
const logger = getLogger();
const SAFE_URLS = [apiConfig.rest.endpoints.register, apiConfig.rest.endpoints.login];

const isSafeUrl = (candidate: string): boolean => {
  return SAFE_URLS.some((url: string) => candidate.startsWith(url));
};

export const anonTokenInterceptor = async (config: InternalAxiosRequestConfig) => {
  const { url } = config;
  if (url && isSafeUrl(url)) {
    logger.info(`Request to safe URL ${url}, skipping token interceptor`);
  }
  return config;
};

export const ownTokenInterceptor = async (
  config: InternalAxiosRequestConfig,
  access_token?: string,
) => {
  const { headers } = config;
  if (access_token) {
    headers["Authorization"] = `Bearer ${access_token}`;
  } else {
    throw new ApiError_("Not Authenticated", 401);
  }
  return config;
};
