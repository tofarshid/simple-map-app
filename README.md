# simple-map-app

Vue 3 app with a **Leaflet** map, **Vuex** state, and a small **Express + SQLite** API for saved map markers.

## Stack

| Layer | Tech |
| --- | --- |
| UI | Vue 3, TypeScript, Vite, Bootstrap 5 |
| Map | Leaflet |
| State | Vuex 4 |
| API | Express 5, `sqlite3`, CORS |
| Quality | ESLint, Oxlint, Prettier (`semi: true`), Vitest + Vue Test Utils |

## Features

- Click the map to add a marker; the server **reverse-geocodes** coordinates (Nominatim) and stores **id, lat, long, address**.
- Marker list in the sidebar; click an item to fly the map to that marker.
- Default map center is configured in `src/constants/map.ts` (Parramatta area).

## Scripts

| Command | What it does |
| --- | --- |
| `npm install` | Install dependencies |
| `npm run dev` | Runs **Vite** (client) and **API** together via `npm-run-all` |
| `npm run dev:client` | Frontend only — [http://localhost:5173](http://localhost:5173) (or next free port) |
| `npm run dev:server` | API only — [http://localhost:3001](http://localhost:3001) |
| `npm run server` | Start API once (no watch) |
| `npm run build` | `vue-tsc` + production Vite build |
| `npm run preview` | Preview the production build |
| `npm run type-check` | Type-check only |
| `npm run test` | Vitest (watch mode) |
| `npm run test:run` | Vitest single run (CI-friendly) |
| `npm run lint` | Oxlint + ESLint |
| `npm run format` | Prettier on `src/` |

## API

Base URL in development: same origin as Vite, with `/api` **proxied** to the server (`vite.config.ts` → `http://localhost:3001`).

| Method | Path | Description |
| --- | --- | --- |
| `GET` | `/api/health` | Health check |
| `GET` | `/api/markers` | List markers (newest first) |
| `POST` | `/api/markers` | Body: `{ "lat": number, "long": number }` — saves row and returns `{ id, lat, long, address }` |

Optional: set `VITE_API_BASE_URL` if the client should call a different API origin (server still enables CORS).

## Database

- File: `data/app.db` (created on first run).
- Table name in SQLite: **`locations`** (columns: `id`, `lat`, `long`, `address`).
- The REST resource is named **markers**; only the DB table keeps the older name.

## Project layout (high level)

```
src/
  components/     App shell, MapCard, MarkerList; `__tests__/` for Vitest
  constants/      Map defaults (lat/lng/zoom)
  store/          Vuex store (markers, API actions)
  styles/         Scoped CSS pulled into components
server/
  index.ts        Express app + routes
  db.ts           SQLite access
```

## TypeScript + Vuex

`tsconfig.app.json` maps the `vuex` module to `node_modules/vuex/types/index.d.ts` because Vuex’s package `exports` omit `types`. See [vuejs/vuex issues](https://github.com/vuejs/vuex/issues).

## IDE

[VS Code](https://code.visualstudio.com/) + [Vue (Official)](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (disable Vetur if present).

## Vite config

See [Vite configuration reference](https://vite.dev/config/).
