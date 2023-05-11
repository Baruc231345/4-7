const puppeteer = require('puppeteer');
const fs = require('fs');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  const url = "https://www.amazon.com/"
  await page.goto(url, {waitUntil: "load"});
  const pdfBuffer = await page.pdf();
  fs.writeFileSync('example.pdf', pdfBuffer);
  await browser.close();
})();