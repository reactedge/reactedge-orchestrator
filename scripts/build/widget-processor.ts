/**
 * Coordinates all processing required for a single widget. Owns the "process one widget" workflow.
 */
import type {ProcessedWidget, WidgetRegistry} from "./types.ts";
import {resolveWidgetEntry} from "./rebuild-registry/registry-loader.ts";
import {buildWidget} from "./widget-processor/build-widget.ts";
import {Report, ReportScope} from "./report.ts";
import {updateAssetRegistry} from "./widget-processor/asset-registry.ts";
import {loadContract} from "./widget-processor/contract-loader.ts";
import {loadSsrCss} from "./widget-processor/ssr-css-loadeer.ts";
import {generateSsr} from "./widget-processor/ssr-generator.ts";
import {writeManifest} from "./widget-processor/manifest-writer.ts";
import {getWidgetPath} from "./paths.ts";
import {getFilename} from "./util.ts";

export function processWidget(
    name: string,
    registry: WidgetRegistry,
    report: Report
): ProcessedWidget {
    let manifestResult: string | null = null;

    const resolved =
        resolveWidgetEntry(
            name,
            registry
        );

    const widgetName =
        resolved.widget || name;

    const widgetReport =
        report.createScope(
            `widget.${widgetName}`
        );

    report.info(
        'Widget processing started',
        {
            widget: name,
            buildTarget: widgetName
        }
    );

    try {
        const widgetPath = getWidgetPath(widgetName);
        buildWidget(widgetName, widgetPath, widgetReport);

        const registryResult = updateAssetRegistry(widgetName, name, report);
        const contractResult = loadContract(widgetName, registryResult.cdn, report);
        if (contractResult === null) {

            widgetReport.error(
                'Contract not found'
            );

            return {
                name,
                manifestFile: ''
            };
        }

        const contractFile = getFilename(registryResult.cdn)

        const cssSsr = loadSsrCss(widgetName, registryResult.cssFilename)
        const ssrResult = generateSsr(widgetName, contractFile, report);

        const manifest = {
            id: name,
            widget: widgetName,
            src: registryResult.src,
            css: registryResult.cssBundle,
            cssSsr,
            ssr: ssrResult ?? '',
            integrity: null,
            contract: contractResult,
            contractFile
        };

        manifestResult = writeManifest(manifest, name, report);

        widgetReport.complete(
            'Widget Manifest',
            {
                manifest
            }
        );

        report.success(
            'Widget processing completed',
            {
                widget: name
            }
        );
    } finally {
        widgetReport.end();
    }

    return {
        name,
        manifestFile: manifestResult
    };
}