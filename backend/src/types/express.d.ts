import type { MyJwtPayload } from "../utils/token.ts";

declare global{
    namespace Express{
        interface Request{
            user:MyJwtPayload
        }
    }
}

export {};