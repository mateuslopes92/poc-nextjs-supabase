# POC with NextJS and Supabase

## Next

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

### How to run?

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

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.


### NextJS (Folder structure, Features and more)
*Folders and file conventions*
Top-level folders:
- app: App router
- pages: Pages router
- public: Static assets to be served
- src: Optional application source folder

We also have some specific configuration files as `next.config.js` and others for routing like: layouts, templates, loading, errors, etc...

The routes can be nested by folder: `app/blog/page.tsx	/blog	Public route` or
can be dynamic: `app/blog/[slug]/page.tsx	/blog/my-first-post`.

Route groups and private folders:
| Path                          | URL   | Pattern Notes                             |
| :---------------------------- | :---- | :---------------------------------------- |
| app/(marketing)/page.tsx      | /     | Group omitted from URL                    |
| app/(shop)/cart/page.tsx      | /cart | Share layouts within (shop)               |
| app/blog/_components/Post.tsx | —     | Not routable; safe place for UI utilities |
| app/blog/_lib/data.ts         | —     | Not routable; safe place for utils        |

## Supabase
Complete backend for web and mobile applications based on FOSS(FREE OPEN SOURCE SOFTWARE).

Its a firebase alternative.

Provide:
- Backend(infra):
  - Database
  - File storage
  - Edge functions
- Frontend:
  - sdks that connect easily the infra into your favorite javascript framework

Gives the ability to manage your postgresql database with an easy to understand UI to provide rest and graphQl apis to use.

Have authentication as well, realtime and lots of features.

### Integrating with NextJS
First need to install the dependencies: `yarn add @supabase/supabase-js @supabase/ssr`.

All bellow items are in docs: https://supabase.com/docs/guides/getting-started/quickstarts/nextjs

then add the .env file:
```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```

Also create a server.ts file inside of utils folder:
```

import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { cookies } from "next/headers";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const createClient = (cookieStore: ReturnType<typeof cookies>) => {
  return createServerClient(
    supabaseUrl!,
    supabaseKey!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options))
          } catch {
            // The `setAll` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
    },
  );
};

```

Also needed a client.ts file inside of utils:
```

import { createBrowserClient } from "@supabase/ssr";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const createClient = () =>
  createBrowserClient(
    supabaseUrl!,
    supabaseKey!,
  );

```

finally a middleware to supabase inside of utils:
```

import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const createClient = (request: NextRequest) => {
  // Create an unmodified response
  let supabaseResponse = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabase = createServerClient(
    supabaseUrl!,
    supabaseKey!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    },
  );

  return supabaseResponse
};

```