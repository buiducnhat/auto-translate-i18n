import fs from 'fs/promises';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { Config } from './type';

// Sleep utility function
const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Update translateText with delay
async function translateText(text: string, model: any) {
  try {
    const prompt = `${text}`;
    const result = await model.generateContent({
      contents: [
        {
          parts: [{ text: prompt }],
          role: 'user',
        },
      ],
      generationConfig: {
        ...model.generationConfig,
        responseSchema: { type: 'string' as any },
        responseMimeType: 'application/json',
      },
    });
    const translation = JSON.parse(result.response.text());

    // Add delay between API calls (1 second)
    await sleep(1000);

    return translation;
  } catch (error: any) {
    if (error.toString().includes('429')) {
      console.log('Rate limit reached, waiting 5 seconds...');
      await sleep(5000); // Wait longer if we hit rate limit
      return translateText(text, model); // Retry the translation
    }
    console.error('Translation error:', error);
    return text;
  }
}

async function deepMergeWithTranslation(
  target: Record<string, any>,
  source: Record<string, any>,
  model: any
) {
  for (const key in source) {
    if (source.hasOwnProperty(key)) {
      if (source[key] instanceof Object && !Array.isArray(source[key])) {
        target[key] = target[key] || {};
        await deepMergeWithTranslation(target[key], source[key], model);
      } else {
        // Translate if translation doesn't exist
        if (!target[key]) {
          target[key] = await translateText(source[key], model);
          console.log(`Translated ${key}: ${source[key]} -> ${target[key]}`);
        }
      }
    }
  }
  return target;
}

async function syncTranslations(config: Config) {
  try {
    // Initialize Google Generative AI
    const genAI = new GoogleGenerativeAI(config.apiKey);

    const model = genAI.getGenerativeModel({
      model: config.model || 'gemini-1.5-flash',
      systemInstruction: {
        parts: [
          {
            text: `You are a helpful assistant that translates ${config.srcLang} to ${config.destLang}. Only return the ${config.destLang} translation, nothing else`,
          },
          {
            text: config.additionalPrompt || '',
          },
        ],
        role: 'user',
      },
      generationConfig: {
        temperature: 1.5,
        topP: 0.95,
        topK: 40,
        maxOutputTokens: 1000,
        candidateCount: 1,
        stopSequences: [],
        responseSchema: {
          type: 'object',
          properties: { translation: { type: 'string' } },
          required: ['translation'],
        } as any,
        responseMimeType: 'application/json',
      },
    });

    const srcContent = JSON.parse(await fs.readFile(config.srcPath, 'utf8'));
    let destContent = {};

    try {
      destContent = JSON.parse(await fs.readFile(config.destPath, 'utf8'));
    } catch (error) {
      console.log(
        `No existing ${config.destLang} translations found, creating new file`
      );
    }

    const mergedContent = await deepMergeWithTranslation(
      structuredClone(destContent),
      srcContent,
      model
    );

    await fs.writeFile(
      config.destPath,
      JSON.stringify(mergedContent, null, 2),
      'utf8'
    );

    console.log('✅ Translation sync completed successfully!');

    // Count total keys
    const totalKeys =
      JSON.stringify(srcContent).match(/"[^"]+"\s*:/g)?.length || 0;
    console.log(`Total keys synchronized: ${totalKeys}`);
  } catch (error) {
    console.error('❌ Error during translation sync:', error);
    process.exit(1);
  }
}

// Export the main functions
export { syncTranslations };
