import { NextRequest, NextResponse } from "next/server";

// Demo token for testing purposes
export const DEMO_TOKEN = "demo-bearer-token-123";

/**
 * Validates the Bearer token from the Authorization header
 * @param request - The incoming request
 * @returns null if valid, or a NextResponse with error if invalid
 */
export function validateBearerToken(request: NextRequest): NextResponse | null {
  const authHeader = request.headers.get("authorization");

  if (!authHeader) {
    return NextResponse.json(
      {
        success: false,
        error: "Authorization header is missing",
        message: "Please provide a Bearer token in the Authorization header",
      },
      { status: 401 },
    );
  }

  if (!authHeader.startsWith("Bearer ")) {
    return NextResponse.json(
      {
        success: false,
        error: "Invalid authorization format",
        message: "Authorization header must start with 'Bearer '",
      },
      { status: 401 },
    );
  }

  const token = authHeader.slice(7); // Remove "Bearer " prefix

  if (token !== DEMO_TOKEN) {
    return NextResponse.json(
      {
        success: false,
        error: "Invalid token",
        message: "The provided Bearer token is invalid",
      },
      { status: 403 },
    );
  }

  return null; // Token is valid
}
