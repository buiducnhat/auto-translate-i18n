#!/usr/bin/env node

import { Command } from 'commander';
import { syncTranslations } from './index.js';
import { Config } from './type.js';

const program = new Command();

program
  .name('auto-translate-i18n')
  .description(
    "Automatically translate i18n JSON files using Google's Gemini AI"
  )
  .version('1.0.0');

program
  .requiredOption('-s, --source-lang <lang>', 'source language')
  .requiredOption('-d, --dest-lang <lang>', 'destination language')
  .requiredOption('-f, --source-file <path>', 'source file path')
  .requiredOption('-t, --dest-file <path>', 'destination file path')
  .requiredOption('-k, --api-key <key>', 'Gemini API key')
  .option('-m, --model <model>', 'Gemini model name', 'gemini-1.5-flash')
  .option('-p, --prompt <text>', 'additional context prompt for translation');

program.parse();

async function main() {
  const options = program.opts();

  // Command line options override config file
  const config: Config = {
    apiKey: options.apiKey,
    model: options.model,
    additionalPrompt: options.prompt,
    srcLang: options.sourceLang,
    destLang: options.destLang,
    srcPath: options.sourceFile,
    destPath: options.destFile,
  };

  if (!config.apiKey) {
    console.error('❌ API key is required');
    process.exit(1);
  }

  // Update process.env with the new config
  process.env.CONFIG = JSON.stringify(config);

  await syncTranslations(config);
}

main().catch((error) => {
  console.error('❌ Error:', error);
  process.exit(1);
});
