import { WebTracerProvider } from '@opentelemetry/sdk-trace-web';
import { BatchSpanProcessor } from '@opentelemetry/sdk-trace-base';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http';
import { resourceFromAttributes } from '@opentelemetry/resources';
import {trace, type Tracer} from "@opentelemetry/api";

let tracer: Tracer;

export function setupTelemetry() {
    const exporter = new OTLPTraceExporter({
        url: 'http://localhost:4318/v1/traces'
    });

    const provider = new WebTracerProvider({
        resource: resourceFromAttributes({
            'service.name': 'reactedge-build',
            'service.version': '1.0.0'
        }),
        spanProcessors: [
            new BatchSpanProcessor(exporter)
        ]
    });

    provider.register();

    tracer = trace.getTracer('reactedge-build');
}

export function getTracer() {
    return tracer;
}