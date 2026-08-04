import { purgeDemoAndDuplicates } from './utils/dbCleaner.js';

async function main() {
  console.log('[Init Firestore] Executing automated purge of demo content and duplicate users...');
  const result = await purgeDemoAndDuplicates();
  console.log('[Init Firestore] Purge complete:', result);
}

main().catch(err => console.error('[Init Firestore Error]:', err));
