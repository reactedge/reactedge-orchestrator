// util.ts
import fs from "fs";
import {getConfig} from "../config.ts";

export function getFilename(
    value: string
): string {
    return value.substring(
        value.lastIndexOf('/') + 1
    );
}

export function replaceEnvironmentUrls(
    content: string
): string {
    const CONFIG = getConfig()

    return CONFIG.remoteUrl
        ? content.replaceAll(
            CONFIG.localUrl,
            CONFIG.remoteUrl
        )
        : content;
}