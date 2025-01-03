import { Server } from "./server/requests";

export async function checkAuth(token?: string) {
  return token !== undefined && (await Server.validateToken(token));
}
