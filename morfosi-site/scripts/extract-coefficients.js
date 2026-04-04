/* eslint-disable @typescript-eslint/no-require-imports, @typescript-eslint/no-unused-vars */
const fs = require("fs");
const path = require("path");
const pdfParse = require("pdf-parse");

const PDF_PATH = path.join("D:", "MORFOSI", "baseis", "συντελεστες.pdf");
const OUT_PATH = path.join("D:", "MORFOSI", "baseis", "coefficients-raw.txt");

async function main() {
  console.log("📄 Διαβάζω PDF:", PDF_PATH);
  const dataBuffer = fs.readFileSync(PDF_PATH);
  const data = await pdfParse(dataBuffer);

  console.log(`✅ Σελίδες: ${data.numpages}`);
  console.log(`✅ Χαρακτήρες: ${data.text.length}`);

  fs.writeFileSync(OUT_PATH, data.text, "utf8");
  console.log("💾 Αποθηκεύτηκε σε:", OUT_PATH);

  const lines = data.text.split("\n").filter(l => l.trim());
  console.log(`✅ Μη-κενές γραμμές: ${lines.length}`);
  console.log("\n--- PREVIEW (πρώτες 60 γραμμές) ---");
  lines.slice(0, 60).forEach((l, i) => console.log(`${i + 1}: ${l}`));
}

main().catch(err => {
  console.error("ERROR:", err.message);
});
