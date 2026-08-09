# WebKit Sample — Agent Guide

## Stack
Vue 3 + Vite 8 + Tailwind CSS 4 + antdv-next (+ Vant for mobile views)

## Setup
```bash
npm i --force    # required: force install due to peer dep conflicts
```

## Dev & Build
```bash
npm run dev      # npx vite --mode dev       → loads .env + .env.dev
npm run build    # npx vite build --mode pro  → loads .env + .env.pro
```

Vite 8 (not v5), config at `vite.config.mjs`.

## Architecture
- **Entry**: `src/main.js` → `src/plugins/webkit.js` bootstraps router, store, global components
- **App shell**: `src/App.vue` — wraps `<router-view>` in antdv's `a-config-provider` + `a-app`
- **Router**: defined in `src/router/index.js`, uses `lib/router` for base setup + interceptors (`routeBaseBefore`/`routeBaseAfter`)
- **Lib** (`lib/`): reusable toolkit — components, layout, request, store, router, service, utils. Imported via absolute paths (e.g. `/lib/router`)
- **Views**: admin views in `src/views/`, mobile views in `src/views-app/`

## UI Frameworks
- **antdv-next** (no import needed): auto-imported by `unplugin-vue-components` via `@antdv-next/auto-import-resolver`
- **Vant** (for mobile pages): also auto-imported; CSS loaded globally in `webkit.js`
- **Icons**: `vite-plugin-svg-icons` — put SVGs in `src/assets/icons/`, use `<KitIcon>` component

## Key Conventions
- Vite base URL comes from env var `VITE_ASSETS_BASE_URL`
- `lib/plugin/vite-helper.js` reads env with `loadEnv(mode, process.cwd())` — only `VITE_*` vars are exposed
- TinyMCE: place language pack in `public/tinymce/`
- `lib/plugin/vite-add-element.js` exists but is **not wired** into `vite.config.mjs`
- No tests, no linter, no typecheck config — only Prettier (`semi: false`)
- Chinese locale (antdv + dayjs) set in `App.vue`

## Prettier
```bash
# Only config: semi: false
npx prettier --write .
```