# Frontend Project Instructions

## Project Overview

This repository is the Next.js frontend for Ossmmasoft. The application uses Next.js 13 with the Pages Router, React 18, TypeScript, Material UI/Materio, Redux Toolkit, Axios, React Query, React Hook Form, Yup, and Iconify icons.

The main source folder is `/Users/freveron/Developer/Projects/MM/NextOssmasoft/src`. The related backend vertical slice project is `/Users/freveron/Developer/Projects/MM/OssmmasoftVerticalSlice`.

Prefer the existing feature/module structure over introducing new app-wide abstractions. New business screens should follow the local module pattern already used under `src/rh`, `src/sis`, `src/presupuesto`, `src/adm`, and `src/Bm`.

## Routing And Pages

- This project uses `src/pages` with `useFileSystemPublicRoutes: false` in `next.config.js`.
- Page files under `src/pages/apps/...` should stay thin. They should usually render a `Grid container` and import the real feature view from the domain folder.
- Add navigation entries in `src/navigation/vertical/index.ts` when a new screen should appear in the sidebar.
- Match existing URL conventions such as `/apps/rh/...`, `/apps/sis/...`, `/apps/presupuesto/...`, and `/apps/Bm/...`.

## Feature Module Structure

For new or updated modules, follow the existing domain folder style:

- `interfaces/` for DTOs and response/request types when the module owns them.
- `services/` for Axios calls, endpoint constants, query keys, and response normalization.
- `views/` for list pages, dialogs, and composed screen-level components.
- `forms/` for create/update forms and local form helpers.
- `components/` for reusable module-specific UI pieces such as filters, tree views, or tables.

Use nearby modules as the source of truth for naming and file organization. For SIS role work, use `src/sis/usuarioRol` and `src/store/apps/oss-usuario-rol` as references. For RH document/persona work, use `src/rh/documentos`, `src/rh/persona`, and `src/store/apps/rh-documentos` as references.

## API Services

- Use the existing Axios clients from `src/MyApis`.
- Use `ossmmasofApiVertical` for endpoints served by the backend vertical slice API.
- Use `ossmmasofApi` for the existing .NET API where current modules already use it.
- Keep endpoint paths centralized in service constants such as `*_ENDPOINTS`.
- Keep React Query keys centralized in service constants such as `*_QUERY_KEY`.
- Normalize backend quirks in service functions, not inside UI components.
- For paginated backend responses, preserve the `ResultDto<T>` shape with `data`, `isValid`, `message`, `page`, `totalPage`, and `cantidadRegistros`.
- Throw from fetch functions when `response.data.isValid === false` so React Query can expose the error state.

## State Management

- Use Redux Toolkit slices under `src/store/apps/<module-name>/` for UI state such as selected row, dialog visibility, and CRUD operation mode.
- Register new slices in `src/store/index.ts`.
- Keep server data in React Query where the module already follows that pattern.
- Use `queryClient.invalidateQueries` after successful create/update/delete operations.
- Keep `serializableCheck: false` as configured unless there is a specific reason to revisit store setup.

## UI Components And Forms

- Build screens with Material UI components and the existing Materio layout conventions.
- Use `Card`, `Grid`, `Box`, `Typography`, `Dialog`, `DialogContent`, `DialogActions`, `IconButton`, `Tooltip`, and MUI form controls in the same style as nearby modules.
- Use `src/@core/components/icon` with Iconify icon names for icons.
- Use `DataGrid` for tabular management screens, with server pagination when the backend supports it.
- Use `Spinner` from `src/@core/components/spinner` for loading states where existing screens do.
- Use `react-hook-form` for forms and keep validation messages close to each field.
- Use `react-hot-toast` for success notifications and visible form helper text for backend errors.
- Keep dialogs controlled by the module Redux slice when following the CRUD dialog pattern.

## Types And Naming

- Keep TypeScript strictness in mind even though Next build currently ignores type errors.
- Prefer explicit DTO interfaces for API contracts.
- Match existing business terminology and Spanish labels.
- Keep C# backend field names mapped to frontend camelCase DTO fields when the backend serializer provides camelCase.
- Do not introduce broad shared generic types if a nearby module already defines a local `ResultDto<T>` or request/response interfaces.

## Backend Contract Coordination

- When changing frontend calls, check the backend feature contract or implementation in `/Users/freveron/Developer/Projects/MM/OssmmasoftVerticalSlice/Features`.
- Keep route casing aligned with the backend, including mixed conventions such as `GetAll`, `getById`, `create`, `update`, and `delete`.
- If the backend contract changes, update both the frontend DTO/service and the backend `ContratoFrontend*.md` when applicable.
- Oracle 10g compatibility is mandatory for backend-facing database work: every Oracle object identifier must be 30 characters or fewer. This includes tables, columns, sequences, indexes, constraints, stored procedures, functions, packages, triggers, and SQL artifacts referenced from frontend documentation or DTO planning.

## Verification

- For type-level checks, run `npx tsc --noEmit --pretty false` when feasible.
- For lint/format work, use the existing scripts in `package.json`.
- For UI changes, run the dev server with `npm run dev` when a visual check is needed.
- Do not depend on live backend availability for compile verification unless the user asks for end-to-end testing.

## Working Rules For Agents

- Read the closest existing module before adding a new feature.
- Keep edits scoped to the requested module and the required page/navigation/store wiring.
- Do not overwrite or revert unrelated user changes.
- Avoid touching template/demo areas under `src/pages/components`, `src/pages/ui`, and `src/@fake-db` unless the request is about those areas.
- Prefer ASCII in generated files unless Spanish user-facing labels or existing files require accents.
