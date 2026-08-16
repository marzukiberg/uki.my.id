import cliProgress from "cli-progress"
import { puppeteerSg } from "../utils/request/PuppeteerSg.js";
import { pdfGenerator } from "../utils/io/PdfGenerator.js";
import { configLoader } from "../utils/io/ConfigLoader.js";
import { directoryIo } from "../utils/io/DirectoryIo.js"
import * as scribdRegex from "../const/ScribdRegex.js"
import * as scribdFlag from '../const/ScribdFlag.js'
import { Image } from "../object/Image.js"
import sharp from "sharp";
import path from 'path'
import sanitize from "sanitize-filename";


const output = configLoader.load("DIRECTORY", "output")
const filename = configLoader.load("DIRECTORY", "filename")
const rendertime = parseInt(configLoader.load("SCRIBD", "rendertime"))

class ScribdDownloader {
    constructor() {
        if (!ScribdDownloader.instance) {
            ScribdDownloader.instance = this
        }
        return ScribdDownloader.instance
    }

    async execute(url, flag, outputPath) {
        let fn;
        if (flag === scribdFlag.IMAGE) {
            console.log(`Mode: IMAGE`)
            fn = this.embeds_image
        } else if (flag === scribdFlag.DOCX) {
            console.log(`Mode: DOCX`)
            fn = this.embeds_docx
        } else {
            console.log(`Mode: DEFAULT`)
            fn = this.embeds_default
        }
        if (url.match(scribdRegex.DOCUMENT)) {
            await fn.call(this, `https://www.scribd.com/embeds/${scribdRegex.DOCUMENT.exec(url)[2]}/content`, outputPath)
        } else if (url.match(scribdRegex.EMBED)) {
            await fn.call(this, url, outputPath)
        } else {
            throw new Error(`Unsupported URL: ${url}`)
        }
    }

