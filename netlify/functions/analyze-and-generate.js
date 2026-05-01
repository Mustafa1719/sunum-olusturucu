import Anthropic from '@anthropic-ai/sdk';

const VERSION_CONFIGS = {
  strategic: {
    id: 'strategic',
    title: 'Stratejik Genel Bakış',
    instruction: 'Büyük resimle başla, sonra detaya in. Neden önemli → Ne yapıyoruz → Nasıl başarırız yapısını kullan.',
  },
  'problem-solution': {
    id: 'problem-solution',
    title: 'Problem-Çözüm',
    instruction: 'Zorluk/sorunu ortaya koy, ardından çözümü ve faydaları göster. Problem → Analiz → Çözüm → Sonuç yapısını kullan.',
  },
  'data-first': {
    id: 'data-first',
    title: 'Veriye Dayalı',
    instruction: 'Sayılar ve kanıtlarla başla, sonra anlatıya geç. Metrik → Bulgu → Öneri yapısını kullan.',
  },
};

function buildSystemPrompt(versionConfig) {
  return `Sen bir kurumsal sunum tasarım ve içerik uzmanısın. Görevin:
1. Bir PowerPoint şablon dosyasından renk paleti ve düzen stilini çıkarmak
2. Bir içerik belgesini profesyonel sunum slaytlarına yapılandırmak
3. "${versionConfig.title}" odaklı TEK bir sunum versiyonu üretmek

ŞABLON ANALİZ KURALLARI:
- Baskın birincil rengi hex olarak çıkar (örn. "#003781")
- İkincil/vurgu rengini çıkar
- Font stilini belirle: "serif" veya "sans-serif"
- Düzen stilini 3 kelimeyle tanımla (örn. "minimal-corporate")

SLAYT ÜRETİM KURALLARI:
- TAM OLARAK 1 versiyon üret: "${versionConfig.title}"
- Anlatı yapısı: ${versionConfig.instruction}
- İstenen slayt sayısına uy
- Slayt tipleri: "title", "agenda", "content", "data-highlight", "closing"
- Her slayta 2-4 madde yaz
- speakerNotes: ""

ÇIKTI FORMATI — SADECE bu JSON'u döndür, markdown fence veya açıklama ekleme:

{
  "templateTheme": {
    "primaryColor": "#hex",
    "secondaryColor": "#hex",
    "backgroundColor": "#hex",
    "textColor": "#hex",
    "accentColor": "#hex",
    "fontStyle": "sans-serif",
    "layoutStyle": "minimal-corporate"
  },
  "contentSummary": {
    "mainTopic": "string",
    "keyMessages": ["string", "string", "string"],
    "suggestedSlideCount": 6
  },
  "versions": [
    {
      "id": "${versionConfig.id}",
      "title": "${versionConfig.title}",
      "description": "Bu versiyonun vurgusunu açıklayan bir cümle",
      "slides": [
        {
          "index": 1,
          "type": "title",
          "title": "Slayt başlığı",
          "subtitle": "Alt başlık",
          "body": ["madde 1", "madde 2"],
          "speakerNotes": ""
        }
      ]
    }
  ]
}`;
}

function buildUserPrompt(pptxText, contentText, config) {
  return `Aşağıdaki bilgileri kullanarak sunum versiyonunu üret.

SUNUM YAPILANDIRMASI:
- Başlık: ${config.title || 'Kurumsal Sunum'}
- Hedef Kitle: ${config.audience || 'Yönetim Kurulu'}
- İletişim Tonu: ${config.tone || 'Profesyonel ve öz'}
- Slayt Sayısı: ${config.slideCount || 6}

POWERPOINT ŞABLON BİLGİSİ:
---
${pptxText ? pptxText.slice(0, 2000) : 'Şablon yok. Varsayılan: birincil #003781, ikincil #C8102E, arka plan #FFFFFF.'}
---

İÇERİK BELGESİ:
---
${contentText ? contentText.slice(0, 5000) : 'İçerik belgesi boş.'}
---

HATIRLATMA: SADECE JSON döndür. Başka hiçbir metin ekleme.`;
}

export default async function handler(req) {
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    });
  }

  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Sadece POST desteklenir' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
    });
  }

  try {
    const body = await req.json();
    const { pptxText, contentText, config } = body;
    const versionType = body.versionType || 'strategic';

    if (!contentText) {
      return new Response(JSON.stringify({ error: 'İçerik metni eksik' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
      });
    }

    const versionConfig = VERSION_CONFIGS[versionType] || VERSION_CONFIGS.strategic;

    const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

    const message = await client.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 2500,
      system: buildSystemPrompt(versionConfig),
      messages: [{ role: 'user', content: buildUserPrompt(pptxText, contentText, config) }],
    });

    const rawText = message.content[0].text;

    const fenceMatch = rawText.match(/```(?:json)?\n?([\s\S]*?)\n?```/);
    const jsonMatch = rawText.match(/\{[\s\S]*\}/);
    const jsonStr = fenceMatch ? fenceMatch[1] : jsonMatch ? jsonMatch[0] : rawText;

    let presentationData;
    try {
      presentationData = JSON.parse(jsonStr);
    } catch {
      console.error('JSON parse hatası:', jsonStr.slice(0, 500));
      return new Response(
        JSON.stringify({ error: 'Yapay zeka geçersiz format döndürdü. Lütfen tekrar deneyin.' }),
        { status: 500, headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' } }
      );
    }

    return new Response(JSON.stringify({ success: true, data: presentationData }), {
      status: 200,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
    });
  } catch (error) {
    console.error('Function hatası:', error);
    const msg =
      error.status === 401
        ? 'API anahtarı geçersiz.'
        : error.message || 'Beklenmeyen bir hata oluştu';

    return new Response(JSON.stringify({ success: false, error: msg }), {
      status: 500,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
    });
  }
}
