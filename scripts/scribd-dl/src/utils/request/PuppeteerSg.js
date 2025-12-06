import { chromium } from 'playwright'

class PuppeteerSg {
  constructor() {
    if (!PuppeteerSg.instance) {
      PuppeteerSg.instance = this;
      process.on('exit', () => {
        this.close();
      });
    }
    return PuppeteerSg.instance;
  }

  /**
   * Launch a browser (using Playwright instead of Puppeteer for better ARM64 support)
   */
  async launch() {
    const args = [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-gpu',
      '--disable-software-rasterizer',
      '--single-process' // Better for low-memory ARM devices
    ];

    this.browser = await chromium.launch({
      headless: true,
      args,
      timeout: 90000 // Increase launch timeout to 90s for slow ARM
    });
  }

  /**
   * New a page
   * @param {string} url 
   * @returns 
   */
  async getPage(url) {
    if (!this.browser) {
      await this.launch()
    }
    let page = await this.browser.newPage()

    // Block unnecessary resources to speed up loading on slow ARM
    await page.route('**/*', (route) => {
      const resourceType = route.request().resourceType();
      const url = route.request().url();

      // Block ads, analytics, fonts, and media to speed up loading
      if (resourceType === 'font' || resourceType === 'media') {
        return route.abort();
      } else if (url.includes('google-analytics.com') ||
        url.includes('googletagmanager.com') ||
        url.includes('doubleclick.net') ||
        url.includes('facebook.com') ||
        url.includes('analytics')) {
        return route.abort();
      } else {
        return route.continue();
      }
    });

    await page.goto(url, {
      waitUntil: "domcontentloaded", // Faster than "load", enough for Scribd
      timeout: 90000 // 90s timeout for slow ARM server
    })
    return page
  }

  /**
   * Close the browser
   */
  async close() {
    if (this.browser) {
      await this.browser.close();
      this.browser = null;
    }
  }
}

export const puppeteerSg = new PuppeteerSg()
