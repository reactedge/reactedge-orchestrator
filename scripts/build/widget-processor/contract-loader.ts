/**
 * Resolves and loads widget contracts from disk. Returns contract metadata and parsed content.
 */
import type {ContractResult, ContractWrapper} from "../types.ts";
import fs from "fs";
import {getContractPath} from "../paths.ts";
import {Report} from "../report.ts";
import {getFilename} from "../util.ts";
import {validateContract} from "../contract-loader/validator.ts";
import {wrapContract} from "../contract-loader/wrapper.ts";

export function loadContract(
    widgetName: string,
    cdn: string,
    report: Report
): ContractResult {
    let contract = null;

    const contractFile = getFilename(cdn)
    const localPath = getContractPath(widgetName, contractFile)

    if (fs.existsSync(localPath)) {
        const content = fs.readFileSync(localPath, 'utf-8');
        contract = JSON.parse(content) as ContractWrapper
        contract = wrapContract(contract)

        validateContract(
            contract,
            cdn
        );
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