/**
 * Generates SSR HTML for a widget given a contract. Owns render-page execution.
 */
import fs from "fs";
import path from "path";
import {execSync} from "child_process";
import {Report} from "../report.ts";
import {getContractPath, getWidgetPath} from "../paths.ts";
import {replaceEnvironmentUrls} from "../util.ts";

export function generateSsr(
    widgetName: string,
    contractFile: string,
    report: Report
): string | null {
    const widgetPath =
        getWidgetPath(widgetName);

    const contractPath = getContractPath(widgetName, contractFile)

    const rendererPath = path.join(
        widgetPath,
        'scripts',
        'render-page.ts'
    );

    if (!fs.existsSync(rendererPath)) {

        report.info(
            'SSR skipped',
            {
                widget: widgetName,
                reason: 'missing-renderer'
            }
        );

        return null;
    }

    const result = execSync(
        `NODE_TLS_REJECT_UNAUTHORIZED=0 npx tsx scripts/render-page.ts "${contractPath}"`,
        {
            cwd: widgetPath,
            encoding: 'utf8'
        }
    );

    report.success(
        'SSR generated',
        {
            widget: widgetName
        }
    );

    return replaceEnvironmentUrls(result);
}