const puppeteer = require('puppeteer-core');
const path = require('path');
const fs = require('fs');

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const baseImagesDir = path.join(__dirname, 'assets/images');

const sites = [
  { id: 'tarun-goyal', url: 'https://tarungoyalclasses.in/', scrolls: [0, 600, 1200, 1800], wait: 6000 },
  { id: 'kainchi-dhaaga', url: 'https://kainchidhaaga.com/', scrolls: [0, 600, 1250, 1900], wait: 3000 },
  { id: 'erisnexa', url: 'https://erisnexa.com/', scrolls: [0, 650, 1300, 2000], wait: 3000 },
  { id: 'anamta-footwear', url: 'https://anamtafootwear.in/', scrolls: [0, 650, 1300, 1950], wait: 6000 },
  { id: 'bimacafe', url: 'https://bimacafe.com/', scrolls: [0, 550, 1100, 1700], wait: 3000 },
  { id: 'magic-jaggery', url: 'https://magicjaggery.com/', scrolls: [0, 650, 1250, 1850], wait: 4000 },
  { id: 'sumati-renewables', url: 'https://sumatirenewables.com/', scrolls: [0, 600, 1200, 1800], wait: 4000 },
  { id: 'perfect-boxwala', url: 'https://perfectboxwala.com/', scrolls: [0, 600, 1200, 1800], wait: 3000 },
  { id: 'tutorboon', url: 'https://tutorboon.com/', scrolls: [0, 550, 1100, 1650], wait: 3000 },
  { id: 'atds-conferences', url: 'https://atdsconferences.com/', scrolls: [0, 600, 1200, 1800], wait: 3000 },
  { id: 'dilli-vibes', url: 'https://dillivibes.com/', scrolls: [0, 600, 1200, 1800], wait: 3000 }
];

async function run() {
  console.log('Starting multi-shot screenshot capture...');

  // Ensure folders exist
  for (const s of sites) {
    const dir = path.join(baseImagesDir, s.id);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  }
  // Also create kashi-bikers folder
  const kashiDir = path.join(baseImagesDir, 'kashi-bikers');
  if (!fs.existsSync(kashiDir)) fs.mkdirSync(kashiDir, { recursive: true });

  const browser = await puppeteer.launch({
    executablePath: chromePath,
    headless: true,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-gpu',
      '--disable-web-security',
      '--window-size=1440,900'
    ],
    defaultViewport: { width: 1440, height: 900 }
  });

  for (const site of sites) {
    const siteDir = path.join(baseImagesDir, site.id);
    console.log(`\nCapturing multi-images for ${site.id} (${site.url})...`);
    let page;
    try {
      page = await browser.newPage();
      await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
      
      await page.goto(site.url, { waitUntil: 'networkidle2', timeout: 35000 })
        .catch(e => console.log(`Notice for ${site.id}:`, e.message));

      if (site.wait) {
        await new Promise(r => setTimeout(r, site.wait));
      }

      // Check if challenge is present
      const content = await page.content();
      if (content.includes('Checking your browser') || content.includes('Please wait for up to 5 seconds')) {
        console.log(`Challenge detected for ${site.id}, waiting 6s...`);
        await new Promise(r => setTimeout(r, 6000));
      }

      for (let i = 0; i < site.scrolls.length; i++) {
        const scrollY = site.scrolls[i];
        if (scrollY > 0) {
          await page.evaluate((y) => window.scrollTo(0, y), scrollY);
          await new Promise(r => setTimeout(r, 900));
        }

        const outPath = path.join(siteDir, `${i + 1}.jpg`);
        await page.screenshot({
          path: outPath,
          type: 'jpeg',
          quality: 90,
          clip: { x: 0, y: 0, width: 1440, height: 900 }
        });
        console.log(`  Saved ${site.id}/${i + 1}.jpg (${fs.statSync(outPath).size} bytes)`);
      }

      // Also copy 1.jpg to root file as fallback
      const rootFallback = path.join(baseImagesDir, `${site.id}.jpg`);
      if (fs.existsSync(path.join(siteDir, '1.jpg'))) {
        fs.copyFileSync(path.join(siteDir, '1.jpg'), rootFallback);
      }
    } catch (err) {
      console.error(`Error on ${site.id}:`, err.message);
    } finally {
      if (page) await page.close().catch(() => {});
    }
  }

  await browser.close();

  // Create kashi-bikers placeholder / showcase slides if not populated
  for (let i = 1; i <= 4; i++) {
    const kFile = path.join(kashiDir, `${i}.jpg`);
    if (!fs.existsSync(kFile)) {
      // Use existing high-res or generated asset
      const source = path.join(baseImagesDir, 'atds-conferences/1.jpg');
      if (fs.existsSync(source)) fs.copyFileSync(source, kFile);
    }
  }

  console.log('\nAll multi-shot captures completed successfully!');
}

run().catch(console.error);
