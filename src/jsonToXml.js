// src/utils/jsonToXml.js
export function jsonToXml(json) {
    let xml = '';
  
    function convert(obj) {
      for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
          if (typeof obj[key] === 'object' && !Array.isArray(obj[key])) {
            xml += `<${key}>`;
            convert(obj[key]);
            xml += `</${key}>`;
          } else if (Array.isArray(obj[key])) {
            obj[key].forEach(item => {
              xml += `<${key}>`;
              convert(item);
              xml += `</${key}>`;
            });
          } else {
            xml += `<${key}>${obj[key]}</${key}>`;
          }
        }
      }
    }
  
    convert(json);
    return xml;
  }
  