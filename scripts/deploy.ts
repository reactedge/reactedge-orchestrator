import { checkbox } from '@inquirer/prompts';
import {rebuildRegistry} from "./build/rebuild-registry.ts";
import {Report} from "./build/report.ts";
import {setupTelemetry} from "./build/observability/tracing.ts";
import {ConsoleObserver} from "./build/observability/observers/console-observer.ts";
import {OpenTelemetryObserver} from "./build/observability/observers/otel-observer.ts";
import {loadRegistry} from "./build/rebuild-registry/registry-loader.ts";

const report = new Report();
setupTelemetry();
report.addObserver(
    new ConsoleObserver()
);

report.addObserver(
    new OpenTelemetryObserver('registry-rebuild')
);

const registry =
    loadRegistry();

report.info(
    'Registry loaded',
    {
        "widgets & instances": Object.keys(registry).length
    }
);

const deployableWidgets =
    Object.keys(registry)
        .filter(
            key => !('widget' in registry[key])
        );

const widgets = await checkbox({
    message: 'Select widgets to deploy',
    choices: deployableWidgets.map(
        widget => ({
            name: widget,
            value: widget
        })
    )
});

rebuildRegistry(widgets, registry, report)