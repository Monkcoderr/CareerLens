const pdfParse = require('pdf-parse');

const parsePDF = async (buffer) => {
  let text = '';

  try {
    // pdf-parse v1 exports a callable function, while v2 exports PDFParse class.
    if (typeof pdfParse === 'function') {
      const data = await pdfParse(buffer);
      text = data?.text || '';
    } else if (pdfParse && typeof pdfParse.PDFParse === 'function') {
      const parser = new pdfParse.PDFParse({ data: buffer });
      try {
        const result = await parser.getText();
        text = result?.text || '';
      } finally {
        if (typeof parser.destroy === 'function') {
          await parser.destroy();
        }
      }
    } else {
      throw new Error('Unsupported pdf-parse module format');
    }

    if (!text || text.trim().length === 0) {
      throw new Error('No text content found in PDF');
    }

    return text.trim();
  } catch (error) {
    console.error('PDF parsing error:', error.message);
    throw new Error('Failed to parse PDF. Please make sure the file is a valid PDF with text content.');
  }
};

module.exports = { parsePDF };
