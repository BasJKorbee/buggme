import type createEnv from "./env";

declare global {
    var env: ReturnType<typeof createEnv>
}