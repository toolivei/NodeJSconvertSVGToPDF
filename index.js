const  { handler }  = require('./handler')
const SVGtoPDF1     = require('svg-to-pdfkit');
const fs            = require('fs');

// Call start
(async() => {

  // put the filename SVG here!!!!
  let buffSVG = fs.readFileSync('image.svg');

  let base64data = buffSVG.toString('base64');

  const event = {
    type: "SVG",
    base64: base64data,
  }

  try {
    let result = await handler(event);

    if(result.status == 200){
      let buffPDF = new Buffer.from(result.base64, 'base64');

      // put the filename PDF here!!!!
      fs.writeFileSync('image.pdf', buffPDF);  
    }

  } catch(e) {
    console.log(e.message);
  }    
    
  })();
