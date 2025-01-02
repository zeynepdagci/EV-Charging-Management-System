import { validateToken } from "./server/validate-token";

export async function checkAuth(token?: string) {
  return token !== undefined && (await validateToken(token));
}
