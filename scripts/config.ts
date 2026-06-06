import 'dotenv/config';
import dotenv from 'dotenv';
import type {Config} from "./build/types.ts";

let CONFIG: Config;

export function loadConfig(
    envFile: string
): void {

    dotenv.config({
        path: envFile,
        override: true
    });

    CONFIG = {
        widgetsDir: process.env.WP_WIDGETS_DIR!,
        widgetsUrl: process.env.WP_WIDGETS_URL!,
        cndUrl: process.env.WP_CDN_URL!,
        cndLiveUrl: process.env.WP_LIVE_CDN_URL!,
        widgetsLiveUrl: process.env.WP_LIVE_WIDGETS_URL!,
        projectRoot: process.env.REACTEDGE_ROOT!,
        localUrl: process.env.ENV_URL!,
        remoteUrl: process.env.ENV_REMOTE_URL!
    };
}

export function getConfig(): Config {

    if (!CONFIG) {
        throw new Error(
            'Configuration has not been initialised'
        );
    }

    return CONFIG;
}
