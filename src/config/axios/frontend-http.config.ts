"use client";

import axios from "axios";
import environment from "@config/environment.config";
import { baseRequestConfig } from "@config/axios/base-request.config";
import { getModalInstance } from "@/components/providers/modal-provider";

const { apiProxyBase } = environment;

export function frontendHttp() {
  const instance = axios.create({
    ...baseRequestConfig,
    baseURL: apiProxyBase,
  });
  instance.interceptors.response.use(
    (response) => response,
    (error) => {
      // When the status code is 401(unauthorized http code), display the session expired modal
      if (error.response?.status === 401) {
        const modal = getModalInstance();
        if (modal) {
          modal.showSessionExpired();
        }
      }
      return Promise.reject(error);
    },
  );
  return instance;
}
