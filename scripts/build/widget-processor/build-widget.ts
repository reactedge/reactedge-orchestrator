import { execSync } from 'child_process';
import path from 'path';
import {ReportScope} from "../report.ts";

export function buildWidget(
    widgetName: string,
    widgetPath: string,
    report: ReportScope
): void {
    report.info(
        'Building widget',
        { widget: widgetName }
    );

    try {
        execSync(
            `npm run build --prefix ${path.join(
                widgetPath,
                'vite_project'
            )}`,
            {
                stdio: 'inherit'
            }
        );

        report.success(
            'Widget build completed',
            { widget: widgetName }
        );
    } catch (error) {
        report.error(
            'Widget build failed',
            {
                widget: widgetName
            }
        );

        throw error;
    }
}