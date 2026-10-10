import { getNeonAuth } from "@/app/library/lib/neon-auth";

type AuthRouteContext = { params: Promise<{ path: string[] }> };
type AuthMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

async function handleAuthRequest(method: AuthMethod, request: Request, context: AuthRouteContext) {
  try {
    const handlers = getNeonAuth().handler();
    return await handlers[method](request, context);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Neon Auth is not configured.";
    const unavailable = message.startsWith("Configure NEON_AUTH_");
    return Response.json(
      { error: unavailable ? message : "Authentication is temporarily unavailable." },
      { status: unavailable ? 503 : 502 },
    );
  }
}

export const GET = (request: Request, context: AuthRouteContext) => handleAuthRequest("GET", request, context);
export const POST = (request: Request, context: AuthRouteContext) => handleAuthRequest("POST", request, context);
export const PUT = (request: Request, context: AuthRouteContext) => handleAuthRequest("PUT", request, context);
export const PATCH = (request: Request, context: AuthRouteContext) => handleAuthRequest("PATCH", request, context);
export const DELETE = (request: Request, context: AuthRouteContext) => handleAuthRequest("DELETE", request, context);
