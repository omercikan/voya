<p align="center">
  <img width="170" alt="yaltes_logo" src="https://github.com/user-attachments/assets/c00f397e-d54b-424c-9935-1846062d898e" />
</p>

<h1 align="center">Yaltes Vehicle Appointment System</h1>

<p align="center">
  <img src="https://img.shields.io/badge/Java-26-ED8B00?style=for-the-badge&logo=openjdk&logoColor=white" alt="Java 26"/>
  <img src="https://img.shields.io/badge/Spring%20Boot-4.1.0-6DB33F?style=for-the-badge&logo=springboot&logoColor=white" alt="Spring Boot 4.1.0"/>
  <img src="https://img.shields.io/badge/Maven-Build-C71A36?style=for-the-badge&logo=apachemaven&logoColor=white" alt="Maven"/>
  <img src="https://img.shields.io/badge/Spring%20Cloud%20Gateway-MVC-6DB33F?style=for-the-badge&logo=spring&logoColor=white" alt="Spring Cloud Gateway"/>
  <img src="https://img.shields.io/badge/Next.js-16-000000?style=for-the-badge&logo=nextdotjs&logoColor=white" alt="Next.js 16"/>
  <img src="https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React 19"/>
  <img src="https://img.shields.io/badge/PostgreSQL-16-4169E1?style=for-the-badge&logo=postgresql&logoColor=white" alt="PostgreSQL 16"/>
  <img src="https://img.shields.io/badge/Docker-Compose-2496ED?style=for-the-badge&logo=docker&logoColor=white" alt="Docker Compose"/>
  <img src="https://img.shields.io/badge/License-Proprietary-lightgrey?style=for-the-badge" alt="License"/>
</p>

A microservices-based system for managing vehicle records and service appointments, built with Spring Boot on the backend and Next.js on the frontend. The system is organized as independently deployable services, each owning its own database, and is exposed to clients through a single API gateway that also owns authentication.

## Table of Contents

