import { registerOTel } from "@vercel/otel";

export function register() {
  console.log("[otel-debug] runtime=" + (process.env.NEXT_RUNTIME ?? "unknown"));
  console.log("[otel-debug] endpoint=" + (process.env.OTEL_EXPORTER_OTLP_ENDPOINT ?? "NOT_SET"));
  // OTEL_EXPORTER_OTLP_ENDPOINT is read automatically by @vercel/otel.
  // If the env var is absent, this is a no-op.
  registerOTel({ serviceName: "personal-finances-frontend" });
}
