"server-only";

const required = (key: string): string => {
  const value = process.env[key];
  if (!value) throw new Error(`Missing required environment variable: ${key}`);
  return value;
};

export const kcConfig = {
  url: required("KC_URL"),
  realm: required("KC_REALM"),
  clientId: required("KC_CLIENT_ID"),
  clientSecret: required("KC_CLIENT_SECRET"),
} as const;

export const kcAdminConfig = {
  clientId: process.env.KC_ADMIN_CLIENT_ID ?? "admin-cli",
  username: required("KC_ADMIN_USERNAME"),
  password: required("KC_ADMIN_PASSWORD"),
} as const;

export const kcUrls = {
  token: () => `${kcConfig.url}/realms/${kcConfig.realm}/protocol/openid-connect/token`,
  adminToken: () => `${kcConfig.url}/realms/master/protocol/openid-connect/token`,
  adminUsers: () => `${kcConfig.url}/admin/realms/${kcConfig.realm}/users`,
};
