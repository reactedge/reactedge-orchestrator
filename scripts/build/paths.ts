/**
 * Centralizes filesystem path construction and directory conventions. Prevents path-building logic from spreading everywhere.
 */

import path from 'path';
import { fileURLToPath } from 'url';
import {getConfig} from "../config.ts";

const __filename = fileURLToPath(import.meta.url);

export function getRoot(): string {
    const CONFIG = getConfig()
    const root = CONFIG.projectRoot;

    if (!root) {
        throw new Error(
            'Missing REACTEDGE_ROOT environment variable'
        );
    }

    return root;
}

export function getWidgetPath(
    widgetName: string
): string {
    return path.join(
        getRoot(),
        `widget-${widgetName}`
    );
}

export function getWidgetAssetsPath(
    widgetName: string
): string {
    return path.join(
        getRoot(),
        'widgets-cdn',
        'www',
        widgetName,
        'src'
    );
}

export function getContractPath(
    widgetName: string,
    contractFile: string
): string {
    return path.join(
        getRoot(),
        'widgets-cdn',
        'www',
        widgetName,
        'contracts',
        contractFile
    );
}

export function getManifestPath(): string {
    const CONFIG = getConfig()
    return path.join(
        CONFIG.widgetsDir,
        'manifests',
        'widgets.json'
    );
}