import moment from "moment/moment";
import environment from "@config/environment.config";

const { format: formatConfig } = environment;

export interface Token {
  access_token: string;
  expires_in: number;
  token_type: string;
  scope: string;
  refresh_token: string;
  expiry: string;
  owned: boolean;
}

export const isTokenExpired = (expiryOrToken: string | Token): boolean => {
  const expiry = typeof expiryOrToken === "string" ? expiryOrToken : expiryOrToken.expiry;
  if (!expiry) {
    return true;
  }
  const date = moment(expiry, formatConfig.dateTime);
  const now = moment();
  return date.isSameOrBefore(now);
};
