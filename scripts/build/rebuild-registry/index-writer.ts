/**
 * Creates and writes index.json. Owns index generation only.
 */
import type {ProcessedWidget} from "../types.ts";
import {CONFIG} from "../../config.ts";
import fs from "fs";
import path from "path";
import {Report} from "../report.ts";
import {getFilename} from "../util.ts";

export function writeIndex(
    widgets: ProcessedWidget[],
    report: Report
): void {

    report.info(
        'Writing manifest index',
        {
            widgets: widgets.length
        }
    );

    const index: Record<string, string> = {};

    for (const widget of widgets) {
        index[widget.name] = getFilename(widget.manifestFile);
    }

    const indexPath = path.join(
        CONFIG.widgetsDir,
        'manifests',
        'index.json'
    );

    fs.writeFileSync(
        indexPath,
        JSON.stringify(
            index,
            null,
            2
        )
    );

    report.success(
        'Manifest index written',
        {
            widgets: widgets.length,
            path: indexPath
        }
    );
}