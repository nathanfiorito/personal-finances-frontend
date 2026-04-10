/**
 * SigNoz OpenTelemetry configuration for frontend tracing.
 * This module initializes the OpenTelemetry SDK and sends traces to the SigNoz OTLP endpoint.
 */

import { ZoneContextManager } from '@opentelemetry/context-zone';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http';
import { registerInstrumentations } from '@opentelemetry/instrumentation';
import { Resource } from '@opentelemetry/resources';
import { WebTracerProvider } from '@opentelemetry/sdk-trace-web';
import { SimpleSpanProcessor, ConsoleSpanExporter } from '@opentelemetry/sdk-trace-base';
import { SemanticAttributes } from '@opentelemetry/semantic-conventions';

const SIGNOZ_OTLP_ENDPOINT = process.env.NEXT_PUBLIC_SIGNOZ_OTLP_ENDPOINT || 'https://signoz-otel.nathanfiorito.com.br:4318';
const SERVICE_NAME = 'finbot-frontend';

let isInitialized = false;

export function initOpenTelemetry() {
  if (isInitialized || typeof window === 'undefined') {
    return;
  }

  isInitialized = true;

  const resource = new Resource({
    [SemanticAttributes.SERVICE_NAME]: SERVICE_NAME,
  });

  const tracerProvider = new WebTracerProvider({
    resource,
  });

  // Export traces to SigNoz via OTLP HTTP
  const otlpExporter = new OTLPTraceExporter({
    url: `${SIGNOZ_OTLP_ENDPOINT}/v1/traces`,
  });

  tracerProvider.addSpanProcessor(new SimpleSpanProcessor(otlpExporter));

  // Also log spans to console in development
  if (process.env.NODE_ENV === 'development') {
    tracerProvider.addSpanProcessor(new SimpleSpanProcessor(new ConsoleSpanExporter()));
  }

  tracerProvider.register({
    contextManager: new ZoneContextManager(),
  });

  // Register automatic instrumentations
  registerInstrumentations({
    tracerProvider,
    instrumentations: [],
  });
}
