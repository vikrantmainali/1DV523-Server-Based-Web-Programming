const scraper = require('./lib/scraper')

const url = process.argv[2]

scraper.scrape(url)
