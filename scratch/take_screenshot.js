const puppeteer = require('puppeteer-core');
const path = require('path');

async function main() {
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1600, height: 1200, deviceScaleFactor: 2 });
  
  const fileUrl = 'file:///' + path.resolve(__dirname, '../public/portfolio-mockup.html').replace(/\\/g, '/');
  console.log('Loading page:', fileUrl);
  await page.goto(fileUrl, { waitUntil: 'networkidle0' });
  
  // Wait 2 seconds for fonts and animations to render smoothly
  await page.evaluate(() => new Promise(r => setTimeout(r, 2000)));

  const outputPath = path.resolve(__dirname, '../public/hydrone_portfolio_mockup_hd.png');
  await page.screenshot({ path: outputPath, fullPage: false });
  console.log('Screenshot saved to:', outputPath);

  await browser.close();
}

main().catch(console.error);
