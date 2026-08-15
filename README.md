<p align="center">
  <img width="170" alt="yaltes_logo" src="https://github.com/user-attachments/assets/c00f397e-d54b-424c-9935-1846062d898e" />
</p>

<h1 align="center">Yaltes Vehicle Appointment System</h1>

<p align="center">
  <img src="https://img.shields.io/badge/Java-26-ED8B00?style=for-the-badge&logo=openjdk&logoColor=white" alt="Java 26"/>
  <img src="https://img.shields.io/badge/Spring%20Boot-4.1.0-6DB33F?style=for-the-badge&logo=springboot&logoColor=white" alt="Spring Boot 4.1.0"/>
  <img src="https://img.shields.io/badge/PostgreSQL-16-4169E1?style=for-the-badge&logo=postgresql&logoColor=white" alt="PostgreSQL 16"/>
  <img src="https://img.shields.io/badge/Docker-Compose-2496ED?style=for-the-badge&logo=docker&logoColor=white" alt="Docker Compose"/>
  <img src="https://img.shields.io/badge/Maven-Build-C71A36?style=for-the-badge&logo=apachemaven&logoColor=white" alt="Maven"/>
  <img src="https://img.shields.io/badge/License-Proprietary-lightgrey?style=for-the-badge" alt="License"/>
</p>

A microservices-based backend system for managing vehicle records and service appointments, built with Spring Boot. The system is organized as independently deployable services, each owning its own database, and is designed to run behind a shared API gateway.

## Table of Contents