    async embeds_default(url, outputPath) {
        const m = scribdRegex.EMBED.exec(url)
        if (m) {
            let id = m[1]

            // navigate to scribd
            let page = await puppeteerSg.getPage(url)

            // Set higher viewport for better quality
            await page.setViewport({
                width: 1920,
                height: 1080,
                deviceScaleFactor: 2  // Higher pixel density for better image quality
            })

            // wait rendering
            await new Promise(resolve => setTimeout(resolve, 1000))

            // get the title
            let div = await page.$("div.mobile_overlay a")
            let title = decodeURIComponent(await div.evaluate((el) => el.href.split('/').pop().trim()))

            // remove cookies banners (including legacy 'div.customOptInDialog' for compatibility)
            const cookieSelectors = ["div.customOptInDialog", "div[aria-label='Cookie Consent Banner']"];
            for (const selector of cookieSelectors) {
                const elements = await page.$$(selector);
                for (const el of elements) {
                    await el.evaluate(node => node.remove());
                }
            }

            // load all pages
            await page.click('div.document_scroller');
            const container = await page.$('div.document_scroller');
            let height = await container.evaluate(el => el.scrollHeight);
            const clientHeight = await container.evaluate(el => el.clientHeight);
            let cur = await container.evaluate(el => el.scrollTop);
            const bar = new cliProgress.SingleBar({}, cliProgress.Presets.shades_classic);
            bar.start(height, 0);

            let stuckCount = 0;
            let lastCur = cur;
            const maxStuckAttempts = 5;

            while (cur + clientHeight < height) {
                await page.keyboard.press('PageDown');
                await new Promise(resolve => setTimeout(resolve, rendertime))

                const newCur = await container.evaluate(el => el.scrollTop);
                const newHeight = await container.evaluate(el => el.scrollHeight);

                // Detect if scroll position is stuck
                if (newCur === lastCur) {
                    stuckCount++;
                    if (stuckCount >= maxStuckAttempts) {
                        console.log(`\nScroll stuck at ${newCur}, breaking out...`);
                        break;
                    }
                } else {
                    stuckCount = 0;
                }

                lastCur = newCur;
                cur = newCur;
                height = newHeight;
                bar.update(cur + clientHeight);
            }
            bar.stop();

            // Wait for all images to load completely
            await page.evaluate(() => {
                return Promise.all(
                    Array.from(document.images)
                        .filter(img => !img.complete)
                        .map(img => new Promise(resolve => {
                            img.onload = img.onerror = resolve;
                        }))
                );
            });

            console.log('All images loaded, processing...');

            // remove margin and page breaks to avoid extra blank pages
            let doc_pages = await page.$$("div.outer_page_container div[id^='outer_page_']")
            for (let i = 0; i < doc_pages.length; i++) {
                await page.evaluate((i) => { // eslint-disable-next-line
                    const el = document.getElementById(`outer_page_${(i + 1)}`);
                    el.style.margin = 0;
                    el.style.padding = 0;
                    el.style.pageBreakAfter = 'avoid';
                    el.style.pageBreakBefore = 'avoid';
                    el.style.pageBreakInside = 'avoid';
                    el.style.breakAfter = 'avoid';
                    el.style.breakBefore = 'avoid';
                    el.style.breakInside = 'avoid';
                }, i)
            }

            // Add global CSS to prevent page breaks
            await page.addStyleTag({
                content: `
                    @page { margin: 0; }
                    * { 
                        page-break-after: avoid !important;
                        page-break-before: avoid !important;
                        page-break-inside: avoid !important;
                        break-after: avoid !important;
                        break-before: avoid !important;
                        break-inside: avoid !important;
                    }
                `
            });

            // Force white backgrounds and remove gray styling/shadows
            await page.addStyleTag({
                content: `
                    html, body { background: #ffffff !important; }
                    .outer_page_container { background: #ffffff !important; }
                    [id^='outer_page_'] { 
                        background: #ffffff !important; 
                        box-shadow: none !important; 
                        filter: none !important;
                    }
                    .page { background: #ffffff !important; }
                `
            });

            // pdf setting
            let options = {
                path: `${outputPath || output}/${sanitize(filename == "title" ? title : id)}.pdf`,
                printBackground: true,
                timeout: 0,
                preferCSSPageSize: true,  // Use CSS page size instead of fixed dimensions
                // Higher scale for better quality
                scale: 1.5
            }

            // Get page dimensions but apply as CSS instead of PDF page size
            let first_page = await page.$("div.outer_page_container div[id^='outer_page_']")
            let style = await first_page.evaluate((el) => el.getAttribute("style"))
            if (style.includes("width:") && style.includes("height:")) {
                const pageHeight = parseInt(style.split("height:")[1].split("px")[0].trim())
                const pageWidth = parseInt(style.split("width:")[1].split("px")[0].trim())

                // Apply dimensions via CSS @page rule instead of PDF options
                await page.addStyleTag({
                    content: `
                        @page {
                            size: ${pageWidth}px ${pageHeight}px;
                            margin: 0;
                        }
                    `
                });
            }

            // show doc only
            await page.evaluate(() => { // eslint-disable-next-line
                document.body.innerHTML = document.querySelector("div.outer_page_container").innerHTML
            })

            // Ensure background stays white after DOM replacement
            await page.addStyleTag({
                content: `
                    html, body { background: #ffffff !important; }
                    div[id^='outer_page_'] { background: #ffffff !important; box-shadow: none !important; }
                `
            });

            await directoryIo.create(path.dirname(options.path))
            await page.pdf(options);
            console.log(`Generated: ${options.path}`)

            await page.close()
            await puppeteerSg.close()
        } else {
            throw new Error(`Unsupported URL: ${url}`)
        }
    }

    async embeds_image(url, outputPath) {
        let deviceScaleFactor = 2
        const m = scribdRegex.EMBED.exec(url)
        if (m) {
            let id = m[1]

            // prepare temp dir
            let dir = `${output}/${id}`
            await directoryIo.create(dir)

            // navigate to scribd
            let page = await puppeteerSg.getPage(url)

            // wait rendering
            await new Promise(resolve => setTimeout(resolve, 1000))

            // get the title
            let div = await page.$("div.mobile_overlay a")
            let title = decodeURIComponent(await div.evaluate((el) => el.href.split('/').pop().trim()))

            // hide blockers
            let doc_container = await page.$("div.document_scroller")
            await doc_container.evaluate((el) => {
                el["style"]["bottom"] = "0px"
                el["style"]["margin-top"] = "0px"
            });
            let doc_toolbar = await page.$("div.toolbar_drop")
            await doc_toolbar.evaluate((el) => el["style"]["display"] = "none");

            // download images
            let doc_pages = await page.$$("div.outer_page_container div[id^='outer_page_']")
            let images = []
            const bar = new cliProgress.SingleBar({}, cliProgress.Presets.shades_classic);
            bar.start(doc_pages.length, 0);
            for (let i = 0; i < doc_pages.length; i++) {
                await page.evaluate((i) => { // eslint-disable-next-line
                    document.getElementById(`outer_page_${(i + 1)}`).scrollIntoView()
                }, i)

                let width = 1191
                let height = 1684
                let style = await doc_pages[i].evaluate((el) => el.getAttribute("style"));
                if (style.includes("width:") && style.includes("height:")) {
                    height = Math.ceil(width * parseInt(style.split("height:")[1].split("px")[0].trim()) / parseInt(style.split("width:")[1].split("px")[0].trim()))
                }
                await page.setViewport({ width: width, height: height, deviceScaleFactor: deviceScaleFactor });

                let path = `${dir}/${(i + 1).toString().padStart(4, 0)}.png`
                await doc_pages[i].screenshot({ path: path });

                let metadata = await sharp(path).metadata()
                images.push(new Image(
                    path,
                    metadata.width,
                    metadata.height
                ))
                bar.update(i + 1);
            }
            bar.stop();

            // generate pdf
            let pdfPath = `${outputPath || output}/${sanitize(filename == "title" ? title : id)}.pdf`
            await directoryIo.create(path.dirname(pdfPath))
            await pdfGenerator.generate(images, pdfPath)

            // remove temp dir
            directoryIo.remove(`${dir}`)

            await page.close()
            await puppeteerSg.close()
        } else {
            throw new Error(`Unsupported URL: ${url}`)
        }
    }

