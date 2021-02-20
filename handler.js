
exports.handler = async (event) => {

  return new Promise((resolve, reject) =>{

    const fs          = require('fs');
    const PDFDocument = require('pdfkit');
    const SVGtoPDF    = require('svg-to-pdfkit');
    const crypto      = require('crypto');

    let buffSVG    = new Buffer.from(event.base64, 'base64');
    let contentSVG = buffSVG.toString();

    let filename = '/tmp/temp'+crypto.randomBytes(4).readUInt32LE(0)+'.pdf';

    let docPDF  = new PDFDocument();
    let stream  = fs.createWriteStream(filename);
       
    SVGtoPDF(docPDF, contentSVG, 0, 0);
     
    docPDF.pipe(stream);
    docPDF.end();

    const buffers = [];
    docPDF.on("data", buffers.push.bind(buffers))
    
    docPDF.on("end", () => {

      fs.unlinkSync(filename);
      
      let pdfData = Buffer.concat(buffers);

      const response = {
        type: "PDF",
        status: 200,
        base64: pdfData.toString('base64'),
      }

      resolve(response);
    });

    docPDF.on("error", () => {

      const response = {
        type: "PDF",
        status: 400,
        base64: "",
      }

      reject(reponse);

    });

  });
}
