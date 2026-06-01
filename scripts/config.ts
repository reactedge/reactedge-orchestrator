import 'dotenv/config';

export const CONFIG = {
    widgetsDir: process.env.WP_WIDGETS_DIR,
    widgetsUrl: process.env.WP_WIDGETS_URL,
    cndUrl: process.env.WP_CDN_URL,
    cndLiveUrl: process.env.WP_LIVE_CDN_URL,
    widgetsLiveUrl: process.env.WP_LIVE_WIDGETS_URL
};