- [Overview](#overview)
- [Architecture](#architecture)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Services](#services)
  - [Identity Service](#identity-service)
  - [Vehicle Service](#vehicle-service)
  - [Appointment Service](#appointment-service)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Running in Development Mode](#running-in-development-mode)
  - [Running in Production Mode](#running-in-production-mode)
  - [Running a Single Service Locally](#running-a-single-service-locally)
- [Environment Variables](#environment-variables)
- [API Reference](#api-reference)
- [Roadmap](#roadmap)
- [Contributing](#contributing)
- [License](#license)

## Overview

This repository hosts the backend infrastructure for a vehicle service appointment platform. Each business capability is isolated into its own Spring Boot microservice with a dedicated PostgreSQL database, following a database-per-service pattern. Services communicate over HTTP and are intended to be exposed through a single API gateway.

**Core capabilities (planned and in progress):**

- User identity management, authentication, and role-based access control
- Vehicle registration and management per customer
- Service appointment scheduling and tracking

## Architecture

```
                        ┌─────────────────────┐
                        │     API Gateway     │
                        │   (gateway/api-     │
                        │      gateway)       │
                        └──────────┬──────────┘
                                   │
        ┌──────────────────────────┼──────────────────────────┐
        │                          │                          │
┌───────▼──────────┐      ┌────────▼────────┐        ┌────────▼────────────┐
│ Identity Service │      │ Vehicle Service │        │ Appointment Service │
│   (port 8083)    │      │   (port 8081)   │        │    (port 8082)      │
└───────┬──────────┘      └────────┬────────┘        └────────┬────────────┘
        │                          │                          │
┌───────▼────────┐        ┌────────▼────────┐        ┌────────▼─────────┐
│  identity-db   │        │   vehicle-db    │        │  appointment-db  │
│  (PostgreSQL)  │        │  (PostgreSQL)   │        │  (PostgreSQL)    │
└────────────────┘        └─────────────────┘        └──────────────────┘
```

Each service is fully independent: its own codebase, its own database, its own container, and its own lifecycle. Services do not share a database schema.

## Tech Stack

| Layer | Technology |
|---|---|
| Language | Java 26 |
| Framework | Spring Boot 4.1.0 |
| Persistence | Spring Data JPA / Hibernate |
| Database | PostgreSQL 16 |
| Security | Spring Security, BCrypt |
| Build Tool | Maven (with Maven Wrapper) |
| Containerization | Docker, Docker Compose |
| Boilerplate Reduction | Lombok |

## Project Structure

```
yaltes-vehicle-appointment/
├── docker-compose.yml            # Production-like orchestration (builds service images)
├── docker-compose.dev.yml        # Development orchestration (hot-reload via Maven)
├── docs/                         # Project documentation
├── frontend/
│   └── web/                      # Frontend application (not yet implemented)
├── gateway/
│   └── api-gateway/               # API Gateway service (not yet implemented)
├── infrastructure/
│   ├── docker/                    # Shared Docker resources
│   └── redis/                     # Redis configuration (not yet implemented)
└── services/
    ├── identity-service/          # User management, auth, and access control
    ├── vehicle-service/            # Vehicle records (skeleton)
    └── appointment-service/        # Appointment scheduling (skeleton)
```

## Services

### Identity Service

Manages user accounts, roles, and credentials. This is the most mature service in the repository.

**Package:** `com.yaltes.identity_service`
**Default port:** `8080` (mapped to host port `8083`)

**Implemented layers:**

| Layer | Responsibility |
|---|---|
| `controller` | Exposes REST endpoints (`UserController`) |
| `service` | Business logic, including password hashing and duplicate-email checks |
| `repository` | Spring Data JPA repository for `User` |
| `mapper` | Converts between entities and DTOs |
| `entity` | `User` JPA entity |
| `enums` | `Role` (`ADMIN`, `EMPLOYEE`) |
| `dto` | `CreateUserRequest`, `UpdateUserRequest`, `UserResponse`, `ApiResponse` |
| `exception` | `EmailAlreadyExistsException`, `GlobalExceptionHandler` |
| `config` | `PasswordConfig` (BCrypt), `WebSecurityConfig` |

**Key design decisions:**

- All API responses follow a consistent `ApiResponse<T>` envelope (`success`, `data`, `message`), with `null` fields omitted from the JSON output.
- Passwords are hashed with BCrypt before persistence; plain-text passwords are never stored.
- Duplicate email registration is rejected with an `EmailAlreadyExistsException`, mapped to `409 Conflict`.
- Validation errors and unexpected exceptions are centrally handled via `@RestControllerAdvice`, so no endpoint needs its own try/catch block.
- `POST /api/users` is publicly accessible; every other endpoint requires authentication (configured in `WebSecurityConfig`).

### Vehicle Service

**Package:** `com.yaltes.vehicle_service`
**Default port:** `8080` (mapped to host port `8081`)

Currently a bootstrapped Spring Boot application with its own database and Docker setup. Domain logic (vehicle entities, endpoints, business rules) has not yet been implemented.

### Appointment Service

**Package:** `com.yaltes.appointment_service`
**Default port:** `8080` (mapped to host port `8082`)

Currently a bootstrapped Spring Boot application with its own database and Docker setup. Domain logic (appointment entities, endpoints, business rules) has not yet been implemented.

## Getting Started

### Prerequisites

- [Docker](https://www.docker.com/) and Docker Compose
- Java 26 JDK (only required for running a service outside Docker)
- Maven (optional — each service includes the Maven Wrapper, `mvnw`)

### Running in Development Mode

Development mode runs each service inside a Maven container with the source code mounted as a volume, so changes are picked up automatically via Spring DevTools without rebuilding the image.

```bash
docker compose -f docker-compose.dev.yml up
```

This starts:

- `vehicle-db`, `appointment-db`, `identity-db` — PostgreSQL 16 instances
- `vehicle-service`, `appointment-service`, `identity-service` — running via `mvn spring-boot:run`

To stop and remove the containers:

```bash
docker compose -f docker-compose.dev.yml down
```

To reset all data (drops volumes as well):

```bash
docker compose -f docker-compose.dev.yml down -v
```

### Running in Production Mode

Production mode builds a standalone image for each service using its multi-stage `Dockerfile` (Maven build stage → lightweight JRE runtime stage).

```bash
docker compose up --build
```

### Running a Single Service Locally

Each service can also be run independently without Docker, provided a matching PostgreSQL instance is available (see [Environment Variables](#environment-variables)):

```bash
cd services/identity-service
./mvnw spring-boot:run
```

### Service Ports

| Service | Container Port | Host Port |
|---|---|---|
| vehicle-service | 8080 | 8081 |
| appointment-service | 8080 | 8082 |
| identity-service | 8080 | 8083 |
| vehicle-db | 5432 | 5433 |
| appointment-db | 5432 | 5434 |
| identity-db | 5432 | 5435 |

## Environment Variables

Each service reads its database configuration from environment variables, falling back to local defaults when unset (see each service's `application.properties`).

| Variable | Description | Default (identity-service example) |
|---|---|---|
| `DB_URL` | JDBC connection URL | `jdbc:postgresql://localhost:5435/identity_db` |
| `DB_USERNAME` | Database username | `postgres` |
| `DB_PASSWORD` | Database password | `postgres` |

> Defaults are intended for local development only. Override all three variables with secure values in any shared or production environment.

## API Reference

### Identity Service — `POST /api/users`

Creates a new user account.

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
{
  "success": false,
  "message": "Email adresi zaten var"
}
```

**Error response — `400 Bad Request` (validation failure):**

```json
{
  "success": false,
  "message": "email: must not be blank, password: must not be blank"
}
```

**Error response — `500 Internal Server Error` (unexpected failure):**

```json
{
  "success": false,
  "message": "Beklenmeyen bir hata oluştu"
}
```

Additional endpoints (vehicle management, appointment scheduling, authentication, user update/retrieval) are planned but not yet implemented.

## Roadmap

- [x] Identity service — user creation, password hashing, duplicate-email handling
- [x] Global exception handling with a standardized response envelope
- [x] Basic Spring Security configuration
- [ ] Authentication (login, JWT/session issuance)
- [ ] User retrieval and update endpoints
- [ ] Vehicle service domain model and endpoints
- [ ] Appointment service domain model and endpoints
- [ ] API Gateway implementation
- [ ] Frontend application
- [ ] Redis integration (caching / session storage)
- [ ] Inter-service communication and service discovery

## Contributing

- Follow the existing package structure (`controller`, `service`, `repository`, `mapper`, `entity`, `dto`, `exception`, `config`) when adding features to a service
- Use [Conventional Commits](https://www.conventionalcommits.org/) for commit messages (`feat`, `fix`, `refactor`, `chore`, `docs`, `test`, `build`)
- Keep API responses wrapped in the shared `ApiResponse<T>` envelope for consistency across services
- Add new exception types to each service's `GlobalExceptionHandler` rather than handling errors inline in controllers

## License

>This project is proprietary and intended for internal use at Yaltes only. Unauthorized copying, distribution, or use of this software outside the organization is not permitted.

© 2026 Yaltes. All rights reserved.
