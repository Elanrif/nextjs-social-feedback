import { NextRequest, NextResponse } from "next/server";
import {
  updateProduct,
  deleteProduct,
  fetchProductById,
} from "@/lib/products/services/product.service";
import { ProductUpdate, parseProductUpdate } from "@/lib/products/models/product.model";
import { getLogger } from "@config/logger.config";
import { getSession } from "@/lib/auth/next-auth/next-auth.service";
import { validationError } from "@/utils/utils.server";
import { ApiErrorResponse } from "@/shared/errors/api-error.server";

const logger = getLogger("server");

export const dynamic = "force-dynamic";

type Params = Promise<{ id: string }>;

/**
 * GET /api/products/[id]
 * Fetch a single product by ID
 */
export async function GET(request: NextRequest, { params }: { params: Params }) {
  const { id } = await params;
  const productId = Number.parseInt(id, 10);

  const reqHeaders = new Headers(request.headers);
  const config = { headers: reqHeaders };

  try {
    const response = await fetchProductById(config, productId);

    if (!response.ok) {
      const error = response.error!;
      return NextResponse.json({ ok: false, error }, { status: error.status });
    }

    return NextResponse.json(response, {
      status: 200,
    });
  } catch (error) {
    const errMsg = ApiErrorResponse(error, "fetchProduct");
    const status = errMsg.status || 500;
    logger.error({ status, message: errMsg.detail }, "Error during product fetching");
    return NextResponse.json({ ok: false, error: errMsg }, { status });
  }
}

/**
 * PATCH /api/products/[id]
 * Update a product (requires authentication)
 */
export async function PATCH(request: NextRequest, { params }: { params: Params }) {
  const { id } = await params;
  const productId = Number.parseInt(id, 10);

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
    return NextResponse.json({ ok: false, error: err }, { status: err.status });
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
    return NextResponse.json({ ok: false, error: err }, { status: err.status });
  }

  const body = await request.json().catch(() => null);
  const parsed = parseProductUpdate(body);
  if (!parsed.success) {
    const err = validationError(parsed.error.issues, "Invalid product data");
    return NextResponse.json(err, {
      status: 400,
    });
  }

  if (Object.keys(parsed.data).length === 0) {
    const err = validationError([], "Request body cannot be empty");
    return NextResponse.json(err, {
      status: 400,
    });
  }

  const reqHeaders = new Headers(request.headers);
  const config = { headers: reqHeaders, access_token: session.data?.access_token };

  try {
    const response = await updateProduct(config, productId, parsed.data as ProductUpdate);

    if (!response.ok) {
      const error = response.error;
      logger.error(
        {
          productId,
          status: error.status,
          detail: error.detail,
        },
        "Failed to update product",
      );
      return NextResponse.json({ ok: false, error }, { status: error.status });
    }

    logger.info({ productId }, "Product updated");
    return NextResponse.json(response, {
      status: 200,
    });
  } catch (error) {
    const errMsg = ApiErrorResponse(error, "updateProduct");
    const status = errMsg.status || 500;
    logger.error({ status, message: errMsg.detail }, "Error during product update");
    return NextResponse.json({ ok: false, error: errMsg }, { status });
  }
}

/**
 * DELETE /api/products/[id]
 * Delete a product (requires authentication)
 */
export async function DELETE(request: NextRequest, { params }: { params: Params }) {
  const { id } = await params;
  const productId = Number.parseInt(id, 10);

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
    return NextResponse.json({ ok: false, error: err }, { status: err.status });
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
    return NextResponse.json({ ok: false, error: err }, { status: err.status });
  }

  const reqHeaders = new Headers(request.headers);
  const config = { headers: reqHeaders, access_token: session.data?.access_token };

  try {
    const response = await deleteProduct(config, productId);

    if (!response.ok) {
      const error = response.error;
      logger.error(
        {
          productId,
          status: error.status,
          detail: error.detail,
        },
        "Failed to delete product",
      );
      return NextResponse.json(response, {
        status: error.status,
      });
    }

    logger.info({ productId }, "Product deleted");
    return NextResponse.json(response, {
      status: 200,
    });
  } catch (error) {
    const errMsg = ApiErrorResponse(error, "deleteProduct");
    const status = errMsg.status || 500;
    logger.error({ status, message: errMsg.detail }, "Error during product deletion");
    return NextResponse.json({ ok: false, error: errMsg }, { status });
  }
}
