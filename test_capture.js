const puppeteer = require('puppeteer-core');
const path = require('path');
const fs = require('fs');

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

async function testOne() {
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

  const page = await browser.newPage();
  await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');

  console.log('Navigating to kainchidhaaga.com...');
  await page.goto('https://kainchidhaaga.com/', { waitUntil: 'networkidle2', timeout: 30000 }).catch(e => console.log(e.message));
  console.log('Waiting 5s...');
  await new Promise(r => setTimeout(r, 5000));

  // Dismiss potential popups/widgets
  await page.evaluate(() => {
    const popups = document.querySelectorAll('.popup, .modal, [class*="popup"], [class*="modal"], [class*="toast"]');
    popups.forEach(p => p.remove());
  }).catch(() => {});

  // 1. Hero banner (top)
  await page.evaluate(() => window.scrollTo(0, 0));
  await new Promise(r => setTimeout(r, 1000));
  await page.screenshot({ path: 'test_kainchi_1.jpg', type: 'jpeg', quality: 90 });
  console.log('Captured slide 1: Hero');

  // 2. Middle section (Collections / Categories)
  await page.evaluate(() => window.scrollTo(0, 800));
  await new Promise(r => setTimeout(r, 1200));
  await page.screenshot({ path: 'test_kainchi_2.jpg', type: 'jpeg', quality: 90 });
  console.log('Captured slide 2: Middle Section');

  // 3. Product section
  await page.evaluate(() => {
    const productSec = document.querySelector('.product-recommendations, .featured-products, [data-section-type*="product"], .grid--view-items, .collection, [id*="product"]');
    if (productSec) {
      productSec.scrollIntoView({ behavior: 'instant', block: 'start' });
    } else {
      window.scrollTo(0, 1600);
    }
  });
  await new Promise(r => setTimeout(r, 1200));
  await page.screenshot({ path: 'test_kainchi_3.jpg', type: 'jpeg', quality: 90 });
  console.log('Captured slide 3: Products');

  // 4. Other page: New arrivals / collection page
  console.log('Navigating to collection page...');
  await page.goto('https://kainchidhaaga.com/collections/all', { waitUntil: 'networkidle2', timeout: 30000 }).catch(e => console.log(e.message));
  await new Promise(r => setTimeout(r, 4000));
  await page.evaluate(() => window.scrollTo(0, 200));
  await new Promise(r => setTimeout(r, 800));
  await page.screenshot({ path: 'test_kainchi_4.jpg', type: 'jpeg', quality: 90 });
  console.log('Captured slide 4: Other page (Collections)');

  await browser.close();
  console.log('Done test');
}

testOne().catch(console.error);
