import { NextRequest, NextResponse } from "next/server";
import {
  fetchCategory,
  updateCategory,
  deleteCategory,
} from "@/lib/categories/services/category.service";
import { CategoryUpdate } from "@/lib/categories/models/category.model";
import { getLogger } from "@config/logger.config";
import { crudApiErrorResponse } from "@/lib/shared/helpers/crud-api-error.server";
import { getSession } from "@/lib/auth/next-auth/next-auth.service";

const logger = getLogger("server");

export const dynamic = "force-dynamic";

type Params = Promise<{ id: string }>;

/**
 * GET /api/categories/[id]
 * Fetch a single category by ID
 *
 * ℹ️ Pattern: returns unwrapped T | CrudApiError (contrast with /api/users which returns Result<T,E>)
 * The client service uses an `isCrudError()` type guard to distinguish success from error.
 */
export async function GET(request: NextRequest, { params }: { params: Params }) {
  const { id } = await params;
  const categoryId = Number.parseInt(id, 10);

  // User authentication and role verification
  const session = await getSession();

  if (!session.ok) {
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

  if (session.data?.user?.role !== "ADMIN") {
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

  const reqHeaders = new Headers(request.headers);
  const config = { headers: reqHeaders };

  try {
    const response = await fetchCategory(config, categoryId);

    if (!response.ok) {
      logger.warn(
        {
          categoryId,
          status: response.error.status,
          message: response.error.message,
        },
        "Category not found",
      );
      return NextResponse.json(response.error, {
        status: response.error.status,
      });
    }

    return NextResponse.json(response.data, {
      status: 200,
    });
  } catch (error) {
    const errMsg = crudApiErrorResponse(error, "fetchCategory");
    const status = errMsg.status || 500;
    logger.error({ status, message: errMsg.message }, "Error during category fetching");
    return NextResponse.json(errMsg, { status });
  }
}

/**
 * PATCH /api/categories/[id]
 * Update a category (requires authentication)
 */
export async function PATCH(request: NextRequest, { params }: { params: Params }) {
  const { id } = await params;
  const categoryId = Number.parseInt(id, 10);

  // User authentication and role verification
  const session = await getSession();

  if (!session.ok) {
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

  if (session.data?.user?.role !== "ADMIN") {
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

  const body = (await request.json()) as CategoryUpdate;

  const reqHeaders = new Headers(request.headers);
  const config = { headers: reqHeaders, access_token: session.data?.access_token };

  try {
    const response = await updateCategory(config, categoryId, body);

    if (!response.ok) {
      logger.warn(
        {
          categoryId,
          status: response.error.status,
          message: response.error.message,
        },
        "Failed to update category",
      );
      return NextResponse.json(response.error, {
        status: response.error.status,
      });
    }

    logger.info({ categoryId }, "Category updated");
    return NextResponse.json(response.data, {
      status: 200,
    });
  } catch (error) {
    const errMsg = crudApiErrorResponse(error, "updateCategory");
    const status = errMsg.status || 500;
    logger.error({ status, message: errMsg.message }, "Error during category update");
    return NextResponse.json(errMsg, { status });
  }
}

/**
 * DELETE /api/categories/[id]
 * Delete a category (requires authentication)
 */
export async function DELETE(request: NextRequest, { params }: { params: Params }) {
  const { id } = await params;
  const categoryId = Number.parseInt(id, 10);

  // User authentication and role verification
  const session = await getSession();

  if (!session.ok) {
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

  if (session.data?.user?.role !== "ADMIN") {
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

  const reqHeaders = new Headers(request.headers);
  const config = { headers: reqHeaders, access_token: session.data?.access_token };

  try {
    const result = await deleteCategory(config, categoryId);

    if (!result.ok) {
      logger.warn(
        {
          categoryId,
          status: result.error.status,
          message: result.error.message,
        },
        "Failed to delete category",
      );
      return NextResponse.json(result.error, {
        status: result.error.status,
      });
    }

    logger.info({ categoryId }, "Category deleted");
    return NextResponse.json(result.data, {
      status: 200,
    });
  } catch (error) {
    const errMsg = crudApiErrorResponse(error, "deleteCategory");
    const status = errMsg.status || 500;
    logger.error({ status, message: errMsg.message }, "Error during category deletion");
    return NextResponse.json(errMsg, { status });
  }
}