    async embeds_docx(url, outputPath) {
        const m = scribdRegex.EMBED.exec(url)
        if (m) {
            let id = m[1]

            // navigate to scribd
            let page = await puppeteerSg.getPage(url)

            // wait rendering
            await new Promise(resolve => setTimeout(resolve, 1000))

            // get the title
            let div = await page.$("div.mobile_overlay a")
            let title = decodeURIComponent(await div.evaluate((el) => el.href.split('/').pop().trim()))

            // remove cookie banners
            const cookieSelectors = ["div.customOptInDialog", "div[aria-label='Cookie Consent Banner']"];
            for (const selector of cookieSelectors) {
                const elements = await page.$$(selector);
                for (const el of elements) {
                    await el.evaluate(node => node.remove());
                }
            }

            // load all pages
            await page.click('div.document_scroller');
            const container = await page.$('div.document_scroller');
            let height = await container.evaluate(el => el.scrollHeight);
            const clientHeight = await container.evaluate(el => el.clientHeight);
            let cur = await container.evaluate(el => el.scrollTop);
            const bar = new cliProgress.SingleBar({}, cliProgress.Presets.shades_classic);
            bar.start(height, 0);

            let stuckCount = 0;
            let lastCur = cur;
            const maxStuckAttempts = 5;

            while (cur + clientHeight < height) {
                await page.keyboard.press('PageDown');
                await new Promise(resolve => setTimeout(resolve, rendertime))

                const newCur = await container.evaluate(el => el.scrollTop);
                const newHeight = await container.evaluate(el => el.scrollHeight);

                if (newCur === lastCur) {
                    stuckCount++;
                    if (stuckCount >= maxStuckAttempts) {
                        console.log(`\nScroll stuck at ${newCur}, breaking out...`);
                        break;
                    }
                } else {
                    stuckCount = 0;
                }

                lastCur = newCur;
                cur = newCur;
                height = newHeight;
                bar.update(cur + clientHeight);
            }
            bar.stop();

            console.log('Extracting text content...');

            // Extract text from all pages
            const textContent = await page.evaluate(() => {
                const pages = document.querySelectorAll("div.outer_page_container div[id^='outer_page_']");
                let allText = [];

                pages.forEach((page, index) => {
                    const textElements = page.querySelectorAll('.text_layer > div, .text_layer > span, p, div');
                    let pageText = [];

                    textElements.forEach(el => {
                        const text = el.textContent.trim();
                        if (text && !pageText.includes(text)) {
                            pageText.push(text);
                        }
                    });

                    if (pageText.length > 0) {
                        allText.push(`\n--- Page ${index + 1} ---\n`);
                        allText.push(pageText.join('\n'));
                    }
                });

                return allText.join('\n');
            });

            // Save as text file (can be converted to DOCX later)
            const fs = await import('fs');
            const txtPath = `${outputPath || output}/${sanitize(filename == "title" ? title : id)}.txt`;
            await directoryIo.create(path.dirname(txtPath))
            await fs.promises.writeFile(txtPath, textContent, 'utf-8');
            console.log(`Generated text file: ${txtPath}`);
            console.log('Note: Text file generated. Convert to DOCX using Microsoft Word or online converters.');

            await page.close()
            await puppeteerSg.close()
        } else {
            throw new Error(`Unsupported URL: ${url}`)
        }
    }
}

export const scribdDownloader = new ScribdDownloader()
