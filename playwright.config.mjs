import {defineConfig} from '@playwright/test';
export default defineConfig({
  testDir:'./tests', testMatch:'browser.spec.mjs', reporter:'list', workers:1,
  use:{browserName:'chromium',channel:process.env.QIOR_BROWSER_CHANNEL || undefined,headless:true,acceptDownloads:true},
  outputDir:'./test-results'
});
