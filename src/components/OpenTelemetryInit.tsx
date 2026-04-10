'use client';

import { useEffect } from 'react';
import { initOpenTelemetry } from '@/lib/opentelemetry';

/**
 * Client-side component that initializes OpenTelemetry tracing.
 * Must be rendered once at the root level of the application.
 */
export function OpenTelemetryInit() {
  useEffect(() => {
    initOpenTelemetry();
  }, []);

  return null;
}
