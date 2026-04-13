import { registerOTel } from "@vercel/otel";

export function register() {
  const runtime = process.env.NEXT_RUNTIME ?? "unknown";
  const endpoint = process.env.OTEL_EXPORTER_OTLP_ENDPOINT ?? "(not set)";
  console.log(`[instrumentation] register() called — runtime=${runtime} OTEL_EXPORTER_OTLP_ENDPOINT=${endpoint}`);
  // OTEL_EXPORTER_OTLP_ENDPOINT is read automatically by @vercel/otel.
  // If the env var is absent, this is a no-op.
  registerOTel({ serviceName: "personal-finances-frontend" });
}
