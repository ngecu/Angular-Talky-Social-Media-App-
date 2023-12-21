import { v4 } from "uuid";

export function generateResetToken(): string {
  const token = v4();
  return token;
}
