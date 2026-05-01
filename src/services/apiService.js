import { extractPptxText, extractContentText, validateFileSize } from './contentExtractor.js';

export async function analyzeAndGenerate({ pptxFile, contentFile, config }) {
  // Dosya boyutu kontrolü
  validateFileSize(pptxFile, 50);
  validateFileSize(contentFile, 20);

  // Tarayıcıda metin çıkarma
  const [pptxText, contentText] = await Promise.all([
    extractPptxText(pptxFile),
    extractContentText(contentFile),
  ]);

  if (!contentText || contentText.trim().length < 10) {
    throw new Error(
      'İçerik belgesinden metin çıkarılamadı. Dosyanın metin içerdiğinden emin ol (görsel tabanlı PDF çalışmaz). TXT veya DOCX formatını dene.'
    );
  }

  // Netlify Function'a gönder
  const response = await fetch('/api/analyze-and-generate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ pptxText, contentText, config, versionType: config.versionType || 'strategic' }),
  });

  const result = await response.json().catch(() => ({ error: 'Sunucudan geçersiz yanıt geldi' }));

  if (!response.ok || !result.success) {
    throw new Error(result.error || `Sunucu hatası: ${response.status}`);
  }

  return result.data;
}
