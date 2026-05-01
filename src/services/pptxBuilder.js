import pptxgen from 'pptxgenjs';

// PptxGenJS hex renk formatı '#' işareti olmadan kullanıyor
function hex(color) {
  return (color || '#333333').replace('#', '');
}

function fontFace(fontStyle) {
  return fontStyle === 'serif' ? 'Georgia' : 'Calibri';
}

// --- Slayt tiplerine göre düzen oluşturucuları ---

function buildTitleSlide(slide, data, colors, font) {
  // Alt renk şeridi
  slide.addShape('rect', {
    x: 0, y: 6.6, w: 13.33, h: 0.9,
    fill: { color: hex(colors.primaryColor) },
  });

  // Ana başlık
  slide.addText(data.title || 'Başlık', {
    x: 0.8, y: 1.8, w: 11.7, h: 2.2,
    fontSize: 44, bold: true,
    color: hex(colors.textColor),
    fontFace: font,
    align: 'left',
    wrap: true,
  });

  if (data.subtitle) {
    slide.addText(data.subtitle, {
      x: 0.8, y: 4.2, w: 10, h: 0.9,
      fontSize: 22,
      color: hex(colors.secondaryColor),
      fontFace: font,
      align: 'left',
    });
  }

  // Sol dikey şerit
  slide.addShape('rect', {
    x: 0, y: 0, w: 0.18, h: 7.5,
    fill: { color: hex(colors.accentColor || colors.secondaryColor) },
  });
}

function buildSectionDivider(slide, data, colors, font) {
  slide.addShape('rect', {
    x: 0, y: 0, w: 13.33, h: 7.5,
    fill: { color: hex(colors.primaryColor) },
  });

  slide.addText(data.title || '', {
    x: 1, y: 2.3, w: 11, h: 2.4,
    fontSize: 38, bold: true,
    color: 'FFFFFF',
    fontFace: font,
    align: 'center',
    wrap: true,
  });

  if (data.subtitle) {
    slide.addText(data.subtitle, {
      x: 1.5, y: 4.8, w: 10, h: 0.8,
      fontSize: 18,
      color: 'DDDDDD',
      fontFace: font,
      align: 'center',
    });
  }
}

function buildContentSlide(slide, data, colors, font) {
  // Başlık arka planı
  slide.addShape('rect', {
    x: 0, y: 0, w: 13.33, h: 1.15,
    fill: { color: hex(colors.primaryColor) },
  });

  slide.addText(data.title || '', {
    x: 0.4, y: 0.17, w: 12.5, h: 0.82,
    fontSize: 24, bold: true,
    color: 'FFFFFF',
    fontFace: font,
    align: 'left',
  });

  const bullets = (data.body || []).map((text) => ({
    text,
    options: {
      bullet: { type: 'bullet' },
      fontSize: 18,
      color: hex(colors.textColor),
      paraSpaceAfter: 10,
      fontFace: font,
    },
  }));

  if (bullets.length > 0) {
    slide.addText(bullets, {
      x: 0.5, y: 1.35, w: 12.3, h: 5.8,
      valign: 'top',
    });
  }
}

function buildTwoColumnSlide(slide, data, colors, font) {
  slide.addShape('rect', {
    x: 0, y: 0, w: 13.33, h: 1.15,
    fill: { color: hex(colors.primaryColor) },
  });

  slide.addText(data.title || '', {
    x: 0.4, y: 0.17, w: 12.5, h: 0.82,
    fontSize: 24, bold: true,
    color: 'FFFFFF',
    fontFace: font,
  });

  const items = data.body || [];
  const half = Math.ceil(items.length / 2);
  const leftItems = items.slice(0, half);
  const rightItems = items.slice(half);

  const makeBullets = (arr) =>
    arr.map((text) => ({
      text,
      options: {
        bullet: true,
        fontSize: 16,
        color: hex(colors.textColor),
        paraSpaceAfter: 8,
        fontFace: font,
      },
    }));

  if (leftItems.length > 0) {
    slide.addText(makeBullets(leftItems), { x: 0.3, y: 1.3, w: 6.2, h: 5.9, valign: 'top' });
  }
  if (rightItems.length > 0) {
    slide.addText(makeBullets(rightItems), { x: 6.9, y: 1.3, w: 6.1, h: 5.9, valign: 'top' });
  }

  // Dikey ayraç
  slide.addShape('rect', {
    x: 6.6, y: 1.5, w: 0.05, h: 5.5,
    fill: { color: hex(colors.accentColor || colors.secondaryColor) },
  });
}

