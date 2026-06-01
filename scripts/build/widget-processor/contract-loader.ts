/**
 * Resolves and loads widget contracts from disk. Returns contract metadata and parsed content.
 */
import type {ContractResult} from "../types.ts";
import fs from "fs";
import {getContractPath} from "../paths.ts";
import {Report} from "../report.ts";
import {getFilename} from "../util.ts";

export function loadContract(
    widgetName: string,
    cdn?: string,
    report: Report
): ContractResult {
    let contract = null;

    const contractFile = getFilename(cdn)
    const localPath = getContractPath(widgetName, contractFile)

    if (fs.existsSync(localPath)) {
        contract = JSON.parse(fs.readFileSync(localPath, 'utf-8'));
        report.info(
            '✔ Loaded local contract',
            {
                contractFile: contractFile              
            }
        );
    }

    if (!contract) {
        report.info(
            'SSR skipped',
            {
                widget: widgetName,
                reason: 'missing-contract'
            }
        );

        return null;
    }

    return contract
}