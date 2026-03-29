# NextAuth v5 (Auth.js) — Implémentation & Référence

## Fichier source unique

```
src/lib/auth.ts               # Configuration NextAuth — source de vérité
```

Tout part de `auth.ts` :

```ts
export const { handlers, auth, signIn, signOut } = NextAuth({ ... })
```

---

## Les 4 exports de NextAuth

### `handlers`

Route handler HTTP pour NextAuth. Branché sur `app/api/auth/[...nextauth]/route.ts`.
Gère automatiquement : `GET /api/auth/session`, `POST /api/auth/signin`, `POST /api/auth/signout`, etc.

```ts
// app/api/auth/[...nextauth]/route.ts
import { handlers } from "@/lib/auth";
export const { GET, POST } = handlers;
```

### `auth`

Fonction serveur pour lire la session courante. Lit et déchiffre le cookie JWT **localement** (pas de réseau, ~1ms).
Utilisable dans : RSC, Server Actions, API Routes, Middleware.

```ts
import { auth } from "@/lib/auth";

const session = await auth();
session?.user.firstName; // string
session?.user.role; // "ADMIN" | "USER"
session?.user.id; // string (JWT sub)
```

### `signIn`

Fonction serveur pour créer une session. Utilisée dans les Server Actions.

```ts
import { signIn } from "@/lib/auth";

await signIn("credentials", { email, password, redirect: false });
```

### `signOut`

Fonction serveur pour détruire la session (supprime le cookie JWT).

```ts
import { signOut } from "@/lib/auth";

await signOut({ redirect: false });
```

---

## Le cookie JWT — comment ça marche

```
Connexion →  authorize()  →  jwt() callback  →  cookie chiffré
                              stocke tout dans le token

Requête  →  auth()  →  déchiffre cookie  →  session() callback  →  session.user
```

Le JWT est **stocké côté client** (cookie httpOnly, signé). Aucune base de données n'est consultée à chaque requête.

### Données dans le JWT

Configuré dans `jwt()` callback :

```ts
token.role; // rôle utilisateur
token.firstName; // prénom
token.lastName; // nom
token.phoneNumber; // téléphone
token.avatarUrl; // URL avatar
token.access_token; // token backend
token.refresh_token;
```

### Données exposées dans session.user

Mappées depuis le token dans `session()` callback :

```ts
session.user.id; // string (JWT sub = ID externe)
session.user.email; // string
session.user.name; // "firstName lastName"
session.user.role; // string
session.user.firstName; // string
session.user.lastName; // string
session.user.phoneNumber; // string
session.user.avatarUrl; // string | undefined
session.user.access_token; // string | undefined
session.user.refresh_token; // string | undefined
```

---

## SessionProvider

Wrapper React qui expose la session à tous les Client Components via `useSession()`.

```tsx
// app/layout.tsx — root layout (Server Component async)
import { SessionProvider } from "next-auth/react";
import { auth } from "@/lib/auth";

export default async function RootLayout({ children }) {
  const session = await auth(); // lit le cookie côté serveur

  return <SessionProvider session={session}>{children}</SessionProvider>;
}
```

**Pourquoi passer `session` en prop ?**
Sans ce prop, `SessionProvider` démarre vide → fait un fetch asynchrone vers `/api/auth/session` → flash de `status: "loading"`.
Avec ce prop, le client démarre déjà avec la session → `status: "authenticated"` immédiat, zéro flash.

---

## useSession()

Hook client pour accéder à la session dans les Client Components.

```ts
import { useSession } from "next-auth/react";

const { data: session, status, update } = useSession();
```

### `data` (session)

Objet session ou `null`. Contient `session.user.*` avec tous les champs configurés.

### `status`