function buildDataHighlightSlide(slide, data, colors, font) {
  slide.addShape('rect', {
    x: 0, y: 0, w: 13.33, h: 1.15,
    fill: { color: hex(colors.primaryColor) },
  });

  slide.addText(data.title || '', {
    x: 0.4, y: 0.17, w: 12.5, h: 0.82,
    fontSize: 24, bold: true,
    color: 'FFFFFF',
    fontFace: font,
  });

  const dataItems = data.body || [];
  const count = Math.min(dataItems.length, 3);
  const cardW = count === 1 ? 10 : count === 2 ? 5.5 : 3.8;
  const startX = count === 1 ? 1.7 : count === 2 ? 1.0 : 0.4;
  const gap = count === 1 ? 0 : count === 2 ? 1.3 : 0.6;

  dataItems.slice(0, 3).forEach((item, i) => {
    const xPos = startX + i * (cardW + gap);
    slide.addShape('rect', {
      x: xPos, y: 1.6, w: cardW, h: 4.2,
      fill: { color: hex(colors.accentColor || colors.secondaryColor) },
      line: { color: hex(colors.primaryColor), width: 2 },
    });
    slide.addText(item, {
      x: xPos + 0.15, y: 1.75, w: cardW - 0.3, h: 3.9,
      fontSize: count === 1 ? 28 : 20,
      bold: true, color: 'FFFFFF',
      fontFace: font,
      align: 'center', valign: 'middle', wrap: true,
    });
  });
}

function buildQuoteSlide(slide, data, colors, font) {
  slide.addShape('rect', {
    x: 0, y: 0, w: 0.5, h: 7.5,
    fill: { color: hex(colors.accentColor || colors.secondaryColor) },
  });

  const quoteText = (data.body && data.body[0]) || data.title || '';
  slide.addText(`"${quoteText}"`, {
    x: 1.0, y: 1.5, w: 11.5, h: 4.5,
    fontSize: 28, italic: true,
    color: hex(colors.primaryColor),
    fontFace: font,
    align: 'left', valign: 'middle', wrap: true,
  });

  if (data.subtitle) {
    slide.addText(`— ${data.subtitle}`, {
      x: 1.0, y: 6.0, w: 11.5, h: 0.7,
      fontSize: 16,
      color: hex(colors.textColor),
      fontFace: font,
      align: 'right',
    });
  }
}

function buildAgendaSlide(slide, data, colors, font) {
  slide.addShape('rect', {
    x: 0, y: 0, w: 13.33, h: 1.15,
    fill: { color: hex(colors.primaryColor) },
  });

  slide.addText(data.title || 'Gündem', {
    x: 0.4, y: 0.17, w: 12.5, h: 0.82,
    fontSize: 24, bold: true, color: 'FFFFFF', fontFace: font,
  });

  const items = data.body || [];
  items.forEach((item, i) => {
    const yPos = 1.5 + i * 0.85;

    slide.addShape('ellipse', {
      x: 0.4, y: yPos + 0.05, w: 0.5, h: 0.5,
      fill: { color: hex(colors.accentColor || colors.secondaryColor) },
    });
    slide.addText(`${i + 1}`, {
      x: 0.4, y: yPos + 0.05, w: 0.5, h: 0.5,
      fontSize: 14, bold: true, color: 'FFFFFF', fontFace: font, align: 'center', valign: 'middle',
    });
    slide.addText(item, {
      x: 1.1, y: yPos, w: 11.5, h: 0.6,
      fontSize: 18, color: hex(colors.textColor), fontFace: font,
    });
  });
}

function buildClosingSlide(slide, data, colors, font) {
  buildTitleSlide(slide, data, colors, font);
}

// --- Ana fonksiyon: JSON versiyonu → .pptx indir ---

export async function buildAndDownloadPptx(version, theme) {
  const pptx = new pptxgen();
  pptx.layout = 'LAYOUT_16x9';

  const colors = {
    primaryColor: theme.primaryColor || '#003781',
    secondaryColor: theme.secondaryColor || '#C8102E',
    backgroundColor: theme.backgroundColor || '#FFFFFF',
    textColor: theme.textColor || '#1A1A1A',
    accentColor: theme.accentColor || theme.secondaryColor || '#005EB8',
  };

  const font = fontFace(theme.fontStyle);

  for (const slideData of version.slides) {
    const slide = pptx.addSlide();
    slide.background = { color: hex(colors.backgroundColor) };

    switch (slideData.type) {
      case 'title':
        buildTitleSlide(slide, slideData, colors, font);
        break;
      case 'section-divider':
        buildSectionDivider(slide, slideData, colors, font);
        break;
      case 'agenda':
        buildAgendaSlide(slide, slideData, colors, font);
        break;
      case 'two-column':
        buildTwoColumnSlide(slide, slideData, colors, font);
        break;
      case 'data-highlight':
        buildDataHighlightSlide(slide, slideData, colors, font);
        break;
      case 'quote':
        buildQuoteSlide(slide, slideData, colors, font);
        break;
      case 'closing':
        buildClosingSlide(slide, slideData, colors, font);
        break;
      default:
        buildContentSlide(slide, slideData, colors, font);
    }

    if (slideData.speakerNotes) {
      slide.addNotes(slideData.speakerNotes);
    }
  }

  const fileName = `${version.title.replace(/\s+/g, '-').replace(/[^a-zA-Z0-9-_ğüşıöçĞÜŞİÖÇ]/g, '')}-sunum.pptx`;
  await pptx.writeFile({ fileName });
}
