import {defineConfig} from '@playwright/test';

export default defineConfig({
  testDir:'./scripts', testMatch:'capture-readme.spec.mjs', reporter:'list', workers:1,
  use:{browserName:'chromium',channel:process.env.QIOR_BROWSER_CHANNEL || undefined,headless:true,viewport:{width:1100,height:1100},deviceScaleFactor:2,colorScheme:'light'},
  outputDir:'./test-results/screenshots'
});
