import { registerOTel } from "@vercel/otel";

export function register() {
  // OTEL_EXPORTER_OTLP_ENDPOINT is read automatically by @vercel/otel.
  // If the env var is absent, this is a no-op.
  registerOTel({ serviceName: "personal-finances-frontend" });
}
