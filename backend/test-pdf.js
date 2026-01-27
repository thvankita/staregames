const { PDFParse } = require('pdf-parse');

async function test() {
  try {
    // This will still fail because the buffer is not a valid PDF, 
    // but we can see if it gets past the constructor
    const parser = new PDFParse({ data: Buffer.from('%PDF-1.4\n1 0 obj\n<<\n/Title (Test)\n>>\nendobj\ntrailer\n<<\n/Root 1 0 R\n>>\n%%EOF') });
    console.log('Parser created');
    const result = await parser.getText();
    console.log('Text result:', result.text);
  } catch (e) {
    console.log('Error:', e.message);
  }
}

test();
