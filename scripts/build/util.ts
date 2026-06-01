// util.ts

export function getFilename(
    value: string
): string {
    return value.substring(
        value.lastIndexOf('/') + 1
    );
}