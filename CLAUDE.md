# CLAUDE.md — Nextjs Starter Kit

Ce fichier est lu automatiquement par Claude à chaque conversation. Il documente l'architecture complète du projet pour permettre une adaptation rapide à n'importe quel domaine métier.

---

## Stack technique

| Outil                   | Usage                                                |
| ----------------------- | ---------------------------------------------------- |
| Next.js 15 (App Router) | Framework principal                                  |
| TypeScript (strict)     | Typage                                               |
| Tailwind CSS v4         | Styling (`bg-linear-to-br`, pas `bg-gradient-to-br`) |
| shadcn/ui               | Composants UI                                        |
| react-hook-form + zod   | Formulaires et validation                            |
| react-toastify          | Notifications toast                                  |
| lucide-react            | Icônes                                               |
| Better Auth             | Authentification (JWT via Jose)                      |
| axios                   | HTTP client                                          |

---

## Architecture des routes (App Router)

```
src/app/
├── (auth)/                         # Groupe auth (sign-in, sign-up, forgot-password, reset-password)
├── (account)/account/              # Espace utilisateur connecté
│   ├── layout.tsx                  # Layout avec UserSidebar (sidebar blanche)
│   ├── page.tsx                    # Accueil compte
│   ├── profile/page.tsx            # Voir profil
│   ├── profile/edit/page.tsx       # Modifier profil
│   └── settings/change-password/  # Changer mot de passe
├── (dashboard)/dashboard/          # Backoffice admin
│   ├── layout.tsx                  # Layout avec AppSidebar (sidebar noire)
│   ├── page.tsx                    # Accueil dashboard
│   ├── users/                      # CRUD utilisateurs
│   ├── categories/                 # CRUD catégories
│   └── products/                   # CRUD produits
└── api/                            # API Routes Next.js
    ├── auth/                       # login, register, session
    ├── users/[id]/
    ├── categories/[id]/
    └── products/[id]/
```

---

## Architecture lib/ — Pattern par entité

Chaque entité métier suit exactement ce pattern :

```
src/lib/{entity}/
├── models/
│   └── {entity}.model.ts           # Types TypeScript + schéma Zod
└── services/
    ├── {entity}.service.ts         # Service serveur (appels API backend)
    └── {entity}.client.service.ts  # Service client (fetch depuis le browser)
```

### Exemple : entité `product`

**`product.model.ts`**

```ts
export type Product = { id: number; name: string; price: number; stock: number; isActive: boolean; createdAt: string; category?: Category }
export type ProductFormData = { name: string; price: number; ... }
export const ProductSchema = z.object({ name: z.string().min(1), ... })
```

**`product.service.ts`** (serveur)

```ts
export async function getProducts(): Promise<ApiResponse<Product[]>>;
export async function getProductById(id: number): Promise<ApiResponse<Product>>;
export async function createProduct(data): Promise<ApiResponse<Product>>;
export async function updateProduct(id, data): Promise<ApiResponse<Product>>;
export async function deleteProduct(id): Promise<ApiResponse<void>>;
```

**`product.client.service.ts`** (client — appelle les API routes Next.js)

```ts
export async function createProduct(data): Promise<{ ok: true } | { ok: false; error }>;
export async function updateProduct(id, data);
export async function deleteProduct(id);
```

---

## Architecture composants — Pattern par entité

```
src/components/features/dashboard/{entity}/
├── {entity}-list.tsx               # Tableau avec DataTable + ConfirmModal
├── {entity}-detail.tsx             # Page détail (hero + grille infos)
├── {entity}-create-form.tsx        # Formulaire création
└── {entity}-edit-form.tsx          # Formulaire édition (pré-rempli)
```

### Pages (App Router) — 1 page = 1 composant

```
src/app/(dashboard)/dashboard/{entity}/
├── page.tsx                        # → <EntityList initialEntities={data} />
├── [id]/page.tsx                   # → <EntityDetail entity={data} />
├── create/page.tsx                 # → <EntityCreateForm />
└── edit/[id]/page.tsx              # → <EntityEditForm loadedEntity={data} />
```

---

## Conventions de nommage

| Élément             | Convention          | Exemple                      |
| ------------------- | ------------------- | ---------------------------- |
| Fichiers composants | kebab-case          | `product-list.tsx`           |
| Composants React    | PascalCase          | `ProductList`                |
| Fichiers services   | kebab-case          | `product.service.ts`         |
| Routes API          | `route.ts`          | `app/api/products/route.ts`  |
| Types/Modèles       | PascalCase          | `Product`, `ProductFormData` |
| Schémas Zod         | PascalCase + Schema | `ProductSchema`              |

---

## Design System — Couleurs par entité

| Entité            | Couleur principale | Usage                                  |
| ----------------- | ------------------ | -------------------------------------- |
| **Users**         | `emerald`          | Hero `via-emerald-950`, badge, boutons |
| **Categories**    | `violet`           | Hero `via-violet-950`, badge, boutons  |
| **Products**      | `blue`             | Hero `via-blue-950`, badge, boutons    |
| **Auth/Account**  | `indigo`           | Layout account, formulaires auth       |
| **Password**      | `orange/red`       | Change password                        |
| **Danger/Delete** | `red/rose`         | ConfirmModal                           |

### Pattern hero sombre (pages detail + formulaires)

```tsx
<div className="relative overflow-hidden rounded-2xl bg-linear-to-br from-slate-900 via-{color}-950 to-slate-900 p-7 shadow-xl">
  <div className="pointer-events-none absolute -top-16 -right-16 h-56 w-56 rounded-full bg-{color}-500/20 blur-3xl" />
  <div className="pointer-events-none absolute -bottom-12 -left-8 h-40 w-40 rounded-full bg-{color2}-500/15 blur-3xl" />
  {/* Icon + titre */}
</div>
```

