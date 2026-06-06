/**
 * Entry point. Orchestrates the rebuild process. Knows the overall workflow but performs no business logic itself.
 */

import {Report} from "./report.ts";
import {resolveWidgets} from './rebuild-registry/registry-loader.ts';
import { processWidget } from './widget-processor.ts';
import { writeIndex } from './rebuild-registry/index-writer.ts';
import type {WidgetRegistry} from "./types.ts";

export async function rebuildRegistry(
    selectedWidgets: string[],
    registry: WidgetRegistry,
    report: Report
) {
    const widgets =
        resolveWidgets(
            selectedWidgets,
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
}

await new Promise(
    resolve => setTimeout(resolve, 5000)
);