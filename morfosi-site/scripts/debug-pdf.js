/* eslint-disable @typescript-eslint/no-require-imports, @typescript-eslint/no-unused-vars */
const pdf = require("pdf-parse");
console.log("Type:", typeof pdf);
console.log("Keys:", Object.keys(pdf));
console.log("Is function:", typeof pdf === "function");
console.log("Default:", typeof pdf.default);