- `"loading"` — session en cours de chargement (seulement si `SessionProvider` n'a pas été hydraté)
- `"authenticated"` — session active, `data` contient l'utilisateur
- `"unauthenticated"` — pas de session, `data` est `null`

### `update(data?)`

Force la mise à jour du JWT + resynchronise le `SessionProvider`.

**Sans argument** — refetch la session depuis le serveur :

```ts
await update(); // utilisé après signIn via Server Action
```

**Avec données** — met à jour le JWT sans re-login (déclenche `jwt` callback avec `trigger: "update"`) :

```ts
await update({
  firstName: "Nouveau",
  avatarUrl: "https://...",
});
```

Le callback `jwt` dans `auth.ts` gère ce cas :

```ts
jwt({ token, trigger, session }) {
  if (trigger === "update" && session) {
    return { ...token, ...session }  // merge les nouvelles données
  }
  ...
}
```

---

## Patterns par contexte

### Server Component / RSC

```ts
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

const session = await auth();
if (!session) redirect("/sign-in");

const user = session.user; // accès direct, pas de hook
```

### Server Action

```ts
"use server";
import { auth } from "@/lib/auth";

export async function myAction() {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");

  // utiliser session.user.access_token pour appels backend
}
```

### API Route

```ts
import { auth } from "@/lib/auth";

export async function GET() {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ status: 401 }, { status: 401 });

  // session.user.access_token pour authentifier les appels backend
}
```

### Client Component

```tsx
"use client";
import { useSession } from "next-auth/react";

export function MyComponent() {
  const { data: session, status } = useSession();

  if (status === "loading") return <Skeleton />;
  if (!session?.user) return null;

  return <p>Bonjour {session.user.firstName}</p>;
}
```

### Middleware (Edge)

```ts
// src/proxy.ts (renommé middleware.ts si Next.js ne détecte pas proxy.ts)
import { auth } from "@/lib/auth";

export default auth(function middleware(req) {
  const isAuthenticated = !!req.auth; // req.auth = session NextAuth
  // redirection selon état d'authentification
});
```

---

## Flow complet Sign-In

```
1. SignInForm           → signInAction({ email, password })
                                ↓ Server Action
2. auth.ts authorize()  → appel backend → retourne user data
                                ↓
3. auth.ts jwt()        → stocke user data dans le JWT cookie
                                ↓
4. Cookie httpOnly      → posé sur le navigateur
                                ↓
5. await update()       → SessionProvider refetch /api/auth/session
                                ↓
6. useSession()         → status: "authenticated", data: session.user
                                ↓
7. router.push(...)     → navigation (session déjà disponible)
```

## Flow complet Sign-Out

```
1. SignOutButton        → signOutAction()
                                ↓ Server Action
2. signOut()            → supprime le cookie JWT
                                ↓
3. window.location.href → navigation forcée (full reload)
                                ↓
4. SessionProvider      → démarre avec session=null (depuis layout)
5. useSession()         → status: "unauthenticated"
```

## Flow mise à jour profil

```
1. ProfileEditForm      → editProfileAction(data)    → met à jour le backend
2.                      → await update({ firstName, avatarUrl, ... })
                                ↓
3. auth.ts jwt()        → trigger="update" → merge données dans le token
                                ↓
4. Cookie JWT           → mis à jour avec les nouvelles données
5. useSession()         → session.user.firstName reflète immédiatement le changement
```

---

## Ce qu'il ne faut jamais faire

| ❌ Interdit                                                             | ✅ Correct                                                |
| ----------------------------------------------------------------------- | --------------------------------------------------------- |
| `import { useSession } from "next-auth/react"` dans un Server Component | `await auth()`                                            |
| `getServerSession(authOptions)`                                         | `await auth()` (v5, plus besoin de passer authOptions)    |
| `getSession()` de `next-auth/react` côté serveur                        | `await auth()` (évite un call HTTP inutile vers soi-même) |
| `import { auth } from "next-auth/react"`                                | `import { auth } from "@/lib/auth"`                       |
| Wrapper `useSession` dans un hook custom                                | Utiliser `useSession` directement                         |

---

## Résumé des imports

```ts
// Serveur (RSC, Server Action, API Route, Middleware)
import { auth, signIn, signOut } from "@/lib/auth";

// Client (Client Component)
import { useSession } from "next-auth/react";
```
