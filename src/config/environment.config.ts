const BACKEND_BASE_URL = process.env.BACKEND_BASE_URL ?? "http://localhost:8081";
const BASE_URL = process.env.NEXT_PUBLIC_WEBSITE_URL ?? "http://localhost:3000";
const HOST_NAME = process.env.NEXT_PUBLIC_ROOT_DOMAIN ?? "localhost";
const BACKEND_BASE_V1 = `${BACKEND_BASE_URL}/api/v1`;

const environment = {
  name: process.env.ENV,
  baseUrl: BASE_URL,
  rootDomain: HOST_NAME,
  apiBaseUrl: `${BASE_URL}/api`,
  apiProxyBase: `/api`,
  baApiBaseUrl: BACKEND_BASE_URL,
  api: {
    rest: {
      endpoints: {
        comments: `${BACKEND_BASE_V1}/comments`,
        posts: `${BACKEND_BASE_V1}/posts`,
        users: `${BACKEND_BASE_V1}/users`,
        login: `${BACKEND_BASE_V1}/keycloak/login`,
        register: `${BACKEND_BASE_V1}/keycloak/register`,
        resetPassword: `${BACKEND_BASE_V1}/auth/reset-password`,
        // auth endpoints
        auth: {
          baseUrl: `${BACKEND_BASE_V1}/auth`,
          editProfile: `${BACKEND_BASE_V1}/auth/edit-profile`,
          changeProfilePasswordUrl: `${BACKEND_BASE_V1}/auth/change-password-profile`,
          refreshTokenUrl: `${BACKEND_BASE_V1}/keycloak/refresh-token`,
          logoutUrl: `${BACKEND_BASE_V1}/keycloak/logout`,
        },
      },
    },
  },

  auth: {
    endpoints: {
      token: `${BACKEND_BASE_URL}/auth/v1/token`,
      introspect: `${BACKEND_BASE_URL}/auth/v1/introspect`,
    },
  },
  format: {
    dateTime: process.env.FORMAT_DATETIME_ISO || "YYYY-MM-DDThh:mm:ss",
  },
  log: {
    client: {
      level: process.env.NEXT_PUBLIC_LOG_LEVEL || "info",
      // "console" → browser devtools | "none" → silence all (useful in test/CI)
      output: process.env.NEXT_PUBLIC_LOG_OUTPUT || "console",
    },
    server: {
      file: {
        path: process.env.LOG_FILE_PATH,
      },
      level: process.env.LOG_LEVEL || "info",
      output: process.env.LOG_OUTPUT || "console",
    },
  },
} as const;

export default environment;
