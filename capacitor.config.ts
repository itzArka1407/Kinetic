import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
    appId: 'com.yourorg.kinetic',
    appName: 'Kinetic',
    webDir: 'dist'
};

export default config;

// pnpm build
// pnpm exec cap sync
// pnpm exec cap run android
//
// WHEN TO RUN ON PHONE(ANDROID):
// pnpm exec cap init "Kinetic" com.yourorg.kinetic --web-dir=dist
// pnpm exec cap add android
// pnpm build
// pnpm exec cap sync
// pnpm exec cap run android
