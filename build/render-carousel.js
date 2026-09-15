const puppeteer = require("puppeteer");
const path = require("path");

(async () => {
  const inFile = process.argv[2];
  const outFile = process.argv[3];
  const browser = await puppeteer.launch({ headless: "new", args: ["--no-sandbox"] });
  const page = await browser.newPage();
  await page.goto("file:///" + inFile.replace(/\\/g, "/"), { waitUntil: "networkidle0" });
  await page.pdf({
    path: outFile,
    width: "1080px",
    height: "1350px",
    printBackground: true,
    pageRanges: "1-8",
  });
  await browser.close();
  console.log("PDF written -> " + outFile);
})();
