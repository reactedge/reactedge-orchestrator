/**
 * Shared interfaces and domain types used by the build pipeline.
 */
export interface WidgetRegistryEntry {
    widget?: string;
    cdn: string;
    css?: string;
}

export type WidgetRegistry =
    Record<string, WidgetRegistryEntry>;

export interface ProcessedWidget {
    name: string;
    manifestFile: string;
}

export interface AssetRegistryResult {
    src: string;
    cdn?: string;
    cssBundle?: string;
    cssFilename?: string;
}

export interface ContractResult {
    contract: unknown | null;
    contractFile: string | null;
    localPath: string | null;
}

export interface WidgetManifest {
    id: string;
    widget: string;
    src: string;
    css?: string;
    cssSsr?: string | null;
    ssr?: string;
    integrity?: string | null;
    contract?: unknown;
    contractFile?: string | null;
}

export interface Config {
    widgetsDir: string;
    widgetsUrl: string;
    cndUrl: string;
    cndLiveUrl: string;
    widgetsLiveUrl: string;
    projectRoot: string;
    localUrl: string;
    remoteUrl: string;
}