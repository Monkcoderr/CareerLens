const pdfParse = require('pdf-parse');

const parsePDF = async (buffer) => {
  try {
    const data = await pdfParse(buffer);

    if (!data.text || data.text.trim().length === 0) {
      throw new Error('No text content found in PDF');
    }

    return data.text.trim();
  } catch (error) {
    console.error('PDF parsing error:', error.message);
    throw new Error('Failed to parse PDF. Please make sure the file is a valid PDF with text content.');
  }
};

module.exports = { parsePDF };