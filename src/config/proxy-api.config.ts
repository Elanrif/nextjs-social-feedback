import environment from "@config/environment.config";

const { baseUrl, apiBaseUrl, apiProxyBase } = environment;

export const proxyEnvironment = {
  baseUrl,
  apiBaseUrl,
  apiProxyBase,
  api: {
    endpoints: {
      comments: `/comments`,
      posts: `/posts`,
      login: `/auth/login`,
      signOut: `/auth/logout`,
      session: `/auth/session`,
      me: `/auth/session/me`,
      register: `/auth/register`,
      passwordChange: `/auth/password-change`,
      users: `/users`,
    },
  },
};