- [Overview](#overview)
- [Architecture](#architecture)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Services](#services)
  - [API Gateway](#api-gateway)
  - [Identity Service](#identity-service)
  - [Vehicle Service](#vehicle-service)
  - [Appointment Service](#appointment-service)
  - [Frontend (Web)](#frontend-web)
- [Authentication & Authorization](#authentication--authorization)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Running in Development Mode](#running-in-development-mode)
  - [Running in Production Mode](#running-in-production-mode)
  - [Running a Single Service Locally](#running-a-single-service-locally)
  - [Running the Frontend Locally](#running-the-frontend-locally)
- [Environment Variables](#environment-variables)
- [Production Deployment](#production-deployment)
- [API Reference](#api-reference)
  - [Identity Service](#identity-service-1)
  - [Vehicle Service](#vehicle-service-1)
  - [Appointment Service](#appointment-service-1)
- [Roadmap](#roadmap)
- [Contributing](#contributing)
- [Contributors](#contributors)
- [License](#license)

## Overview

This repository hosts both the backend infrastructure and the web client for a vehicle service appointment platform. Each business capability is isolated into its own Spring Boot microservice with a dedicated PostgreSQL database, following a database-per-service pattern. All external traffic passes through an API Gateway, which is also responsible for validating sessions and forwarding identity information (user id, role) to downstream services via headers.

**Core capabilities:**

- User identity management, authentication (JWT via HTTP-only cookie), and role-based access control (`ADMIN` / `EMPLOYEE`)
- Vehicle registration, availability status, and mileage/location tracking
- Service appointment scheduling, conflict detection, availability lookup, and status workflow (pending → confirmed/cancelled/completed)
- A Next.js dashboard for admins and employees to manage vehicles, employees, and appointments

## Architecture

```
                                   ┌───────────────────┐
                                   │   Frontend (Web)  │
                                   │  Next.js, port    │
                                   │      3000         │
                                   └─────────┬─────────┘
                                             │  HTTP (cookies)
                                   ┌─────────▼───────────┐
                                   │     API Gateway     │
                                   │ (gateway/api-       │
                                   │   gateway) — 8080   │
                                   │  JWT validation +   │
                                   │  header injection   │
                                   └──────────┬──────────┘
                                              │
        ┌───────────────────────────┬────────┴─────────────────────────┐
        │                           │                                  │
┌───────▼──────────┐      ┌─────────▼───────┐                ┌─────────▼───────────┐
│ Identity Service │      │ Vehicle Service │                │ Appointment Service │
│   (port 8083)    │      │   (port 8081)   │◄───────────────┤    (port 8082)      │
└───────┬──────────┘◄─────┴────────┬────────┘  HTTP clients  └────────┬────────────┘
        │           HTTP clients   │        (vehicle/customer lookup) │
┌───────▼────────┐        ┌────────▼────────┐                ┌────────▼─────────┐
│  identity-db   │        │   vehicle-db    │                │  appointment-db  │
│  (PostgreSQL)  │        │  (PostgreSQL)   │                │  (PostgreSQL)    │
└────────────────┘        └─────────────────┘                └──────────────────┘
```

Each backend service is fully independent: its own codebase, its own database, its own container, and its own lifecycle. Services do not share a database schema. The Appointment Service calls the Identity Service and Vehicle Service over HTTP to enrich appointment data with customer and vehicle details, and the API Gateway is the only component that talks directly to the outside world.

## Tech Stack

| Layer | Technology |
|---|---|
| Backend Language | Java 26 |
| Backend Framework | Spring Boot 4.1.0 |
| Gateway | Spring Cloud Gateway (MVC / WebMVC flavor) |
| Persistence | Spring Data JPA / Hibernate |
| Database | PostgreSQL 16 |
| Security | Spring Security, JWT (`jjwt`), BCrypt, `@PreAuthorize` |
| Backend Build Tool | Maven (with Maven Wrapper) |
| Frontend Framework | Next.js 16 (App Router), React 19 |
| Frontend Language | TypeScript |
| Frontend State/Data | Redux Toolkit + RTK Query |
| Frontend UI | Tailwind CSS 4, MUI (date pickers), react-hook-form, zod, react-hot-toast |
| Containerization | Docker, Docker Compose |
| Boilerplate Reduction | Lombok |

## Project Structure

```
yaltes-vehicle-appointment/
├── docker-compose.yml              # Production-like orchestration (builds service images)
├── docker-compose.dev.yml          # Development orchestration (hot-reload via Maven)
├── docs/                           # Project documentation
├── frontend/
│   └── web/                        # Next.js dashboard (admin & employee views)
├── gateway/
│   └── api-gateway/                # API Gateway — routing, CORS, JWT validation
└── services/
    ├── identity-service/           # User management, auth, JWT issuance
    ├── vehicle-service/            # Vehicle CRUD, availability, mileage/location
    └── appointment-service/        # Appointment scheduling, availability, status workflow
```

## Services

### API Gateway

**Package:** `com.yaltes.api_gateway`
**Default port:** `8080`

The single entry point for all client traffic. Built on Spring Cloud Gateway's WebMVC (functional routing) flavor.

**Responsibilities:**

- Routes `/api/auth/**` to the Identity Service (login is public; logout requires a valid session)
- Routes `/api/users/**` to the Identity Service
- Routes `/api/vehicles/**` to the Vehicle Service
- Routes `/appointments/**` to the Appointment Service
- Validates the JWT stored in the `access_token` HTTP-only cookie on every protected route
- On success, injects `X-User-Id` and `X-User-Role` headers into the forwarded request so downstream services never need to parse the token themselves
- Returns `401` with a Turkish-language error message on missing, expired, or invalid tokens
- Applies CORS rules restricted to a single configured client origin, with credentials allowed

### Identity Service

Manages user accounts, roles, credentials, and authentication.

**Package:** `com.yaltes.identity_service`
**Default port:** `8080` (mapped to host port `8083`)

**Implemented layers:**

| Layer | Responsibility |
|---|---|
| `controller` | `UserController` (CRUD + self/lookup), `AuthController` (login/logout) |
| `service` | `UserService`, `AuthService`, `JwtService` |
| `repository` | Spring Data JPA repository for `User` |
| `mapper` | Converts between entities and DTOs |
| `entity` | `User` JPA entity |
| `enums` | `Role` (`ADMIN`, `EMPLOYEE`), `Status` (`ACTIVE`, `INACTIVE`) |
| `dto` | `CreateUserRequest`, `UpdateUserRequest`, `UpdateStatusRequest`, `LoginUserRequest`, `UserResponse`, `ApiResponse` |
| `exception` | `EmailAlreadyExistsException`, `UserNotFoundException`, `UnauthorizedUserException`, `GlobalExceptionHandler` |
| `config` | `PasswordConfig` (BCrypt), `WebSecurityConfig` |

**Key design decisions:**

- All API responses follow a consistent `ApiResponse<T>` envelope (`success`, `data`, `message`), with `null` fields omitted from the JSON output.
- Passwords are hashed with BCrypt before persistence; plain-text passwords are never stored.
- Login issues a JWT (via `jjwt`) embedding `userId` and `role`, returned as an HTTP-only, `Strict` same-site cookie (`access_token`) rather than in the response body.
- Every request routed through the gateway arrives with `X-User-Id` / `X-User-Role` headers already populated, which `UserController` uses to authorize update/delete/status/list operations against the caller's role.
- Duplicate email registration is rejected with an `EmailAlreadyExistsException`, mapped to `409 Conflict`.
- Validation errors and unexpected exceptions are centrally handled via `@RestControllerAdvice`, so no endpoint needs its own try/catch block.
- `POST /api/users` is publicly accessible (used for onboarding); every other endpoint expects the gateway-injected identity headers.

### Vehicle Service

Manages the fleet: registration, availability status, and odometer/location updates.

**Package:** `com.yaltes.vehicle_service`
**Default port:** `8080` (mapped to host port `8081`)

**Implemented layers:**

| Layer | Responsibility |
|---|---|
| `controller` | `VehicleController` — full CRUD plus status and km/location patches |
| `service` | `VehicleService` |
| `component` | `VehicleMapper`, `VehicleValidator` |
| `repository` | Spring Data JPA repository for `Vehicle` |
| `entity` | `Vehicle` JPA entity |
| `enums` | `AvailabilityStatus` (`AVAILABLE`, `OUT_OF_SERVICE`) |
| `dto` | `VehicleRequest`, `VehicleResponse` |
| `exception` | `ResourceNotFoundException`, `RoleException`, `ValidationException`, `GlobalExceptionHandler`, `ErrorResponse` |
| `security` | `HeaderAuthenticationFilter` (reads `X-User-Role` forwarded by the gateway) |
| `config` | `SecurityConfig` |

**Key design decisions:**

- Vehicles are uniquely identified by license plate.
- Create, update, status change, and delete are restricted to `ADMIN` via method-level `@PreAuthorize("hasAuthority('ADMIN')")`, backed by a custom `HeaderAuthenticationFilter` that authenticates the request based on the `X-User-Role` header set by the gateway (no local password/session handling in this service).
- Reads (`GET /api/vehicles`, `GET /api/vehicles/{id}`) and the km/location patch are open to any authenticated caller.

### Appointment Service

Manages scheduling: creating appointments, checking availability, and moving appointments through their status lifecycle.

**Package:** `com.yaltes.appointment_service`
**Default port:** `8080` (mapped to host port `8082`)

**Implemented layers:**

| Layer | Responsibility |
|---|---|
| `controller` | `AppointmentController` — create, list, per-vehicle busy dates, availability, status update, delete |
| `service` | `AvailabilityService` — computes free/busy days and hour slots |
| `client` | `VehicleClient`, `CustomerClient` — HTTP clients calling the Vehicle and Identity services |
| `repository` | `AppointmentRepository` (custom overlap/status/customer queries) |
| `entity` | `Appointment`, `AppointmentStatus` (`PENDING`, `CONFIRMED`, `CANCELLED`, `COMPLETED`) |
| `dto` | `ApiResponse`, `AppointmentResponse`, `AvailabilityResponse`, `DateRange`, `DayAvailability`, `HourSlot`, `Customer`, `Vehicle` |
| `exception` | `GlobalExceptionHandler` |

**Key design decisions:**

- Appointment IDs are UUIDs, generated at persistence time.
- On creation, the service checks for real date/time overlap against existing appointments for the same vehicle and rejects conflicting requests with `409 Conflict`.
- Appointment responses are enriched on the fly: `VehicleClient` and `CustomerClient` fetch vehicle and customer details from the Vehicle and Identity services so the frontend never needs to join data itself.
- `GET /appointments/availability` and `GET /appointments/busy-vehicles` support the booking UI by returning day- and hour-level availability for a given date range.
- Cancelling an appointment (`status=CANCELLED`) accepts an optional `rejectNote` explaining the reason.

### Frontend (Web)

**Location:** `frontend/web`
**Framework:** Next.js 16 (App Router) + React 19, TypeScript, Tailwind CSS 4

A role-aware dashboard consumed by admins and employees.

**Structure highlights:**

- `app/(auth)/login` — public login page
- `app/(dashboard)/dashboard`, `/vehicles`, `/appointments`, `/appointments/new`, `/employees`, `/profile` — protected routes gated by a Next.js middleware-style `proxy.ts` that redirects unauthenticated users to `/login` based on the presence of the `access_token` cookie
- `components/auth` — `LoginForm`, `LogoutButton`, `RoleGuard`, `AuthPanel`, `AuthLayout`
- `components/dashboard/admin` — `AdminDashboard`, appointment table for admins
- `components/dashboard/employee` — `EmployeeDashboard` and a multi-step appointment booking flow (`AppointmentStep`, `AppointmentSelectDate`, `AppointmentSelectTime`, `AppoinmentVehicles`, `AppoinmentSummary`, `AppoinmentDetails`, `AppointmentActions`)
- `components/dashboard/modal` — `AddEmployee`, `AddVehicle`, `CancelAppointment`, `AppointmentsModalManagement`
- `components/dashboard/sidebar` — role-filtered navigation (`Links`, `Sidebar`)
- `components/ui` — shared primitives: `CustomButton`, `CustomInput`, `CustomSelect`, `Table`, `EmptyState`, `DateProvider`
- `store/` — Redux Toolkit store with RTK Query API slices (`authApi`, `userApi`, `vehicleApi`, `appointmentApi`) built on a shared `baseApi` (`credentials: "include"` so the `access_token` cookie is always sent)
- `hooks/useAuth` — wraps `userApi`'s "me" query to expose the current user and auth state app-wide
- `types/` — shared TypeScript types mirroring the backend DTOs (`user`, `vehicle`, `appointment`, `auth`)

The frontend never talks to individual services directly — every request goes through the API Gateway at `NEXT_PUBLIC_API_URL`, and the browser's `access_token` cookie is what authenticates each call.

## Authentication & Authorization

1. The client calls `POST /api/auth/login` on the gateway (routed straight to the Identity Service).
2. On success, the Identity Service returns a JWT in an HTTP-only, `Secure`, `SameSite=Strict` cookie named `access_token`. The token embeds `userId` and `role` and expires after `jwt.expiration` milliseconds (30 minutes by default).
3. For every subsequent request to a protected route, the gateway's `JwtAuthenticationFilter` reads the cookie, validates the token, and — if valid — forwards the request downstream with `X-User-Id` and `X-User-Role` headers set. Missing/expired/invalid tokens short-circuit with `401` and a Turkish error message.
4. Downstream services trust these headers as-is (they're never exposed to the internet directly): the Identity Service uses them for authorization checks in `UserController`, and the Vehicle Service authenticates them through a lightweight `HeaderAuthenticationFilter` feeding Spring Security's `@PreAuthorize`.
5. Two roles exist: `ADMIN` (full management access — vehicles, employees, appointment approval) and `EMPLOYEE` (booking and viewing their own appointments).
6. `POST /api/auth/logout` clears the cookie; there is no server-side token blacklist — the session simply expires or the cookie is removed.

## Getting Started

### Prerequisites

- [Docker](https://www.docker.com/) and Docker Compose
- Java 26 JDK (only required for running a service outside Docker)
- Maven (optional — each backend service includes the Maven Wrapper, `mvnw`)
- Node.js 20+ and npm (only required for running the frontend outside Docker)

### Running in Development Mode

Development mode runs each backend service inside a Maven container with the source code mounted as a volume, so changes are picked up automatically without rebuilding the image.

```bash
docker compose -f docker-compose.dev.yml up
```

This starts:

- `vehicle-db`, `appointment-db`, `identity-db` — PostgreSQL 16 instances
- `identity-service`, `vehicle-service`, `appointment-service` — running via `mvn spring-boot:run`
- `api-gateway` — running via `mvn spring-boot:run`, depending on `identity-service`

> The frontend is not part of `docker-compose.dev.yml` yet; run it separately as described in [Running the Frontend Locally](#running-the-frontend-locally).

To stop and remove the containers:

```bash
docker compose -f docker-compose.dev.yml down
```

To reset all data (drops volumes as well):

```bash
docker compose -f docker-compose.dev.yml down -v
```

### Running in Production Mode

Production mode builds a standalone image for each backend service using its multi-stage `Dockerfile` (Maven build stage → lightweight JRE runtime stage). Note that `docker-compose.yml` currently orchestrates the three domain services and their databases; the API Gateway is not yet included and should be run separately (see [Running a Single Service Locally](#running-a-single-service-locally)) until it's added to this file.

```bash
docker compose up --build
```

### Running a Single Service Locally

Each backend service can also be run independently without Docker, provided a matching PostgreSQL instance is available (see [Environment Variables](#environment-variables)):

```bash
cd services/identity-service
./mvnw spring-boot:run
```

The same applies to `gateway/api-gateway`, `services/vehicle-service`, and `services/appointment-service`.

### Running the Frontend Locally

```bash
cd frontend/web
npm install
npm run dev
```

The app runs on `http://localhost:3000` by default and expects `NEXT_PUBLIC_API_URL` to point at the API Gateway (see [Environment Variables](#environment-variables)).

### Service Ports

| Service | Container Port | Host Port |
|---|---|---|
| api-gateway | 8080 | 8080 |
| vehicle-service | 8080 | 8081 |
| appointment-service | 8080 | 8082 |
| identity-service | 8080 | 8083 |
| frontend (web) | 3000 | 3000 |
| vehicle-db | 5432 | 5433 |
| appointment-db | 5432 | 5434 |
| identity-db | 5432 | 5435 |

## Environment Variables

### Backend services

Each service reads its database configuration from environment variables, falling back to local defaults when unset (see each service's `application.properties`).

| Variable | Description | Default (identity-service example) |
|---|---|---|
| `DB_URL` | JDBC connection URL | `jdbc:postgresql://localhost:5435/identity_db` |
| `DB_USERNAME` | Database username | `postgres` |
| `DB_PASSWORD` | Database password | `postgres` |
| `JWT_SECRET` | Shared secret used to sign/verify JWTs (Identity Service and API Gateway) | *(required, no default)* |

### Identity Service (auth cookie)

| Variable | Description | Default |
|---|---|---|
| `COOKIE_SECURE` | Whether the `access_token` cookie is issued with the `Secure` flag (requires HTTPS to be stored by the browser) | `true` |

> `COOKIE_SECURE=false` exists only to allow login testing over plain HTTP (e.g. from another device on a LAN, using an IP address instead of a domain). See [Production Deployment](#production-deployment) — this must be `true` (or simply unset) whenever the app is reachable over HTTPS.

### API Gateway

| Variable | Description |
|---|---|
| `JWT_SECRET` | Must match the Identity Service's signing secret |
| `IDENTITY_URL` | Base URL of the Identity Service |
| `VEHICLE_URL` | Base URL of the Vehicle Service |
| `APPOINTMENT_URL` | Base URL of the Appointment Service |
| `CLIENT_URL` | Allowed CORS origin for the frontend |

### Appointment Service (inter-service calls)

| Variable | Description |
|---|---|
| `VEHICLE_URL` | Base URL used by `VehicleClient` to fetch vehicle details |
| `IDENTITY_URL` | Base URL used by `CustomerClient` to fetch customer details |

### Frontend

| Variable | Description |
|---|---|
| `NEXT_PUBLIC_API_URL` | Base URL of the API Gateway that the browser calls |

> Defaults are intended for local development only. Override all secrets and URLs with secure values in any shared or production environment.

## Production Deployment

The `.env` values and frontend settings used for local development or same-LAN testing (e.g. testing from a second device over `http://192.168.x.x`) are **not safe or correct for a real deployment**. Before shipping this project to a staging or production environment, go through the checklist below.

### 1. `.env` — update every value that pointed at a LAN IP or used relaxed security

```dotenv
# Example LAN/dev .env — do NOT use these values in production
JWT_SECRET=5CFvJsQDP7fq470nLEXbE0TfXt2E7gO6+5Gm58BIaCQ=
IDENTITY_URL=http://identity-service:8080
VEHICLE_URL=http://vehicle-service:8080
APPOINTMENT_URL=http://appointment-service:8080
CLIENT_URL=http://192.168.1.100:3000
COOKIE_SECURE=false
```

| Variable | What to change for production |
|---|---|
| `JWT_SECRET` | Generate a **new**, unique, high-entropy secret for the production environment (e.g. `openssl rand -base64 32`). Never reuse a secret that was ever used in a dev/LAN `.env` or committed to version control. Store it in your platform's secret manager (not a plain `.env` file on disk). |
| `IDENTITY_URL` / `VEHICLE_URL` / `APPOINTMENT_URL` | These stay as internal Docker service names (e.g. `http://identity-service:8080`) as long as all backend services run on the same Docker network — no change needed unless services are deployed on separate hosts/clusters, in which case use their internal DNS names or private network addresses. |
| `CLIENT_URL` | Must be the **real public HTTPS origin** of the deployed frontend, e.g. `https://app.yourdomain.com` — not an IP address and not `http://`. If the frontend is reachable at more than one origin (e.g. `https://app.yourdomain.com` and `https://www.yourdomain.com`), see the CORS note below, since the current `CorsConfig` only accepts a single origin string. |
| `COOKIE_SECURE` | Set to `true`, or remove it entirely (the Identity Service already defaults to `true` when unset). This flag exists only to disable the `Secure` cookie attribute for HTTP-based LAN testing; leaving it `false` in production means the session cookie could be sent over an unencrypted connection. |

### 2. `frontend/web/next.config.ts` — `allowedDevOrigins`

```typescript
const nextConfig: NextConfig = {
  allowedDevOrigins: ["192.168.1.100"],
};
```

`allowedDevOrigins` is a **development-only** safety setting used exclusively by `next dev` to allow a specific LAN IP to load the dev server's hot-reload/HMR assets. It has no effect on `next build` / `next start` or on a production deployment, so it is safe to leave in the repo — but it should be removed or updated once the LAN IP it references is no longer relevant, so the config doesn't silently reference stale internal addresses:

```typescript
const nextConfig: NextConfig = {
  /* config options here */
};
```

### 3. Rebuild the frontend with the production API URL

`NEXT_PUBLIC_*` environment variables are baked into the JavaScript bundle **at build time**, not read at runtime. Set the real gateway URL before building:

```dotenv
# frontend/web/.env.production
NEXT_PUBLIC_API_URL=https://api.yourdomain.com
```

```bash
cd frontend/web
npm run build
npm run start
```

Simply changing the `.env` file without rebuilding (`npm run build`) will have no effect — the previous URL stays compiled into the existing `.next` output.

### 4. Serve everything over HTTPS

Because `COOKIE_SECURE=true` and the cookie is issued with `SameSite=Strict`, the browser will only store and send the `access_token` cookie when both the frontend and the API Gateway are served over **HTTPS on real domains** (not bare IP addresses). In practice this means putting a reverse proxy or load balancer (e.g. Nginx, Caddy, Traefik, or a cloud load balancer) in front of the frontend and the API Gateway to terminate TLS, using certificates from a CA such as Let's Encrypt.

### 5. Add the API Gateway and its secrets to `docker-compose.yml`

The current `docker-compose.yml` only orchestrates the three domain services and their databases (see the [Roadmap](#roadmap)) — it does not yet start `api-gateway`, and none of the domain services receive `JWT_SECRET`, `CLIENT_URL`, or `COOKIE_SECURE`. Before deploying with `docker compose up --build`, add an `api-gateway` service (mirroring the one in `docker-compose.dev.yml`, minus the Maven hot-reload setup) and wire the required environment variables into it and into `identity-service`, sourced from your production `.env` or secret manager — not hardcoded in the compose file.

### 6. Harden the database credentials

Both compose files currently ship with `POSTGRES_USER=postgres` / `POSTGRES_PASSWORD=postgres` for every database. Replace these with strong, unique credentials per database before going live, and avoid exposing the database ports (`5433`–`5435`) publicly — they should only be reachable from within the Docker network.

### 7. Double-check CORS for multiple frontend origins

`CorsConfig` in the API Gateway currently accepts a single value for `allowedOrigins`. If production traffic can arrive from more than one origin (e.g. an apex domain and a `www` subdomain, or a staging environment sharing the same gateway), update `CorsConfig` to accept a comma-separated list from `CLIENT_URL` and split it into multiple allowed origins, rather than adding a second environment variable per origin.

## API Reference

All endpoints below are reached through the API Gateway; paths shown are relative to the gateway's base URL.

### Identity Service

#### `POST /api/auth/login`

Authenticates a user and sets the `access_token` cookie.

**Request body:**

```json
{
  "email": "jane.doe@example.com",
  "password": "securePassword123"
}
```

**Success response — `200 OK`** (with `Set-Cookie: access_token=...`):

```json
{ "success": true }
```

#### `POST /api/auth/logout`

Clears the `access_token` cookie. Requires an authenticated session.

#### `POST /api/users`

Creates a new user account. Public.

**Request body:**

```json
{
  "fullName": "Jane Doe",
  "email": "jane.doe@example.com",
  "password": "securePassword123",
  "phoneNumber": "+90 555 000 00 00",
  "role": "EMPLOYEE",
  "department": "Service Center"
}
```

**Success response — `201 Created`:**

```json
{
  "success": true,
  "data": {
    "id": 1,
    "fullName": "Jane Doe",
    "email": "jane.doe@example.com",
    "phoneNumber": "+90 555 000 00 00",
    "role": "EMPLOYEE",
    "department": "Service Center"
  }
}
```

**Error response — `409 Conflict` (duplicate email):**

```json
{ "success": false, "message": "Email adresi zaten var" }
```

**Error response — `400 Bad Request` (validation failure):**

```json
{ "success": false, "message": "email: must not be blank, password: must not be blank" }
```

#### Other Identity Service endpoints

| Method | Path | Description |
|---|---|---|
| `GET` | `/api/users/me` | Returns the currently authenticated user (via `X-User-Id`) |
| `GET` | `/api/users/{id}` | Returns a user by id |
| `GET` | `/api/users` | Lists users (caller role required) |
| `PATCH` | `/api/users/{id}` | Updates a user's profile fields |
| `PATCH` | `/api/users/{id}/status` | Activates/deactivates a user |
| `DELETE` | `/api/users/{id}` | Deletes a user |

### Vehicle Service
 
| Method | Path | Access | Description |
|---|---|---|---|
| `POST` | `/api/vehicles` | `ADMIN` | Creates a vehicle |
| `GET` | `/api/vehicles` | Any authenticated caller | Lists all vehicles |
| `GET` | `/api/vehicles/{id}` | Any authenticated caller | Fetches a vehicle by id |
| `PATCH` | `/api/vehicles/{id}` | `ADMIN` | Updates vehicle fields |
| `PATCH` | `/api/vehicles/{id}/status` | `ADMIN` | Updates availability status (`AVAILABLE` / `OUT_OF_SERVICE`) |
| `PATCH` | `/api/vehicles/{id}/km-location` | Any authenticated caller | Updates mileage and/or location |
| `DELETE` | `/api/vehicles/{id}` | `ADMIN` | Deletes a vehicle |
 
#### `POST /api/vehicles`
 
Creates a new vehicle. Requires `ADMIN`. The plate must be unique; requests are normalized and validated before persistence (see [Key design decisions](#vehicle-service) above).
 
**Request body:**
 
```json
{
  "plate": "34ABC123",
  "brand": "Toyota",
  "model": "Corolla",
  "year": 2022,
  "gear": "Automatic",
  "km": 15000,
  "fuel": "Gasoline",
  "location": "Istanbul"
}
```
 
**Success response — `201 Created`:**
 
```json
{
  "id": 1,
  "plate": "34ABC123",
  "brand": "Toyota",
  "model": "Corolla",
  "year": 2022,
  "gear": "Automatic",
  "km": 15000,
  "fuel": "Gasoline",
  "location": "Istanbul",
  "status": "AVAILABLE"
}
```
 
**Error response — `400 Bad Request`** (duplicate plate, invalid format, or any other validation failure — all failures for a single request are collected and returned together):
 
```json
{
  "timestamp": "2026-08-19T09:00:00",
  "status": 400,
  "error": "Bad Request",
  "messages": [
    "Bu plaka zaten kayıtlı: 34ABC123",
    "Plaka formatı geçersiz: 41444222",
    "Kilometre 0'dan küçük olamaz: -50",
    "Geçersiz araç yılı: 1800"
  ],
  "success": false
}
```
 
> The four messages above illustrate the different validation failures this endpoint can return — a single request typically triggers one or a related few of them (e.g. an invalid plate together with an invalid year), not all four at once.
 
**Error response — `401 Unauthorized`** (caller is not `ADMIN`):
 
```json
{
  "timestamp": "2026-08-19T09:00:00",
  "status": 401,
  "error": "Unauthorized",
  "message": "Geçersiz rol.",
  "success": false
}
```
 
#### `GET /api/vehicles`
 
Lists all vehicles. Open to any authenticated caller.
 
**Success response — `200 OK`:**
 
```json
[
  {
    "id": 1,
    "plate": "34ABC123",
    "brand": "Toyota",
    "model": "Corolla",
    "year": 2022,
    "gear": "Automatic",
    "km": 15000,
    "fuel": "Gasoline",
    "location": "Istanbul",
    "status": "AVAILABLE"
  },
  {
    "id": 2,
    "plate": "06XYZ789",
    "brand": "Renault",
    "model": "Clio",
    "year": 2019,
    "gear": "Manual",
    "km": 62000,
    "fuel": "Diesel",
    "location": "Ankara",
    "status": "OUT_OF_SERVICE"
  }
]
```
 
#### `GET /api/vehicles/{id}`
 
Fetches a single vehicle by id. Open to any authenticated caller.
 
**Success response — `200 OK`:** same shape as a single item above.
 
**Error response — `404 Not Found`:**
 
```json
{
  "timestamp": "2026-08-19T09:00:00",
  "status": 404,
  "error": "Not Found",
  "message": "Vehicle not found with id: 99",
  "success": false
}
```
 
#### `PATCH /api/vehicles/{id}`
 
Updates one or more vehicle fields. Requires `ADMIN`. Only the fields present in the body are changed; omitted fields keep their existing value. Mileage can only be increased or left unchanged — a lower `km` than the vehicle's current value is rejected.
 
**Request body (partial):**
 
```json
{
  "brand": "Honda",
  "km": 20000
}
```
 
**Success response — `200 OK`:** the full, updated `VehicleResponse` (same shape as above).
 
**Error response — `400 Bad Request`** (plate already taken by another vehicle):
 
```json
{
  "timestamp": "2026-08-19T09:00:00",
  "status": 400,
  "error": "Bad Request",
  "messages": [
    "Bu plaka başka bir araca kayıtlı!"
  ],
  "success": false
}
```
 
#### `PATCH /api/vehicles/{id}/status`
 
Updates only the availability status. Requires `ADMIN`. `status` is passed as a query parameter, not a body.
 
**Request:**
 
```
PATCH /api/vehicles/5/status?status=OUT_OF_SERVICE
```
 
**Success response — `200 OK`:** the full, updated `VehicleResponse` with the new `status`.
 
#### `PATCH /api/vehicles/{id}/km-location`
 
Updates only mileage and/or location. Open to any authenticated caller (not just `ADMIN`) — this is the endpoint an `EMPLOYEE` uses after completing a job. Mileage can only be increased or left unchanged — a lower `km` than the vehicle's current value is rejected.
 
**Request body:**
 
```json
{
  "km": 45500,
  "location": "Ankara"
}
```
 
**Success response — `200 OK`:** the full, updated `VehicleResponse`.
 
**Error response — `400 Bad Request`** (mileage decrease attempted):
 
```json
{
  "timestamp": "2026-08-19T09:00:00",
  "status": 400,
  "error": "Bad Request",
  "messages": [
    "Kilometre azaltılamaz. Mevcut: 20000, gönderilen: 15000"
  ],
  "success": false
}
```
 
**Error response — `404 Not Found`** if the vehicle doesn't exist.
 
#### `DELETE /api/vehicles/{id}`
 
Deletes a vehicle. Requires `ADMIN`.
 
**Success response:** `204 No Content`
 
**Error response — `404 Not Found`** if the vehicle doesn't exist (same shape as the `GET` 404 above).

### Appointment Service

| Method | Path | Description |
|---|---|---|
| `POST` | `/appointments` | Creates an appointment; rejects with `409 Conflict` on a real date/time overlap for the same vehicle |
| `GET` | `/appointments` | Lists all appointments, optionally filtered by `status` |
| `GET` | `/appointments/{id}` | Fetches a single appointment, enriched with vehicle and customer data |
| `GET` | `/appointments/me` | Lists the caller's own appointments (via `X-User-Id`) |
| `GET` | `/appointments/vehicle/{vehicleId}/busy` | Lists non-cancelled appointments for a vehicle |
| `GET` | `/appointments/busy-vehicles` | Lists vehicles busy for a given date/hour range |
| `GET` | `/appointments/availability` | Returns day/hour availability for a date range |
| `PATCH` | `/appointments/{id}` | Updates status (`PENDING`, `CONFIRMED`, `CANCELLED`, `COMPLETED`); accepts an optional `rejectNote` when cancelling |
| `DELETE` | `/appointments/{id}` | Deletes an appointment |

**Example — creating an appointment:**

```json
{
  "dateStart": "2026-09-01",
  "dateEnd": "2026-09-01",
  "hourStart": "09:00:00",
  "hourEnd": "10:00:00",
  "vehicleId": 3,
  "customerId": 1,
  "purpose": "Periodic maintenance"
}
```

**Conflict response — `409 Conflict`:**

```json
{ "success": true, "message": "Bu arac, secilen tarih araliginda baska bir randevuya sahip" }
```

## Roadmap

- [x] Identity service — user CRUD, authentication (JWT cookie), role-based access, password hashing
- [x] Vehicle service — CRUD, availability status, km/location updates, role-gated writes
- [x] Appointment service — scheduling, overlap detection, availability lookup, status workflow
- [x] API Gateway — routing, JWT validation, header propagation, CORS
- [x] Frontend application — login, admin/employee dashboards, vehicle & employee management, appointment booking flow

## Contributing

- Follow the existing package structure (`controller`, `service`, `repository`, `mapper`/`component`, `entity`, `dto`, `exception`, `config`) when adding features to a backend service
- Use [Conventional Commits](https://www.conventionalcommits.org/) for commit messages (`feat`, `fix`, `refactor`, `chore`, `docs`, `test`, `build`)
- Keep API responses wrapped in the shared `ApiResponse<T>` envelope for consistency across services
- Add new exception types to each service's `GlobalExceptionHandler` rather than handling errors inline in controllers
- On the frontend, add new server state through an RTK Query API slice under `store/api/`, and keep shared types in sync with backend DTOs under `types/`

## Contributors
 
| Name | GitHub | Contribution |
|---|---|---|
| [Emir Özer] | [@FreeZeBoaRd](https://github.com/FreeZeBoaRd) | Vehicle Service |
| [Muhammet Egehan Kırmızı] | [@SlinderSlaz](https://github.com/SlinderSlaz) | Appointment Service |
| [Ömer Çıkan] | [@omercikan](https://github.com/omercikan) | Identity Service, API Gateway, Frontend |

## License

> This project is proprietary and intended for internal use at Yaltes only. Unauthorized copying, distribution, or use of this software outside the organization is not permitted.

© 2026 Yaltes. All rights reserved.
