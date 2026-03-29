import { NextRequest, NextResponse } from "next/server";
import { CategoryCreate } from "@/lib/categories/models/category.model";
import { getLogger } from "@config/logger.config";
import { createCategory, fetchCategories } from "@/lib/categories/services/category.service";
import { auth } from "@/lib/auth";
import { ApiErrorResponse } from "@/shared/errors/api-error.server";
import { isApiError } from "@/shared/errors/api-error";

const logger = getLogger("server");

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const reqHeaders = new Headers(request.headers);
  const config = { headers: reqHeaders };

  try {
    const response = await fetchCategories(config);

    if (isApiError(response)) {
      return NextResponse.json(response, { status: response.status });
    }

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    const errMsg = ApiErrorResponse(error, "fetchCategories");
    const status = errMsg.status || 500;
    logger.error({ status, message: errMsg.detail }, "Error during category fetching");
    return NextResponse.json(errMsg, { status });
  }
}

/**
 * POST /api/categories
 * Create a new category (requires authentication)
 */
export async function POST(request: NextRequest) {
  // User authentication and role verification
  const session = await auth();

  if (!session?.user) {
    const err = {
      error: "Unauthorized",
      status: 401,
      message: "You must be logged in",
    };
    logger.error(
      {
        status: err.status,
        message: err.message,
      },
      "Unauthorized",
    );
    return NextResponse.json(err, {
      status: err.status,
    });
  }

  if (session.user.role !== "ADMIN") {
    const err = {
      status: 403,
      message: "You do not have permission to perform this action",
    };
    logger.error(
      {
        status: err.status,
        message: err.message,
      },
      "Forbidden",
    );
    return NextResponse.json(err, {
      status: err.status,
    });
  }

  const body = (await request.json()) as CategoryCreate;

  const reqHeaders = new Headers(request.headers);
  const config = { headers: reqHeaders, access_token: session.user.access_token };

  try {
    const response = await createCategory(config, body);

    if (isApiError(response)) {
      return NextResponse.json(response, { status: response.status });
    }

    logger.info({ categoryId: response.id }, "Category created");
    return NextResponse.json(response, { status: 201 });
  } catch (error) {
    const errMsg = ApiErrorResponse(error, "createCategory");
    const status = errMsg.status || 500;
    logger.error({ status, message: errMsg.detail }, "Error during category creation");
    return NextResponse.json(errMsg, { status });
  }
}