### Pattern formulaire

```tsx
<div className="max-w-3xl lg:max-w-5xl mx-auto space-y-6">
  {/* Hero sombre */}
  <div className="rounded-2xl border border-gray-100 bg-white shadow-sm p-7">
    <form className="space-y-5">
      {/* Grille 2 colonnes pour les champs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <Field label="..." icon={<Icon />} error={errors.x?.message}>
          <input className={ic} {...register("x")} />
        </Field>
      </div>
    </form>
  </div>
</div>
```

---

## Composants partagés dashboard

| Composant        | Fichier                       | Usage                                      |
| ---------------- | ----------------------------- | ------------------------------------------ |
| `DataTable`      | `dashboard/data-table.tsx`    | Tableau générique avec skeleton loading    |
| `ConfirmModal`   | `dashboard/confirm-modal.tsx` | Modal suppression avec hero rouge + alerte |
| `LoadingPage`    | `features/loading.tsx`        | Overlay de chargement plein écran          |
| `ValidationItem` | `ui/validation-item.tsx`      | Checklist validation mot de passe          |

---

## Authentification

```
src/lib/auth/
├── api/
│   ├── auth.ts           # Façade serveur (import dans Server Components/Actions)
│   └── auth.client.ts    # Façade client (import dans Client Components)
├── actions/auth.ts        # Server Actions (changePassword, etc.)
├── context/auth.user.context.tsx   # AuthUserProvider + useAuthUser()
├── jose/jose.service.ts   # JWT encode/decode (serveur)
└── models/auth.model.ts   # Types + Zod schemas auth
```

**Règle impérative** :

- `import { auth } from "@/lib/auth/api/auth"` → serveur uniquement
- `import { authClient } from "@/lib/auth/api/auth.client"` → client uniquement

---

## Sidebar & Layout

### Dashboard (admin)

- **Sidebar** : `AppSidebar` — fond `bg-slate-950`, accent `emerald`
- **Layout** : `app/(dashboard)/dashboard/layout.tsx`
- **Breadcrumb** : `DashboardBreadcrumb` (dynamique, lit le pathname)
- **NavMain** : `nav-main.tsx` — active state emerald, sous-items avec icônes

### Account (utilisateur)

- **Sidebar** : `UserSidebar` — fond `bg-white`, accent `indigo`
- **Layout** : `app/(account)/account/layout.tsx`
- **Breadcrumb** : `AccountBreadcrumb` (dynamique)
- **NavMain** : `nav-main-user.tsx` — active state indigo, sous-items avec icônes
- **Brand** : `AccountBrand` (logo indigo/violet)

### NavUser

- `variant="dark"` → utilisé dans AppSidebar (fond sombre)
- `variant="light"` → utilisé dans UserSidebar (fond blanc)

---

## Routes (utils/routes.ts)

```ts
ROUTES = {
  HOME,
  MY_ACCOUNT,
  VIEW_PROFILE,
  EDIT_PROFILE,
  CHANGE_PASSWORD,
  SETTINGS,
  DASHBOARD,
  CATEGORIES,
  PRODUCTS,
  USERS,
  SIGN_IN,
  SIGN_UP,
  FORGOT_PASSWORD,
  RESET_PASSWORD,
};
```

Les routes CRUD dashboard se construisent comme :

```ts
`${DASHBOARD}${PRODUCTS}` // /dashboard/products
`${DASHBOARD}${PRODUCTS}/${id}` // /dashboard/products/123
`${DASHBOARD}${PRODUCTS}/create` // /dashboard/products/create
`${DASHBOARD}${PRODUCTS}/edit/${id}`; // /dashboard/products/edit/123
```

---

## Adapter le projet à un autre domaine

### Exemple : remplacer `products` par `hospitals`

1. **Modèle** : créer `src/lib/hospitals/models/hospital.model.ts`
2. **Services** : créer `hospital.service.ts` + `hospital.client.service.ts`
3. **API routes** : créer `src/app/api/hospitals/route.ts` + `[id]/route.ts`
4. **Pages** : créer `src/app/(dashboard)/dashboard/hospitals/` avec `page.tsx`, `[id]/page.tsx`, `create/page.tsx`, `edit/[id]/page.tsx`
5. **Composants** : créer `src/components/features/dashboard/hospitals/` avec list, detail, create-form, edit-form
6. **Routes** : ajouter `HOSPITALS: "/hospitals"` dans `utils/routes.ts`
7. **Sidebar** : ajouter l'entrée dans `app-sidebar.tsx` > `data.navMain`
8. **Couleur** : choisir une couleur (ex: `teal`, `cyan`, `amber`) et l'appliquer dans les composants

### Checklist par entité

- [ ] `{entity}.model.ts` — Type + FormData + Schema Zod
- [ ] `{entity}.service.ts` — CRUD serveur
- [ ] `{entity}.client.service.ts` — CRUD client
- [ ] `api/{entities}/route.ts` — GET (list) + POST (create)
- [ ] `api/{entities}/[id]/route.ts` — GET + PUT + DELETE
- [ ] `{entity}-list.tsx` — columns DataTable + ConfirmModal
- [ ] `{entity}-detail.tsx` — hero + grille infos
- [ ] `{entity}-create-form.tsx` — formulaire + validation
- [ ] `{entity}-edit-form.tsx` — formulaire pré-rempli
- [ ] Pages App Router (4 pages)
- [ ] Entrée dans `ROUTES` + sidebar

---

## Commandes utiles

```bash
npx tsc --noEmit          # Vérifier les erreurs TypeScript
npm run dev               # Développement
npm run build             # Build production
```
