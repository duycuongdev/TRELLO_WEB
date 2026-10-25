# Copilot Instructions for this repo

Purpose: make AI agents productive fast in this Vite + React + MUI Trello-like board app. Keep changes idiomatic to existing patterns below.

## Big picture
- Stack: Vite + React 18, Material UI 5 (Css Vars), Axios, @dnd-kit for drag/drop, Lodash, React-Toastify, material-ui-confirm.
- Entry: `src/main.jsx` mounts `<App/>` inside MUI `CssVarsProvider`, registers `ConfirmProvider` and `ToastContainer`.
- Routing: No router; `src/App.jsx` renders the Board page directly: `~/pages/Boards/_id`.
- State: Local React state. `redux/store.js` exists but unused (placeholder).
- Path alias: `~` -> `/src` (see `vite.config.js`). Always import via `~` from app code.

## Data model + DnD rules
- Board data shape (see API): `{ _id, columnOrderIds: string[], columns: [{ _id, cardOrderIds: string[], cards: [...] }] }`.
- Sorting utility: `mapOrder(array, orderArray, key)` in `src/utils/sorts.js` is used to order columns/cards by server-provided order arrays.
- Placeholder cards: empty columns must contain a synthetic card from `generatePlaceholderCard(column)` (see `src/utils/formatter.js`) to allow dropping. Never send placeholder cards to the backend.
- Drag/drop engine: `BoardContent.jsx` uses @dnd-kit with custom sensors in `src/customLibraries/DndKitSensors.js` and a custom collision strategy. Columns and cards are re-ordered optimistically; API calls happen in parent `pages/Boards/_id.jsx` via callbacks.

## API integration
- Base URL is computed in `src/utils/constants.js` from `process.env.BUILD_MODE` (enabled via `define` in `vite.config.js`).
  - dev: http://localhost:1900
  - production: https://trello-api-5hh5.onrender.com
- API layer lives in `src/apis/index.js` and returns `response.data` only. Endpoints used:
  - GET `/v1/boards/:id` – board details
  - PUT `/v1/boards/:id` – update `columnOrderIds` after column DnD
  - PUT `/v1/boards/supports/moving_card` – cross-column card move
  - POST `/v1/columns`, PUT `/v1/columns/:id`, DELETE `/v1/columns/:id`
  - POST `/v1/cards`
- Cross-column move protocol (see `pages/Boards/_id.jsx`): send `currentCardId`, `prevColumnId`, `prevCardOrderIds` (omit placeholder → send [] if first id includes `placeholder-card`), `nextColumnId`, `nextCardOrderIds`.

## UI + Theme conventions
- Theme is extended via `experimental_extendTheme` in `src/theme.js`. Custom sizes under `theme.trello`:
  - `appBarHeight`, `boardBarHeight`, `boardContentHeight`, `columnHeaderheight`, `columnFooterHeight`.
- Styling: use MUI components; buttons are non-uppercase, with custom border widths on hover. Input/typography sizes set globally.
- Lint rule forbids deep MUI imports: do not import like `@mui/*/*/*`. Use top-level packages.

## Component architecture
- Top-level page: `src/pages/Boards/_id.jsx`
  - Fetches a hard-coded board id, orders columns/cards, injects placeholder cards for empties, holds board state.
  - Exposes callbacks to children: `createNewColumn`, `createNewCard`, `moveColumns`, `moveCardInTheSameColumn`, `moveCardToDifferentColumn`, `deleteColumnDetails`.
  - Follows optimistic updates: update local state first, then call API (avoid full refetch).
- Board content tree: `BoardBar/Boardbar.jsx`, `BoardContent/BoardContent.jsx` → `ListColumns/Column/...` → `ListCards/Card/...`.
- DnD: in `BoardContent.jsx`
  - Same-column card moves: compute new order with `arrayMove`, update column, then `updateColumnDetailsAPI(columnId, { cardOrderIds })`.
  - Cross-column moves: recompute both columns, retarget `columnId` on the moved card, then call `moveCardToDifferentColumnAPI(...)`.

## Developer workflows
- Node >= 18. Preferred package manager: Yarn (repo has `yarn.lock`; README uses yarn).
- Scripts (see `package.json`):
  - `yarn dev` – starts Vite with `BUILD_MODE=dev` and `--host`.
  - `yarn build` – `BUILD_MODE=production` + `vite build --base=./`.
  - `yarn preview` – preview build.
  - `yarn lint` – ESLint on `src` with zero max warnings.
- Env access: use `process.env.X` (not `import.meta.env`) due to `define: { 'process.env': process.env }` in Vite config.

## Examples to follow
- Import with alias: `import App from '~/App.jsx'`
- Use API layer: `const board = await fetchBoardDetailsAPI(boardId)`; do ordering with `mapOrder` before rendering.
- Placeholder policy: when making a column empty during DnD, insert `generatePlaceholderCard(column)` and filter `FE_PlaceholderCard` out before sending to the API.

## When adding features
- New APIs → add to `src/apis/index.js`, return `response.data`, and call from page-level containers. Keep optimistic updates in the page; avoid introducing a new global state unless necessary.
- New components → place under `src/components` or page subfolders; use alias imports and MUI patterns already in use.
- DnD changes → update `BoardContent.jsx` and respect current collision strategy and custom sensors in `customLibraries/DndKitSensors.js`.
