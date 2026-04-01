IMPORTANT: logger.error produces noisy Node console output

> Note — if you use `logger.error(...)` in server code, it writes to
> `console.error(...)` and will produce noisy logs visible in the Node console or your
> hosting platform. Use `logger.error` sparingly for real server/internal errors (5xx).
> For authentication or validation issues (401/400), prefer `logger.warn` or return an
> error object with an appropriate HTTP status to avoid unwanted 500 responses.

Example of the noisy console output you may see:

```
Console Error
Server


Nodejs server [HTTP Error] [session]
src\config\loggers\default.logger.ts (37:19) @ Object.error


  35 |       error: (message?: any, ...params: any[]) => {
  36 |         if (getLogLevelInt(logConfig.level) <= getLogLevelInt("error")) {
> 37 |           console.error(message, ...params);
     |                   ^
  38 |         }
  39 |       },
  40 |       warn: (message?: any, ...params: any[]) => {
Call Stack
13

Show 9 ignore-listed frame(s)
Object.error
```

This README continues below.

---

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## NVM (Node Version Manager)

> ⚠️ **Warning:** If Node.js is already installed on your machine, you must uninstall it first before installing NVM. Download and install NVM from: [https://www.nvmnode.com/guide/download.html](https://www.nvmnode.com/guide/download.html)

### Useful Commands

```bash
# Check the currently active Node.js version
nvm current

# Install a specific Node.js version
nvm install 20

# Use a specific Node.js version
nvm use 20
```

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

> ⚠️ **Note:** This project uses the `src/` directory structure. If you have `app/` directly at the root instead of `src/app/`, update the path alias in `tsconfig.json`:
>
> ```json
> "paths": {
>   "@/*": ["./*"],              // For app/ at root
>   // "@/*": ["./src/*"],       // For src/app/ structure (current)
>   "@lib/*": ["./src/lib/*"],
>   "@utils/*": ["./src/utils/*"],
>   "@components/*": ["./src/components/*"],
>   "@config/*": ["./src/config/*"],
>   "@hooks/*": ["./src/hooks/*"],
>   "@context/*": ["./src/context/*"],
>   "@app/*": ["./src/app/*"],
>   "~/*": ["./public/*"]
> }
> ```

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Key Concepts & Architecture

### Server vs Client Components

**📖 Default Behavior:** In Next.js App Router, **all components are Server Components by default**. This means they run on the server during build time or request time, have access to server-only functions, and can perform database queries directly.

```typescript
// app/dashboard/page.tsx (Server Component by default - no "use client")
import { cookies } from "next/headers";
import { db } from "@/lib/database";

export default async function DashboardPage() {
  // ✅ This works - server component can use server functions
  const cookieStore = await cookies();
  const session = cookieStore.get("session");

  // ✅ Direct database access in server component
  const user = await db.user.findUnique({
    where: { sessionToken: session?.value },
  });

  return (
    <div>
      <h1>Welcome, {user?.name}!</h1>
      <UserStats userId={user?.id} /> {/* Also a server component */}
    </div>
  );
}

// This is also a Server Component (no "use client")
async function UserStats({ userId }: { userId: number }) {
  const stats = await db.userStats.findUnique({ where: { userId } });

  return (
    <div>
      <p>Posts: {stats?.totalPosts}</p>
      <p>Likes: {stats?.totalLikes}</p>
    </div>
  );
}
```

**Important Rule:** Server-side functions (using `cookies()`, `headers()`, database calls, etc.) cannot be used directly in client components (`"use client"`).

#### ❌ Wrong - Using server functions in client component

```typescript
"use client"; // Client component
import { cookies, headers } from "next/headers";
import { db } from "@/lib/database";

export function MyComponent() {
  // ❌ Error: Server functions cannot be used in client components
  const sessionCookie = cookies().get("session");
  const userAgent = headers().get("user-agent");
  const user = await db.user.findFirst(); // ❌ Also fails
  return <div>{sessionCookie?.value}</div>;
}
```

#### ✅ Solution 1: API Routes

```typescript
// src/lib/session/session.service.ts (Server function)
import "server-only"; // Ensures this file never runs on client
import { cookies, headers } from "next/headers";
import { db } from "@/lib/database";

export async function getSessionData() {
  const cookieStore = await cookies();
  const headersList = await headers();

  // Access cookies
  const session = cookieStore.get("session");
  const theme = cookieStore.get("theme");

  // Access headers
  const userAgent = headersList.get("user-agent");
  const ip = headersList.get("x-forwarded-for") || headersList.get("x-real-ip");

  if (!session) {
    return { isAuth: false, user: null, metadata: { userAgent, ip } };
  }

  // Database operations (server-only)
  const user = await db.user.findUnique({
    where: { sessionToken: session.value },
    include: { profile: true },
  });

  if (!user) {
    return { isAuth: false, user: null, metadata: { userAgent, ip } };
  }

  return {
    isAuth: true,
    user: {
      id: user.id,
      email: user.email,
      profile: user.profile,
    },
    metadata: { userAgent, ip, theme: theme?.value },
    session: session.value,
  };
}

export async function getUserPreferences(userId: number) {
  const headersList = await headers();
  const acceptLanguage = headersList.get("accept-language");

  // Server-side database call
  const preferences = await db.userPreferences.findUnique({
    where: { userId },
  });

  return {
    ...preferences,
    detectedLanguage: acceptLanguage?.split(",")[0] || "en",
  };
}

// src/app/api/session/route.ts (API Route)
import { NextResponse } from "next/server";
import { getSessionData } from "@/lib/session/session.service";

export async function GET() {
  try {
    const sessionData = await getSessionData();
    return NextResponse.json(sessionData);
  } catch (error) {
    return NextResponse.json({ error: "Failed to get session" }, { status: 500 });
  }
}

// src/components/MyComponent.tsx (Client-side)
("use client");
import { useEffect, useState } from "react";

export function MyComponent() {
  const [session, setSession] = useState(null);

  useEffect(() => {
    const fetchSession = async () => {
      const response = await fetch("/api/session");
      const data = await response.json();
      setSession(data);
    };
    fetchSession();
  }, []);

  return <div>{session?.user?.email || "Not logged in"}</div>;
}
```

#### ✅ Solution 2: Server Actions

```typescript
// src/lib/session/session.service.ts (Server function - same as above)
import "server-only";
import { cookies, headers } from "next/headers";
import { db } from "@/lib/database";

export async function getSessionData() {
  // Same implementation as above...
  const cookieStore = await cookies();
  const headersList = await headers();

  const session = cookieStore.get("session");
  const userAgent = headersList.get("user-agent");

  if (!session) {
    return { isAuth: false, user: null, metadata: { userAgent } };
  }

  const user = await db.user.findUnique({
    where: { sessionToken: session.value },
  });

  return {
    isAuth: true,
    user: { id: user.id, email: user.email },
    metadata: { userAgent },
    session: session.value,
  };
}

// src/actions/session.ts (Server Action)
("use server");
import { getSessionData } from "@/lib/session/session.service";

export async function getSessionAction() {
  try {
    const sessionData = await getSessionData();
    return sessionData;
  } catch (error) {
    throw new Error("Failed to get session data");
  }
}

// src/components/MyComponent.tsx (Client-side)
("use client");
import { useEffect, useState } from "react";
import { getSessionAction } from "@/actions/session";

export function MyComponent() {
  const [session, setSession] = useState(null);

  useEffect(() => {
    const loadSession = async () => {
      try {
        const sessionData = await getSessionAction();
        setSession(sessionData);
      } catch (error) {
        console.error("Failed to load session:", error);
      }
    };
    loadSession();
  }, []);

  return <div>{session?.user?.email || "Not logged in"}</div>;
}
```

#### 🔒 Why use `"server-only"`?

The `"server-only"` directive ensures your server functions never accidentally run on the client, protecting sensitive data and API secrets.

```typescript
// src/lib/server/analytics.service.ts
import "server-only"; // Critical for security

export async function trackUserAction(userId: number, action: string) {
  // This function contains sensitive logic that should never run on client
  const API_SECRET = process.env.ANALYTICS_SECRET_KEY; // ← Would be exposed without 'server-only'

  await fetch("https://analytics.service.com/track", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${API_SECRET}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      userId,
      action,
      timestamp: Date.now(),
    }),
  });
}

// src/lib/server/email.service.ts
import "server-only";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendWelcomeEmail(userEmail: string) {
  // Email service with secret API key
  return await resend.emails.send({
    from: "noreply@yourapp.com",
    to: userEmail,
    subject: "Welcome!",
    html: "<h1>Welcome to our app!</h1>",
  });
}
```

**📋 Available Server-Only Functions:**

- `cookies()` - Read/write HTTP cookies
- `headers()` - Access request headers (User-Agent, IP, Accept-Language, etc.)
- `redirect()` - Server-side redirects
- `notFound()` - Return 404 pages
- Database calls (`prisma`, `mongoose`, etc.)
- File system operations (`fs`, `path`)
- Environment variables (`process.env`)
- External API calls with secrets
- Server-side validation & sanitization

### Client Components & Async Functions

**Rule:** You cannot make client components themselves async when using React hooks.

#### ❌ Wrong - Async client component with hooks

```typescript
"use client";
import { useState } from "react";

// ❌ Error: Cannot use hooks in async components
export default async function MyComponent() {
  const [data, setData] = useState(null);
  const response = await fetch("/api/data");
  return <div>{data}</div>;
}
```

#### ✅ Correct - Use useEffect for async operations

```typescript
"use client";
import { useState, useEffect } from "react";

export default function MyComponent() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Async function inside useEffect
    const fetchData = async () => {
      try {
        const response = await fetch("/api/data");
        const result = await response.json();
        setData(result);
      } catch (error) {
        console.error("Failed to fetch data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <div>Loading...</div>;
  return <div>{JSON.stringify(data)}</div>;
}
```

### useSWR for Data Fetching

SWR (Stale-While-Revalidate) is a data fetching library that provides caching, revalidation, and real-time updates.

#### Basic Usage

```typescript
"use client";
import useSWR from "swr";

const fetcher = async (url: string) => {
  const response = await fetch(url);
  if (!response.ok) throw new Error("Failed to fetch");
  return response.json();
};

export function UserProfile({ userId }: { userId: number }) {
  const { data, error, isLoading, mutate } = useSWR(`/api/users/${userId}`, fetcher, {
    revalidateOnFocus: false, // Don't refetch on window focus
    refreshInterval: 5000, // Poll every 5 seconds
    revalidateOnMount: true, // Fetch on component mount
  });

  if (isLoading) return <div>Loading user...</div>;
  if (error) return <div>Error: {error.message}</div>;
  if (!data) return <div>No user found</div>;

  return (
    <div>
      <h1>{data.name}</h1>
      <button onClick={() => mutate()}>Refresh</button>
    </div>
  );
}
```

#### Advanced useSWR with Error Handling

```typescript
"use client";
import useSWR from "swr";

const fetcher = async (url: string) => {
  const response = await fetch(url);

  // Handle 401 as "no session" instead of error
  if (response.status === 401) return null;

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || "API Error");
  }

  return response.json();
};

export function useSession() {
  const { data, error, isLoading, mutate } = useSWR("/api/auth/session", fetcher, {
    refreshInterval: 30000, // Check session every 30s
    shouldRetryOnError: false, // Don't retry on errors
    revalidateOnFocus: false,
  });

  return {
    session: data,
    isLoading,
    error,
    refresh: mutate,
    invalidate: () => mutate(null, false), // Clear cache
  };
}
```

### Server Actions

Server Actions allow you to call server-side functions directly from client components without creating API routes. They can handle database operations, external API calls, and server-side logic.

#### ✅ Benefits of Server Actions for External APIs:

- **Direct function calls** - No need to create intermediate API routes
- **Server-side environment** - Access to server environment variables and secrets
- **Built-in error handling** - Automatic serialization of errors
- **Type safety** - Full TypeScript support between client and server
- **Automatic revalidation** - Built-in cache invalidation with `revalidatePath()`

#### ❌ When to use API Routes instead:

- **Third-party integrations** - When external services need to call your endpoints
- **RESTful APIs** - When building a traditional REST API for multiple clients
- **Complex middleware** - When you need custom authentication/authorization logic
- **Webhooks** - When receiving data from external services

#### Creating a Server Action

```typescript
// src/actions/auth.ts
"use server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

// Simple user registration server action
export async function registerUser(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!email || !password) {
    throw new Error("Email and password are required");
  }

  // Call external auth API
  const response = await fetch(`${process.env.API_BASE}/auth/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    throw new Error("Registration failed");
  }

  const user = await response.json();
  revalidatePath("/dashboard");
  redirect("/dashboard");
}

