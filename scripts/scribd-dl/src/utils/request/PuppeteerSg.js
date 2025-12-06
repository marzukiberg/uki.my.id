import puppeteer from 'puppeteer'

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
   * Launch a browser
   */
  async launch() {
    const isCI = process.env.CI === 'true'; // Detect if running in CI
    const args = ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage'];

    const launchOptions = {
      headless: "new",
      defaultViewport: null,
      args
    };

    // Try to use snap-installed Chromium if available
    const chromiumPaths = [
      '/snap/bin/chromium',
      '/usr/bin/chromium-browser',
      '/usr/bin/chromium',
    ];

    for (const path of chromiumPaths) {
      try {
        const fs = await import('fs');
        if (fs.existsSync(path)) {
          launchOptions.executablePath = path;
          break;
        }
      } catch (e) {
        // Continue to next path
      }
    }

    this.browser = await puppeteer.launch(launchOptions);
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
    await page.goto(url, {
      waitUntil: "load",
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
