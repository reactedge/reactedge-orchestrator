// util.ts
import {getConfig} from "../config.ts";

export function getFilename(
    value: string
): string {
    return value.substring(
        value.lastIndexOf('/') + 1
    );
}

export function validateUrl(
    url: string
): void {
    const CONFIG = getConfig()

    const hostname =
        new URL(url).hostname;

    if (
        !CONFIG.allowedHosts.includes(
            hostname
        )
    ) {
        throw new Error(
            `Host "${hostname}" is not allowed`
        );
    }
}