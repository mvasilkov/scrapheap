'use strict'

const puppeteer = require('puppeteer')

async function run(url) {
    console.log('Loading', url)

    const browser = await puppeteer.launch()
    const page = await browser.newPage()
    await page.goto(url, { waitUntil: 'networkidle2' })

    console.log('Loaded')

    const { cookies } = await page._client.send('Network.getAllCookies')

    await browser.close()

    console.log(cookies)
}

if (require.main === module) {
    if (process.argv.length != 3)
        console.log('Usage: get-cookies URL')
    else run(process.argv[2])
}
