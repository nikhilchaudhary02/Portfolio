const puppeteer = require('puppeteer-core');
const path = require('path');
const fs = require('fs');

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const baseImagesDir = path.join(__dirname, 'assets/images');

const sites = [
  {
    id: 'tarun-goyal',
    name: 'Tarun Goyal Classes',
    url: 'https://tarungoyalclasses.in/',
    isEcommerce: true,
    wait: 6000,
    middleScroll: 650,
    middleSelector: '.elementor-section:nth-of-type(2), .exam-features, .features',
    productOrServiceScroll: 1350,
    productOrServiceSelector: '.products, .woocommerce-loop-product__title, .elementor-element-books',
    innerUrls: [
      'https://tarungoyalclasses.in/books/',
      'https://tarungoyalclasses.in/ebooks/',
      'https://tarungoyalclasses.in/about-us/'
    ],
    innerScroll: 200
  },
  {
    id: 'kainchi-dhaaga',
    name: 'Kainchi Dhaaga',
    url: 'https://kainchidhaaga.com/',
    isEcommerce: true,
    wait: 6000,
    middleScroll: 800,
    middleSelector: '.collection-list, [class*="category"], [class*="collection"]',
    productOrServiceScroll: 1550,
    productOrServiceSelector: '.featured-products, .product-recommendations, [data-section-type*="product"]',
    innerUrls: [
      'https://kainchidhaaga.com/collections/all',
      'https://kainchidhaaga.com/collections/new-arrivals'
    ],
    innerScroll: 200
  },
  {
    id: 'erisnexa',
    name: 'Eris-Nexa Elevators',
    url: 'https://erisnexa.com/',
    isEcommerce: false,
    wait: 6000,
    middleScroll: 750,
    middleSelector: '#about, .about-section, .elementor-section:nth-of-type(2)',
    productOrServiceScroll: 1600,
    productOrServiceSelector: '#services, .services-section, .elementor-section:nth-of-type(3)',
    innerUrls: [
      'https://erisnexa.com/services/',
      'https://erisnexa.com/products/',
      'https://erisnexa.com/about-us/',
      'https://erisnexa.com/contact-us/'
    ],
    innerScroll: 250
  },
  {
    id: 'anamta-footwear',
    name: 'Anamta Footwear',
    url: 'https://anamtafootwear.in/',
    isEcommerce: true,
    wait: 6000,
    middleScroll: 750,
    middleSelector: '.categories, .banner-grid, .elementor-section:nth-of-type(2)',
    productOrServiceScroll: 1500,
    productOrServiceSelector: '.products, .woocommerce, .featured-products',
    innerUrls: [
      'https://anamtafootwear.in/shop/',
      'https://anamtafootwear.in/product-category/women/',
      'https://anamtafootwear.in/about-us/'
    ],
    innerScroll: 200
  },
  {
    id: 'bimacafe',
    name: 'BimaCafe',
    url: 'https://bimacafe.com/',
    isEcommerce: false,
    wait: 6000,
    middleScroll: 700,
    middleSelector: '#why-us, .why-choose-us, .insurance-types',
    productOrServiceScroll: 1450,
    productOrServiceSelector: '#services, .services-grid, .plans-table',
    innerUrls: [
      'https://bimacafe.com/about-us/',
      'https://bimacafe.com/contact-us/',
      'https://bimacafe.com/our-services/'
    ],
    innerScroll: 200
  },
  {
    id: 'magic-jaggery',
    name: 'Magic Jaggery',
    url: 'https://magicjaggery.com/',
    isEcommerce: true,
    wait: 6000,
    middleScroll: 750,
    middleSelector: '#about, .story-section, .process-section',
    productOrServiceScroll: 1550,
    productOrServiceSelector: '.products, .woocommerce, .featured-products',
    innerUrls: [
      'https://magicjaggery.com/shop/',
      'https://magicjaggery.com/our-story/',
      'https://magicjaggery.com/about-us/'
    ],
    innerScroll: 200
  },
  {
    id: 'sumati-renewables',
    name: 'Sumati Renewables',
    url: 'https://sumatirenewables.com/',
    isEcommerce: false,
    wait: 6000,
    middleScroll: 700,
    middleSelector: '#about, .about-us, .solar-benefits',
    productOrServiceScroll: 1450,
    productOrServiceSelector: '#services, .services, .solar-solutions',
    innerUrls: [
      'https://sumatirenewables.com/services/',
      'https://sumatirenewables.com/about-us/',
      'https://sumatirenewables.com/contact-us/'
    ],
    innerScroll: 200
  },
  {
    id: 'perfect-boxwala',
    name: 'Perfect Boxwala',
    url: 'https://perfectboxwala.com/',
    isEcommerce: true,
    wait: 6000,
    middleScroll: 700,
    middleSelector: '#about, .intro-section, .capabilities',
    productOrServiceScroll: 1450,
    productOrServiceSelector: '.products, .products-grid, #products, .boxes-range',
    innerUrls: [
      'https://perfectboxwala.com/shop/',
      'https://perfectboxwala.com/products/',
      'https://perfectboxwala.com/about-us/'
    ],
    innerScroll: 200
  },
  {
    id: 'tutorboon',
    name: 'TutorBoon',
    url: 'https://tutorboon.com/',
    isEcommerce: false,
    wait: 6000,
    middleScroll: 650,
    middleSelector: '#how-it-works, .how-it-works, .categories',
    productOrServiceScroll: 1350,
    productOrServiceSelector: '#tutors, .tutors-list, .courses, .services',
    innerUrls: [
      'https://tutorboon.com/about-us/',
      'https://tutorboon.com/courses/',
      'https://tutorboon.com/tutors/',
      'https://tutorboon.com/contact-us/'
    ],
    innerScroll: 200
  },
  {
    id: 'atds-conferences',
    name: 'ATDS Conferences',
    url: 'https://atdsconferences.com/',
    isEcommerce: false,
    wait: 6000,
    middleScroll: 650,
    middleSelector: '#about, .about-atds, .features',
    productOrServiceScroll: 1300,
    productOrServiceSelector: '#conferences, .upcoming-conferences, .events',
    innerUrls: [
      'https://atdsconferences.com/upcoming-conferences/',
      'https://atdsconferences.com/conferences/',
      'https://atdsconferences.com/about-us/'
    ],
    innerScroll: 200
  },
  {
    id: 'dilli-vibes',
    name: 'Dilli Vibes',
    url: 'https://dillivibes.com/',
    isEcommerce: false,
    wait: 6000,
    middleScroll: 700,
    middleSelector: '#about, .story, .ambiance',
    productOrServiceScroll: 1450,
    productOrServiceSelector: '#menu, .featured-menu, .specialties, .services',
    innerUrls: [
      'https://dillivibes.com/menu/',
      'https://dillivibes.com/about-us/',
      'https://dillivibes.com/contact-us/'
    ],
    innerScroll: 200
  }
];

