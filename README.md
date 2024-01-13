# 🧭 ipf-compass

![Version of React.js](https://img.shields.io/github/package-json/dependency-version/nandenjin/ipf-compass/react?style=flat-square&logo=react)
![Version of Next.js](https://img.shields.io/github/package-json/dependency-version/nandenjin/ipf-compass/next?style=flat-square&logo=next.js)
![Build Status](https://img.shields.io/github/actions/workflow/status/nandenjin/ipf-compass/checks.yaml?style=flat-square&logo=github)
[![Code Climate maintainability](https://img.shields.io/codeclimate/maintainability/nandenjin/ipf-compass?style=flat-square&logo=codeclimate)](https://codeclimate.com/github/nandenjin/ipf-compass)

## Startup

- Follow [`data/README.md`](/data/README.md) and place data source files at `/data`
- `npm install`
- `npm run import` to import data sources to SQLite DB.
- `npm run dev` to run dev server.

## Args

- Envvars: The app reads them every time, on both local dev and container. `.env` is also available.
- Build args: For `--build-arg` of Docker.

> [!IMPORTANT]
> Once `npm run build` or `docker build`, build args are embedded in artifacts and no longer be able to modified with envvars.

| For envvar                           | For build arg          | description                                      | Example    |
| :----------------------------------- | :--------------------- | :----------------------------------------------- | ---------- |
| `AUTH_USER`                          | 🙅 N/A                 | Username for basic auth. Disable auth if not set | `user`     |
| `AUTH_PASSWORD`                      | 🙅 N/A                 | Password for basic auth. Disable auth if not set | `password` |
| (🗳️ Use local `/data/2023.csv`)      | `SRC_URL_EVENTS_2023`  | Download URL for `/data/2023.csv`                |            |
| (🗳️ Use local `/data/locations.csv`) | `SRC_URL_LOCATIONS`    | Download URL for `/data/locations.csv`           |            |
| (🗳️ Use local `/data/venues.csv`)    | `SRC_URL_VENUES`       | Download URL for `/data/venues.csv`              |            |
| `NEXT_PUBLIC_FIREBASE_API_KEY`       | `FIREBASE_API_KEY`     | API key from Firebase init object                |            |
| `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`   | `FIREBASE_AUTH_DOMAIN` | Auth domain from Firebase init object            |            |
| `NEXT_PUBLIC_FIREBASE_APP_ID`        | `FIREBASE_APP_ID`      | App ID from Firebase init object                 |            |
