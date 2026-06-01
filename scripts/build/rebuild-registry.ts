/**
 * Entry point. Orchestrates the rebuild process. Knows the overall workflow but performs no business logic itself.
 */

import {Report} from "./report.ts";
import {loadRegistry, resolveWidgets} from './rebuild-registry/registry-loader.ts';
import { processWidget } from './widget-processor.ts';
import { writeIndex } from './rebuild-registry/index-writer.ts';
import {setupTelemetry} from "./observability/tracing.ts";
import {ConsoleObserver} from "./observability/observers/console-observer.ts";
import {OpenTelemetryObserver} from "./observability/observers/otel-observer.ts";

const report = new Report();
setupTelemetry();
report.addObserver(
    new ConsoleObserver()
);

report.addObserver(
    new OpenTelemetryObserver('registry-rebuild')
);

const registry =
    loadRegistry(
        'widgets-dev.json'
    );

report.info(
    'Registry loaded',
    {
        widgets: Object.keys(registry).length
    }
);

const widgets =
    resolveWidgets(
        process.argv[2] ?? 'all',
        registry
    );

report.info(
    'Widget selection resolved',
    {
        widgets: widgets.length
    }
);

const processedWidgets = [];

for (const widget of widgets) {
    processedWidgets.push(
        processWidget(
            widget,
            registry,
            report
        )
    );
}

report.success(
    'Widget processing completed',
    {
        widgets: processedWidgets.length
    }
);

writeIndex(
    processedWidgets,
    report
);

report.success(
    'Registry rebuild completed'
);

report.renderConsole()
report.publishSummary();

await new Promise(
    resolve => setTimeout(resolve, 5000)
);