// Product management server action
export async function createProduct(productData: ProductCreate) {
  const response = await fetch(`${process.env.API_BASE}/products`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.API_TOKEN}`,
    },
    body: JSON.stringify(productData),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to create product");
  }

  const product = await response.json();
  revalidatePath("/products");
  return product;
}
```

#### Using Server Actions in Forms

```typescript
// src/components/CreateUserForm.tsx
"use client";
import { createUser } from "@/actions/user";
import { useState } from "react";

export function CreateUserForm() {
  const [pending, setPending] = useState(false);

  const handleSubmit = async (formData: FormData) => {
    setPending(true);
    try {
      await createUser(formData);
      // Form submission handled by server action (redirect)
    } catch (error) {
      console.error("Failed to create user:", error);
      alert("Failed to create user");
    } finally {
      setPending(false);
    }
  };

  return (
    <form action={handleSubmit}>
      <input name="name" placeholder="Name" required />
      <input name="email" type="email" placeholder="Email" required />
      <button type="submit" disabled={pending}>
        {pending ? "Creating..." : "Create User"}
      </button>
    </form>
  );
}
```

#### Using Server Actions for External API Calls

```typescript
// src/components/RegisterForm.tsx
"use client";
import { registerUser } from "@/actions/auth";
import { useState } from "react";

export function RegisterForm() {
  const [pending, setPending] = useState(false);

  const handleSubmit = async (formData: FormData) => {
    setPending(true);
    try {
      await registerUser(formData);
      // Redirect handled by server action
    } catch (error) {
      console.error("Registration failed:", error);
      alert(error.message);
    } finally {
      setPending(false);
    }
  };

  return (
    <form action={handleSubmit}>
      <input name="email" type="email" placeholder="Email" required />
      <input name="password" type="password" placeholder="Password" required />
      <button type="submit" disabled={pending}>
        {pending ? "Creating account..." : "Register"}
      </button>
    </form>
  );
}
```

#### Client Service Pattern (Current Architecture)

Your project uses a clean separation between server and client services:

```typescript
// Server-side service (for API routes, server components)
// src/lib/products/services/product.service.ts
export async function fetchProducts(
  filters?: ProductFiltersParams,
): Promise<PageProduct<Product[]> | CrudApiError> {
  const res = await apiClient(true, config).get(PRODUCTS_URL);
  return res.data;
}

// Client-side service (for client components)
// src/lib/products/services/product.client.service.ts
export async function fetchProducts(
  filters?: ProductFiltersParams,
): Promise<PageProduct<Product[]> | CrudApiError> {
  const res = await frontendHttp().get(PRODUCTS_URL);
  return res.data;
}

// Usage in client component
("use client");
import { fetchProducts } from "@/lib/products/services/product.client.service";

export function ProductList() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const data = await fetchProducts({ search: "laptop" });
        setProducts(data);
      } catch (error) {
        console.error("Failed to load products:", error);
      } finally {
        setLoading(false);
      }
    };
    loadProducts();
  }, []);

  if (loading) return <div>Loading...</div>;
  return (
    <div>
      {products.map((product) => (
        <div key={product.id}>{product.name}</div>
      ))}
    </div>
  );
}
```

#### Server Actions vs API Routes Comparison

```typescript
// ❌ Traditional approach: API Route + Client Service
// src/app/api/products/route.ts
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const search = searchParams.get("search");

  const response = await fetch(`${API_BASE}/products?search=${search}`, {
    headers: {
      Authorization: `Bearer ${process.env.API_TOKEN}`,
    },
  });
  return NextResponse.json(await response.json());
}

// src/lib/products/services/product.client.service.ts
export async function fetchProducts(filters?: ProductFilters) {
  const params = new URLSearchParams();
  if (filters?.search) params.append("search", filters.search);

  const url = `/api/products?${params}`;
  const response = await fetch(url);
  return response.json();
}

// ✅ Server Actions approach: Direct server function call
// src/actions/products.ts
("use server");
export async function fetchProductsAction(filters?: ProductFilters) {
  const params = new URLSearchParams();
  if (filters?.search) params.append("search", filters.search);

  const response = await fetch(`${process.env.API_BASE}/products?${params}`, {
    headers: {
      Authorization: `Bearer ${process.env.API_TOKEN}`,
    },
  });

  if (!response.ok) throw new Error("Failed to fetch products");
  return response.json();
}

// Usage in component
("use client");
import { fetchProductsAction } from "@/actions/products";

export function ProductList() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const loadProducts = async () => {
      const data = await fetchProductsAction({
        search: "laptop",
      });
      setProducts(data);
    };
    loadProducts();
  }, []);
}
```

#### Server Actions with useTransition

```typescript
"use client";
import { deleteUser } from "@/actions/user";
import { useTransition } from "react";

export function DeleteButton({ userId }: { userId: number }) {
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    if (confirm("Are you sure?")) {
      startTransition(async () => {
        await deleteUser(userId);
      });
    }
  };

  return (
    <button onClick={handleDelete} disabled={isPending}>
      {isPending ? "Deleting..." : "Delete"}
    </button>
  );
}
```

### Client Services Pattern

When calling API routes from client-side services, always use async/await with proper error handling.

#### Architecture Overview

Your project follows a clean service architecture:

```
src/lib/
├── auth/
│   ├── auth.service.ts          # Server-side (with Config)
│   └── auth.client.service.ts   # Client-side (with frontendHttp)
├── products/
│   └── services/
│       ├── product.service.ts         # Server-side
│       └── product.client.service.ts  # Client-side
└── shared/helpers/
    └── crud-api-error.ts       # Error handling utilities
```

#### Server Service Example (for API routes, server components)

```typescript
// src/lib/auth/auth.service.ts
import apiClient, { Config } from "@config/api.config";

export async function signIn(login: Login, config?: Config): Promise<User | CrudApiError> {
  try {
    const res = await apiClient(true, config).post<User>(loginUrl, login);
    return res.data;
  } catch (error) {
    return crudApiErrorResponse(error, "signIn");
  }
}

export async function signUp(
  registration: Register,
  config?: Config,
): Promise<User | CrudApiError> {
  try {
    await apiClient(true, config).post(registerUrl, registration);
    // Auto sign-in after registration
    return await signIn(registration, config);
  } catch (error) {
    throw new ApiError(error.message, error.status, error.type);
  }
}
```

#### Client Service Example (for client components)

```typescript
// src/lib/products/services/product.client.service.ts
import { frontendHttp } from "@config/axios/frontend-http.config";

export async function fetchProducts(
  filters?: ProductFiltersParams,
): Promise<PageProduct<Product[]> | CrudApiError> {
  const params = new URLSearchParams();
  if (filters?.search) params.append("search", filters.search);

  const url = params.toString() ? `${PRODUCTS_URL}?${params}` : PRODUCTS_URL;
  const res = await frontendHttp().get(url);
  return res.data;
}

export async function createProduct(product: ProductCreate): Promise<Product | CrudApiError> {
  const res = await frontendHttp().post(PRODUCTS_URL, product);
  return res.data;
}

export async function deleteProduct(id: number): Promise<{ success: boolean }> {
  await frontendHttp().delete(`${PRODUCTS_URL}/${id}`);
  return { success: true };
}
```

#### Using Client Service in Components

```typescript
// src/components/ProductManager.tsx
"use client";
import { useState, useEffect } from "react";
import {
  fetchProducts,
  createProduct,
  deleteProduct,
} from "@/lib/products/services/product.client.service";
import { Product, ProductCreate } from "@/lib/products/models/product.model";

export function ProductManager() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);

  // Load products on mount
  useEffect(() => {
    const loadProducts = async () => {
      try {
        const result = await fetchProducts({ isActive: true });

        // Handle error response
        if ("error" in result) {
          console.error("Failed to load products:", result.message);
          return;
        }

        setProducts(result.data || []);
      } catch (error) {
        console.error("Failed to load products:", error);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  // Create new product
  const handleCreateProduct = async (productData: ProductCreate) => {
    setCreating(true);
    try {
      const result = await createProduct(productData);

      if ("error" in result) {
        alert(`Create failed: ${result.message}`);
        return;
      }

      // Add to local state
      setProducts((prev) => [...prev, result]);
      alert("Product created successfully!");
    } catch (error) {
      console.error("Create failed:", error);
      alert("Failed to create product");
    } finally {
      setCreating(false);
    }
  };

  // Delete product
  const handleDelete = async (productId: number) => {
    if (!confirm("Are you sure?")) return;

    try {
      await deleteProduct(productId);
      setProducts((prev) => prev.filter((p) => p.id !== productId));
      alert("Product deleted successfully!");
    } catch (error) {
      console.error("Delete failed:", error);
      alert("Failed to delete product");
    }
  };

  if (loading) return <div>Loading products...</div>;

  return (
    <div>
      <h1>Products ({products.length})</h1>

      <button
        onClick={() => handleCreateProduct({ name: "New Product", price: 99 })}
        disabled={creating}
      >
        {creating ? "Creating..." : "Add Product"}
      </button>

      <ul>
        {products.map((product) => (
          <li key={product.id}>
            {product.name} - ${product.price}
            <button onClick={() => handleDelete(product.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
```

## Development Tools Installation

### ESLint

ESLint is already configured in this project. To install or reinstall it:

```bash
npm install eslint --save-dev
```

### Cross-platform env scripts (shx)

This project uses small npm scripts to copy environment files (e.g. `env/.env.local` → `.env`). To make those scripts work the same on macOS/Linux and Windows we use `shx` (a cross-platform shell utility).

Install it as a dev-dependency using the `-D` shorthand:

```bash
npm install -D shx
# or
yarn add -D shx
```

After installing, the package scripts (e.g. `npm run env:local`) use `shx cp -f env/.env.local .env` so you can run them on any platform.

### Tip: prefer rimraf for recursive clean/remove tasks

For removing build output or `node_modules` recursively, `rimraf` is more reliable than using `shx rm -rf` on Windows and in CI. `rimraf` is a dedicated Node utility designed to handle Windows-specific edge cases (locked files, long paths, ENOTEMPTY errors) and is commonly used in npm scripts.

- Why use `rimraf`:
  - Handles Windows file/permission edge cases more robustly
  - Widely used and battle-tested in CI environments
  - Simple to call from npm scripts via `npx` or as a devDependency

- Example script (package.json):

```json
"scripts": {
  "clean": "npx rimraf .next dist build out node_modules",
  "bootstrap": "npm run clean && npm install && npm run env:local"
}
```

Use `shx` for lightweight file ops (copy, chmod) and `rimraf` for destructive recursive deletes.

### Husky

Husky allows you to set up Git hooks easily. To install and configure it:

```bash
# Install Husky
npm install husky --save-dev

# Initialize Husky
npx husky init

# Add a pre-commit hook (runs lint-staged)
echo '#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

npx --no-install lint-staged' > .husky/pre-commit

# Add a commit-msg hook (runs commitlint)
echo '#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

npx --no-install commitlint --edit $1' > .husky/commit-msg
```

### Lint-Staged & Prettier

Install lint-staged and prettier for automatic formatting on commit:

```bash
npm install lint-staged prettier --save-dev
```

Add these scripts to your `package.json`:

```json
"scripts": {
  "check": "npx prettier --check .",
  "format": "npx prettier --write ."
}
```

- `npm run check` → Check if code is properly formatted (without modifying)
- `npm run format` → Automatically format all files

### Commitlint

Install commitlint to enforce conventional commit messages:

```bash
npm install @commitlint/cli @commitlint/config-conventional --save-dev

# Create commitlint config
echo "module.exports = { extends: ['@commitlint/config-conventional'] };" > commitlint.config.js
```

### Shadcn/ui

Shadcn/ui is a collection of reusable components built with Radix UI and Tailwind CSS.

```bash
# Initialize shadcn/ui
npx shadcn@latest init

# Add components (examples)
npx shadcn@latest add button
npx shadcn@latest add input
npx shadcn@latest add card

# Add multiple components at once
npx shadcn@latest add button input card dialog
```

> 💡 **Tip:** Browse all available components at [ui.shadcn.com/docs/components](https://ui.shadcn.com/docs/components)

### Axios & Next-Logger (Pino)

Axios is a promise-based HTTP client, and Pino provides structured logging for Next.js.

```bash
# Install all packages together
npm install axios next-logger pino pino-pretty
```

**Axios usage example:**

```typescript
import axios from "axios";

// GET request
const response = await axios.get("/api/users");

// POST request with Bearer token
const response = await axios.post(
  "/api/users",
  { name: "John" },
  {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  },
);
```

**Create a logger utility** (`src/lib/logger.ts`):

```typescript
import pino from "pino";

const isDev = process.env.NODE_ENV === "development";

const logger = pino({
  level: isDev ? "debug" : "info",
  transport: isDev
    ? {
        target: "pino-pretty",
        options: {
          colorize: true,
          translateTime: "SYS:standard",
        },
      }
    : undefined,
});

export default logger;

// Create a child logger with context
export const createLogger = (context: string) => {
  return logger.child({ context });
};
```

**Usage in services:**

```typescript
import { createLogger } from "@/lib/logger";

const logger = createLogger("UserService");

// Log info
logger.info({ userId: 1 }, "User fetched successfully");

// Log errors
logger.error({ err: error }, "Failed to fetch user");

// Log with additional context
logger.warn({ email: "test@example.com" }, "Login attempt failed");
```

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
