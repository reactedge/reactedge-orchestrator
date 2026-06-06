// util.ts
import fs from "fs";
import {CONFIG} from "../config.ts";

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
    return CONFIG.remoteUrl
        ? content.replaceAll(
            CONFIG.localUrl,
            CONFIG.remoteUrl
        )
        : content;
}