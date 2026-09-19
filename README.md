# BaldeCash · Backend — Módulo de solicitudes de financiamiento

API en **NestJS + TypeScript** que registra y consulta solicitudes de financiamiento.
Prueba técnica FullStack Developer Junior (BaldeCash).

## Stack

- NestJS 12 + TypeScript
- PostgreSQL + Prisma 7 (migraciones versionadas + seed)
- class-validator / class-transformer (validación con mensajes en español)
- `@nestjs/config` global (variables de entorno)

## Requisitos

- Node.js 24 + npm
- Docker (para Postgres) o un Postgres local

## Variables de entorno

Ver `.env.example`:

| Variable       | Ejemplo                                                                 | Descripción                               |
| -------------- | ----------------------------------------------------------------------- | ----------------------------------------- |
| `DATABASE_URL` | `postgresql://admin:admin@localhost:5432/applications_db?schema=public` | Conexión Postgres                         |
| `ANNUAL_RATE`  | `0.24`                                                                  | Tasa anual para el cálculo de la cuota    |
| `PORT`         | `5000`                                                                  | Puerto de la API (opcional, default 5000) |

## Levantar desde cero

```bash
# 1. Base de datos
docker compose up -d

# 2. Dependencias
npm install

# 3. Variables de entorno
cp .env.example .env

# 4. Migraciones
npx prisma migrate deploy

# 5. Datos de ejemplo (6 solicitudes: pendiente / aprobada / rechazada)
npm run db:seed

# 6. API en modo desarrollo
npm run start:dev
```

La API queda en `http://localhost:5000`.

## Endpoints

### POST /solicitudes

Crea una solicitud: valida, calcula la cuota francesa, persiste y devuelve el registro.

```json
{
  "fullName": "Juan Perez",
  "dni": "12345678",
  "email": "juan.perez@example.com",
  "phone": "987654321",
  "amount": 3000,
  "months": 12
}
```

Respuesta `201`:

```json
{
  "status": true,
  "data": {
    "id": 1,
    "fullName": "Juan Perez",
    "dni": "12345678",
    "email": "juan.perez@example.com",
    "phone": "987654321",
    "amount": "3000",
    "months": 12,
    "annualRate": 0.24,
    "installment": "283.68",
    "status": "pendiente"
  }
}
```

### GET /solicitudes

Lista con paginación y filtro por estado. Query params: `page` (default 1),
`limit` (default 10, máx 100), `status` (opcional: `pendiente | aprobada | rechazada`).

```
GET /solicitudes?page=1&limit=10&status=pendiente
```

Respuesta `200`:

```json
{
  "status": true,
  "data": [{ "...": "mismos 10 campos del POST" }],
  "total": 6,
  "page": 1,
  "limit": 10
}
```

### Errores de validación — 422

```json
{
  "message": "Error de validación",
  "status": false,
  "errors": [
    { "field": "amount", "messages": ["El monto máximo es S/ 10,000."] }
  ]
}
```

## Validaciones

| Campo    | Regla                                              |
| -------- | -------------------------------------------------- |
| `amount` | número entre S/ 1,000 y S/ 10,000                  |
| `months` | entero en 6, 12, 18 o 24                           |
| `dni`    | string de exactamente 8 dígitos                    |
| `email`  | formato de correo válido                           |
| `phone`  | 9 dígitos empezando en 9                           |
| `status` | `pendiente` (default) \| `aprobada` \| `rechazada` |

## Cálculo de la cuota

Amortización francesa, tasa mensual `i = ANNUAL_RATE / 12`:

```
cuota = P * (i * (1 + i)^n) / ((1 + i)^n - 1)
```

Ejemplo de la prueba: `P = 3000, n = 12 → S/ 283.68`.
Implementado en `src/utils/util.ts` (`calculateInstallment`), con `MONTHS_PER_YEAR = 12`
en `src/utils/constants.ts` para evitar el número mágico.

## Decisiones técnicas

- **NestJS** por tipado y estructura modular (`ApplicationsModule`).
- **Postgres + Prisma** con migraciones en `prisma/migrations` y seed en `prisma/seed.ts`
  (6 registros con los 3 estados, reutilizando `calculateInstallment`).
- **Tasa por variable de entorno** (`ANNUAL_RATE`, opcional 3 de la prueba).
- **DTOs con class-validator** y `ValidationPipe` global con `errorHttpStatusCode 422`
  y formato `{ field, messages }` en español.
- **Envelope `{ status, data }`** en POST y `{ status, data, total, page, limit }` en GET
  para un contrato coherente con el frontend.
- **`select` explícito de 10 campos** en Prisma (sin `createdAt/updatedAt` en la respuesta).
- **Código en inglés** (excepto textos visibles y valores de dominio `pendiente/aprobada/rechazada`
  que exige la prueba), funciones reutilizables en flecha en `src/utils/`,
  interfaces en `src/utils/interfaces.ts`.

## Qué quedó fuera / con más tiempo

- Tests unitarios del cálculo de la cuota (opcional 1).
- `PATCH /solicitudes/:id/estado` (opcional 2).
- `docker-compose` solo levanta Postgres; con más tiempo, un compose único que levante
  backend + frontend + DB con un comando (opcional 4).
- Filtro global de excepciones para unificar errores no controlados sin exponer trazas.
- Login / autenticación (registro, JWT y protección de endpoints por rol).

## IA utilizada

Asistencia de IA con **Muse Spark (en OpenCode)** y **ChatGPT**: scaffolding inicial, revisión de código,
nombres y estructura, depuración de errores (seed, server actions, estilos) y redacción
de este README.
