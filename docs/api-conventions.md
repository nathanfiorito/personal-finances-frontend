# Backend API conventions (`/api/v1`)

The Java backend at `../../personal-finances-backend/` is the source of truth. These conventions apply to every request/response:

| Topic | Rule |
|---|---|
| JSON field case | **snake_case** on the wire. DTOs in `src/lib/api/types.ts` mirror this. Convert to camelCase at the edge of feature hooks if needed — do not auto-transform globally. |
| Dates | ISO 8601 (`YYYY-MM-DD` for date-only, full ISO 8601 for timestamps). Parse with `date-fns`. |
| Money | `amount` comes back as a **string** to preserve BigDecimal precision. **Never** coerce to `Number` for arithmetic — use `big.js`. Format for display with `Intl.NumberFormat`. |
| Enums | Lowercase. `transaction_type: "expense" \| "income"`, `payment_method: "credit" \| "debit"`, `entry_type: "manual" \| "image" \| "text" \| "pdf"`. |
| Null fields | Omitted when absent. Never send `null` in a create request for a field you want to leave untouched. |
| Pagination | Query params `page` (zero-based, default 0) and `page_size` (default 20, max 100). Response envelope: `{ items, total, page, page_size }`. |
| Auth | `POST /api/auth/login` → `{ token, expiresIn }`. Send `Authorization: Bearer <token>` on every `/api/v1/*` request. 401 → clear token and redirect to login. |
| Errors | Backend returns structured errors; client normalizes to `ApiError { status, code, message, details }`. |

## Endpoint cheat sheet

| Method | Path | Notes |
|---|---|---|
| POST | `/api/auth/login` | Public |
| GET | `/api/v1/transactions` | `?page=&page_size=` |
| GET | `/api/v1/transactions/{id}` | |
| POST | `/api/v1/transactions` | Manual create |
| PUT | `/api/v1/transactions/{id}` | Partial update allowed (all fields optional) |
| DELETE | `/api/v1/transactions/{id}` | Hard delete |
| GET | `/api/v1/categories` | Active only |
| POST | `/api/v1/categories` | `{ name }` |
| PATCH | `/api/v1/categories/{id}` | `{ name?, is_active? }` |
| DELETE | `/api/v1/categories/{id}` | Soft delete (sets `is_active=false`) |
| GET | `/api/v1/reports/summary?start=&end=` | Dates required |
| GET | `/api/v1/reports/monthly?year=` | Year optional (defaults to current) |
| GET | `/api/v1/export/csv?start=&end=` | Returns `text/csv` Blob |
| GET | `/api/v1/bff/transactions` | Combined payload for the transactions page |

Swagger: `/v3/api-docs` and `/swagger-ui.html` when `SWAGGER_ENABLED=true`.
