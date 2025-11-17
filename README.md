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