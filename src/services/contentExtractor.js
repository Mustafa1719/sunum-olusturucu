// PPTX dosyaları aslında ZIP arşividir — içinde XML var
// JSZip ile açıp slide XML'lerinden renk/font/metin çıkarıyoruz
// PDF için pdfjs-dist, DOCX için officeparser kullanıyoruz

async function extractFromPptx(file) {
  // PPTX = ZIP dosyası, içinde XML sayfaları var
  // officeparser ile tüm metni çıkarıp Claude'a gönderiyoruz
  const { parseOfficeAsync } = await import('officeparser');
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from ? Buffer.from(arrayBuffer) : arrayBuffer;

  try {
    const text = await parseOfficeAsync(buffer, { outputErrorToConsole: false });
    return text || '';
  } catch {
    return '';
  }
}

async function extractFromDocx(file) {
  const { parseOfficeAsync } = await import('officeparser');
  const arrayBuffer = await file.arrayBuffer();
  try {
    const text = await parseOfficeAsync(arrayBuffer, { outputErrorToConsole: false });
    return text || '';
  } catch {
    return '';
  }
}

async function extractFromPdf(file) {
  const pdfjsLib = await import('pdfjs-dist');
  // Worker'ı CDN'den yükle — bundle boyutunu küçük tutar
  pdfjsLib.GlobalWorkerOptions.workerSrc =
    'https://cdn.jsdelivr.net/npm/pdfjs-dist@4.4.168/build/pdf.worker.min.mjs';

  const arrayBuffer = await file.arrayBuffer();
  try {
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    let fullText = '';
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();
      fullText += textContent.items.map((item) => item.str).join(' ') + '\n';
    }
    return fullText;
  } catch {
    return '';
  }
}

async function extractFromTxt(file) {
  return await file.text();
}

export async function extractPptxText(file) {
  return extractFromPptx(file);
}

export async function extractContentText(file) {
  const name = file.name.toLowerCase();
  if (name.endsWith('.pdf')) return extractFromPdf(file);
  if (name.endsWith('.docx')) return extractFromDocx(file);
  if (name.endsWith('.txt') || name.endsWith('.md')) return extractFromTxt(file);
  throw new Error(`Desteklenmeyen dosya türü: ${file.name}. PDF, DOCX veya TXT yükleyin.`);
}

export function validateFileSize(file, maxMB) {
  const maxBytes = maxMB * 1024 * 1024;
  if (file.size > maxBytes) {
    throw new Error(`Dosya boyutu çok büyük (${Math.round(file.size / 1024 / 1024)} MB). Maksimum: ${maxMB} MB`);
  }
}
