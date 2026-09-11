import { TokenPayload } from "@/types/auth.types";

declare global {
  namespace Express {
    interface Request {
      user?: TokenPayload;
    }
  }
}

export {};
