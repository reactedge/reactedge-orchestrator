/**
 * Updates registry entries after a widget build. Owns updateRegistry() interactions and resulting asset metadata.
 */

import {Report} from "../report.ts";
import {updateRegistry} from "../asset-registry/registry-updater.ts";
import {getManifestPath, getWidgetAssetsPath} from "../paths.ts";

export interface AssetRegistryResult {
    src: string;
    cdn?: string;
    cssBundle?: string;
    cssFilename?: string;
}

export function updateAssetRegistry(
    widgetName: string,
    name: string,
    report: Report
): AssetRegistryResult {

    report.info(
        'Updating asset registry',
        {
            widget: name,
            buildTarget: widgetName
        }
    );

    const registryPath = getManifestPath('widgets-dev.json');
    const widgetAssetsDir = getWidgetAssetsPath(widgetName);

    const result = updateRegistry({
        widgetName: name,
        buildTarget: widgetName,
        registryPath,
        widgetAssetsDir,
        updateIntegrity: false
    });

    report.success(
        'Asset registry updated',
        {
            widget: name,
            cdn: result.cdn,
            cssBundle: result.cssBundle
        }
    );

    return result;
}