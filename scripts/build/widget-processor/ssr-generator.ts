/**
 * Generates SSR HTML for a widget given a contract. Owns render-page execution.
 */
import fs from "fs";
import path from "path";
import {Report} from "../report.ts";
import {getContractPath, getWidgetPath} from "../paths.ts";
import {exec} from "node:child_process";

export async function generateSsr(
    widgetName: string,
    contractFile: string,
    report: Report
): Promise<string | null> {

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

    return new Promise(
        (resolve, reject) => {
            exec(
                `NODE_TLS_REJECT_UNAUTHORIZED=0 npx tsx scripts/render-page.ts "${contractPath}"`,
                {
                    cwd: widgetPath,
                    encoding: 'utf8'
                },
                (error, stdout) => {

                    if (error) {
                        reject(error);
                        return;
                    }

                    report.success(
                        'SSR generated',
                        {
                            widget: widgetName
                        }
                    );

                    resolve(
                        stdout
                    );
                }
            );
        }
    );
}