async function cleanPopups(page) {
  await page.evaluate(() => {
    const selectors = [
      '.chat-widget', '#tidio-chat', '#whatsapp-widget', '[class*="whatsapp"]',
      '[class*="sales-pop"]', '[class*="notification-popup"]', '.sales-popup',
      '[class*="salesPopup"]', '.toast', '.popup', '[aria-label*="chat"]',
      'iframe[src*="chat"]', 'iframe[title*="chat"]', '#drift-widget',
      '#intercom-container', '[id*="cookie"]', '[class*="cookie"]',
      '.cky-consent-container', '#onetrust-consent-sdk'
    ];
    selectors.forEach(sel => {
      try {
        document.querySelectorAll(sel).forEach(el => el.remove());
      } catch(e) {}
    });
  }).catch(() => {});
}

async function run() {
  console.log('Starting comprehensive multi-shot screenshot capture...\n');

  // Ensure folders exist
  for (const s of sites) {
    const dir = path.join(baseImagesDir, s.id);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  }
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
    console.log(`\n======================================================`);
    console.log(`Capturing 4 distinct views for: ${site.name} (${site.id})`);
    console.log(`URL: ${site.url}`);
    console.log(`======================================================`);

    let page;
    try {
      page = await browser.newPage();
      await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');

      console.log(`-> Opening homepage...`);
      await page.goto(site.url, { waitUntil: 'networkidle2', timeout: 35000 })
        .catch(e => console.log(`Notice on load: ${e.message}`));

      console.log(`-> Waiting ${site.wait / 1000}s for complete page render and assets...`);
      await new Promise(r => setTimeout(r, site.wait));

      // Check for security/challenge screening
      const content = await page.content().catch(() => '');
      if (content.includes('Checking your browser') || content.includes('Please wait for up to 5 seconds')) {
        console.log(`-> Challenge detected, waiting additional 6s...`);
        await new Promise(r => setTimeout(r, 6000));
      }

      await cleanPopups(page);

      // 1. SLIDE 1: Hero Banner (Top)
      console.log(`-> Capturing Slide 1: Website Hero Banner...`);
      await page.evaluate(() => window.scrollTo(0, 0));
      await new Promise(r => setTimeout(r, 1000));
      await cleanPopups(page);
      const s1Path = path.join(siteDir, '1.jpg');
      await page.screenshot({ path: s1Path, type: 'jpeg', quality: 90 });
      console.log(`   ✓ Saved ${site.id}/1.jpg (${fs.statSync(s1Path).size} bytes)`);

      // 2. SLIDE 2: Middle Section
      console.log(`-> Capturing Slide 2: Middle Section...`);
      await page.evaluate((targetY, selector) => {
        if (selector) {
          const el = document.querySelector(selector);
          if (el) {
            el.scrollIntoView({ behavior: 'instant', block: 'start' });
            return;
          }
        }
        window.scrollTo(0, targetY);
      }, site.middleScroll, site.middleSelector);
      await new Promise(r => setTimeout(r, 1400));
      await cleanPopups(page);
      const s2Path = path.join(siteDir, '2.jpg');
      await page.screenshot({ path: s2Path, type: 'jpeg', quality: 90 });
      console.log(`   ✓ Saved ${site.id}/2.jpg (${fs.statSync(s2Path).size} bytes)`);

      // 3. SLIDE 3: Product Section (eCommerce) or Our Services (Corporate)
      const sectionLabel = site.isEcommerce ? 'Product Section / Catalog' : 'Our Services / Solutions';
      console.log(`-> Capturing Slide 3: ${sectionLabel}...`);
      await page.evaluate((targetY, selector) => {
        if (selector) {
          const el = document.querySelector(selector);
          if (el) {
            el.scrollIntoView({ behavior: 'instant', block: 'start' });
            return;
          }
        }
        window.scrollTo(0, targetY);
      }, site.productOrServiceScroll, site.productOrServiceSelector);
      await new Promise(r => setTimeout(r, 1400));
      await cleanPopups(page);
      const s3Path = path.join(siteDir, '3.jpg');
      await page.screenshot({ path: s3Path, type: 'jpeg', quality: 90 });
      console.log(`   ✓ Saved ${site.id}/3.jpg (${fs.statSync(s3Path).size} bytes)`);

      // 4. SLIDE 4: Other Page (e.g. Shop, Services, About, Menu)
      console.log(`-> Capturing Slide 4: Other page navigation...`);
      let innerCaptured = false;
      if (site.innerUrls && site.innerUrls.length > 0) {
        for (const innerUrl of site.innerUrls) {
          try {
            console.log(`   Navigating to inner page: ${innerUrl}`);
            const res = await page.goto(innerUrl, { waitUntil: 'networkidle2', timeout: 25000 });
            if (res && res.status() < 400) {
              console.log(`   Waiting 5s after opening inner page link...`);
              await new Promise(r => setTimeout(r, 5000));
              await cleanPopups(page);
              await page.evaluate((y) => window.scrollTo(0, y), site.innerScroll || 200);
              await new Promise(r => setTimeout(r, 1000));
              const s4Path = path.join(siteDir, '4.jpg');
              await page.screenshot({ path: s4Path, type: 'jpeg', quality: 90 });
              console.log(`   ✓ Saved ${site.id}/4.jpg from ${innerUrl} (${fs.statSync(s4Path).size} bytes)`);
              innerCaptured = true;
              break;
            }
          } catch (innerErr) {
            console.log(`   Notice on inner page ${innerUrl}: ${innerErr.message}`);
          }
        }
      }

      // Fallback for slide 4 if inner page couldn't be loaded
      if (!innerCaptured) {
        console.log(`   Inner page unavailable. Fallback: Capturing deep section at 2300px on homepage...`);
        await page.goto(site.url, { waitUntil: 'networkidle2', timeout: 25000 }).catch(() => {});
        await new Promise(r => setTimeout(r, 3000));
        await page.evaluate(() => window.scrollTo(0, 2300));
        await new Promise(r => setTimeout(r, 1200));
        await cleanPopups(page);
        const s4Path = path.join(siteDir, '4.jpg');
        await page.screenshot({ path: s4Path, type: 'jpeg', quality: 90 });
        console.log(`   ✓ Saved ${site.id}/4.jpg fallback (${fs.statSync(s4Path).size} bytes)`);
      }

      // Sync root fallback image
      const rootFallback = path.join(baseImagesDir, `${site.id}.jpg`);
      if (fs.existsSync(s1Path)) {
        fs.copyFileSync(s1Path, rootFallback);
      }

    } catch (err) {
      console.error(`Error processing ${site.id}:`, err.message);
    } finally {
      if (page) await page.close().catch(() => {});
    }
  }

  // CAPTURE KASHI BIKERS WORLD (Custom showcase page)
  console.log(`\n======================================================`);
  console.log(`Capturing 4 distinct views for: Kashi Bikers World (kashi-bikers)`);
  console.log(`======================================================`);
  let kashiPage;
  try {
    kashiPage = await browser.newPage();
    const kashiHtmlPath = `file://${path.resolve(__dirname, 'kashi_bikers_preview.html').replace(/\\/g, '/')}`;
    console.log(`-> Loading local portal template: ${kashiHtmlPath}`);
    await kashiPage.goto(kashiHtmlPath, { waitUntil: 'networkidle0', timeout: 20000 });
    await new Promise(r => setTimeout(r, 2000));

    // Slide 1: Hero
    await kashiPage.evaluate(() => window.scrollTo(0, 0));
    await new Promise(r => setTimeout(r, 600));
    const k1 = path.join(kashiDir, '1.jpg');
    await kashiPage.screenshot({ path: k1, type: 'jpeg', quality: 90 });
    console.log(`   ✓ Saved kashi-bikers/1.jpg (Hero Banner)`);

    // Slide 2: Middle Section (Expeditions)
    await kashiPage.evaluate(() => window.scrollTo(0, 900));
    await new Promise(r => setTimeout(r, 600));
    const k2 = path.join(kashiDir, '2.jpg');
    await kashiPage.screenshot({ path: k2, type: 'jpeg', quality: 90 });
    console.log(`   ✓ Saved kashi-bikers/2.jpg (Curated Expeditions)`);

    // Slide 3: Our Services / Fleet
    await kashiPage.evaluate(() => window.scrollTo(0, 1800));
    await new Promise(r => setTimeout(r, 600));
    const k3 = path.join(kashiDir, '3.jpg');
    await kashiPage.screenshot({ path: k3, type: 'jpeg', quality: 90 });
    console.log(`   ✓ Saved kashi-bikers/3.jpg (Adventure Fleet & Services)`);

    // Slide 4: Other Page / Rider Community Portal
    await kashiPage.evaluate(() => window.scrollTo(0, 2700));
    await new Promise(r => setTimeout(r, 600));
    const k4 = path.join(kashiDir, '4.jpg');
    await kashiPage.screenshot({ path: k4, type: 'jpeg', quality: 90 });
    console.log(`   ✓ Saved kashi-bikers/4.jpg (Rider Community Portal & Live GPS)`);

    // Sync root fallback
    const kashiRoot = path.join(baseImagesDir, 'kashi-bikers.jpg');
    fs.copyFileSync(k1, kashiRoot);

  } catch (kErr) {
    console.error('Error on kashi-bikers capture:', kErr.message);
  } finally {
    if (kashiPage) await kashiPage.close().catch(() => {});
  }

  await browser.close();
  console.log('\n======================================================');
  console.log('All 12 project multi-shot captures completed successfully!');
  console.log('======================================================');
}

run().catch(console.error);
