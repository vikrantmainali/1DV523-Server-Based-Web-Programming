'use strict'
const axios = require('axios')
const cheerio = require('cheerio')
const request = require('request')

const urlArray = []

/**
 * function to get the urls for the calendar, cinema and restaurant using axiom and cheerio packages
 *
 * @param {string} url link of the url to start from
 */
function getUrl (url) {
  return new Promise(function (resolve, reject) {
    axios(url).then(resp => {
      const data = resp.data
      const $ = cheerio.load(data)
      $('a').each(function (i, e) {
        const text = $(e).text().toLowerCase().trim()
        if (text.includes('calendar') || text.includes('cinema') || text.includes('bar')) {
          urlArray[i] = $(e).attr('href')
        }
      })
      console.log('Scraping links...OK')
      resolve(urlArray)
    }).catch(err =>
      reject(err))
  })
}

/**
 * Function to get all the calendar links
 *
 * @param {string} url link to get calendar links from
 */
function getCalendarLinks (url) {
  const calendarUrlArray = []
  return new Promise(function (resolve, reject) {
    axios(url).then(resp => {
      const data = resp.data
      const $ = cheerio.load(data)
      const list = $('.col.s12.center').find('li a')
      list.each(function (i, e) {
        calendarUrlArray[i] = url + $(e).attr('href')
      })
      resolve(calendarUrlArray)
    }).catch(err => reject(err))
  })
}

/**
 * Function to scrape calendar data
 *
 * @param {Array} calendarUrlArray array of urls to scrape data from
 */
function scrapeCalendar (calendarUrlArray) {
  const calendarData = []
  return new Promise(function (resolve, reject) {
    calendarUrlArray.forEach(function (e) {
      axios(e).then(resp => {
        const data = resp.data
        const $ = cheerio.load(data)
        calendarData.push({
          name: $('body > h2').text().trim(),
          day: $('body > table > thead > tr > th').toArray().map((x) => { return $(x).text() }),
          status: $('body > table > tbody > tr > td').toArray().map((x) => { return $(x).text().toLowerCase() }),
          isFree: $('body > table > tbody > tr > td').toArray().map((x) => { return !$(x).text().includes('-') })
        })
        if (calendarData.length === calendarUrlArray.length) {
          console.log('Scraping calendar...OK')
          resolve(calendarData)
        }
      }).catch(err => reject(err))
    })
  })
}

// eslint-disable-next-line jsdoc/require-returns
/**
 * Function to check availability amongst friends
 *
 * @param {Array} calendarData array of calendar data to check from
 */
function checkAvailability (calendarData) {
  const availableDays = []
  return new Promise((resolve, reject) => {
    if (calendarData[0].isFree[0] & calendarData[1].isFree[0] & calendarData[2].isFree[0]) {
      availableDays.push(calendarData[0].day[0])
    }
    if (calendarData[0].isFree[1] & calendarData[1].isFree[1] & calendarData[2].isFree[1]) {
      availableDays.push(calendarData[0].day[1])
    }
    if (calendarData[0].isFree[2] & calendarData[1].isFree[2] & calendarData[2].isFree[2]) {
      availableDays.push(calendarData[0].day[2])
    }
    if (availableDays.length === 0) {
      reject(new Error('No common day between the friends'))
    } else {
      console.log('Scraping available days...OK')
      resolve(availableDays)
      console.log('Common day(s) between the three: ' + availableDays)
    }
  })
}

/**
 * Function to scrape movies
 *
 * @param {Array} url array of url
 * @param {Array} days array of days
 */
function scrapeCinema (url, days) {
  return new Promise((resolve, reject) => {
    const movies = []
    axios(url)
      .then(resp => {
        const data = resp.data
        const $ = cheerio.load(data)
        // eslint-disable-next-line array-callback-return
        $('#day option').map((i, e) => {
          days.forEach(day => {
            if (day === e.firstChild.data) {
              days.push({ value: e.attribs.value })
            }
          })
        })
        // eslint-disable-next-line array-callback-return
        $('#movie option').map((i, e) => {
          if (e.attribs.value) {
            movies.push({
              name: e.firstChild.data,
              value: e.attribs.value
            })
          }
        })
        console.log('Scraping showtimes...OK')
      })
      .then(() =>
        resolve({
          movies: movies,
          days: days,
          url: url
        }))
      .catch(err => reject(err))
  })
}

/**
 * Fetch details about the movie such as availability, time
 *
 * @param {Array} movies movies array from cinema scrape
 * @param {Array} days days to fetch movie details for
 * @param {string} url url of cinema
 *
 */
function fetchMoviesDetails (movies, days, url) {
  const promises = []
  days.forEach(day =>
    movies.forEach(movie =>
      promises.push(axios.get(url + '/check?day=' + day.value + '&movie=' + movie.value))))
  return new Promise((resolve, reject) => {
    const result = []
    Promise.all(promises)
      .then(responses => {
        responses.forEach((response, index) => {
          response.data.forEach(film => {
            if (film.status === 1) {
              movies.forEach(movie => {
                if (movie.value === film.movie) {
                  result.push({
                    name: movie.name,
                    time: film.time
                  })
                }
              })
            }
          })
        })
      })
      .then(() => resolve(result))
      .catch(err => reject(err))
  })
}

/**
 * Function to login to the dinner reservation
 *
 * @param {string} url url of the dinner reservation
 */
function login (url) {
  let loginUrl = ''
  return new Promise((resolve, reject) => {
    axios(url)
      .then(resp => {
        const data = resp.data
        const $ = cheerio.load(data)('form').attr('action')
        loginUrl = url + $.split('/')[1]
        urlArray.push(loginUrl)
      }).then(() => getCookie(loginUrl)
        .then(res => setCookie(res, url)
          .then(res =>
            resolve([res[0].data, res[1], res[2]]))))
      .catch(err => reject(err))
  })
}

// eslint-disable-next-line jsdoc/require-returns
/**
 * Function to get cookie
 *
 * @param {string} url url of cookie
 */
function getCookie (url) {
  return new Promise(function (resolve, reject) {
    request.post({
      headers: { 'content-type': 'application/x-www-form-urlencoded' },
      url: url,
      form: {
        username: 'zeke',
        password: 'coys',
        submit: 'login'
      }
    }, function (error, response) {
      resolve(response)
      reject(error)
    })
  })
}

/** Function to set cookie
 *
 * @param {string} response response
 * @param {string} responseUrl url of response
 */
function setCookie (response, responseUrl) {
  return new Promise((resolve, reject) => {
    const cookies = response.headers['set-cookie'].toString().split(';')[0]
    const url = responseUrl + '/' + response.headers.location
    axios(url, {
      headers: { cookie: cookies }
    })
      .then(response => resolve([response, cookies, url]))
      .catch(function (error) {
        reject(error)
      })
  })
}

/**
 * First it creates the promises based on given days and movies. Then it sends the promises, once they fulfilled it collects those
 * movies whose booking is open on given days.
 *
 * @param data
 * @param availableMovies
 * @param freeDays
 */
function reserve (data, availableMovies, freeDays) {
  const form = {}
  const dinnerTimes = []
  const $ = cheerio.load(data[0])
  $('input').each((i, e) => {
    const val = $(e).attr('value')
    if ($(e).attr('name') === 'csrf_token') {
      form.csrf_token = val
    }
    if ($(e).attr('name') === 'group1') {
      dinnerTimes.push(val)
      form.group1 = val
    }
  })
  $('input').each((i, e) => {
    console.log('Recommendations')
    console.log('===============')
    freeDays.forEach(day => {
      for (const times of dinnerTimes) {
        if (times.startsWith(day.substring(0, 3).toLowerCase())) {
          const startTime = parseInt(times.substring(3, 5))
          const endTime = parseInt(times.substring(5, 7))
          availableMovies.forEach(movie => {
            const movieStartTime = parseInt(movie.time.split(':')[0])
            const movieEndTime = parseInt(movieStartTime) + 2
            if ((movieEndTime) === startTime) {
              console.log('On ' + day + ' the movie ' + movie.name + ' starts at ' + movie.time + ' and there is a free table between ' + startTime + ':00-' + endTime + ':00')
            }
          })
        }
      }
    })
  })
    .then(res => console.log(cheerio.load(res.body)('.center').text().trim()))
    .catch(err => console.log('Cannot book the reservation', err))
}

/**
 * Function to scrape the urls
 *
 * @param {string} url url to scrape
 */
function scrape (url) {
  getUrl(url)
    .then(urlArray => getCalendarLinks(urlArray[0])
      .then(calendarLinks => scrapeCalendar(calendarLinks)
        .then(calendar => checkAvailability(calendar)
          .then(freeDays => scrapeCinema(urlArray[1], freeDays)
            .then(movies => fetchMoviesDetails(movies.movies, movies.days, movies.url)
              .then(avaiableMovies => login(urlArray[2])
                .then(data => reserve(data, avaiableMovies, freeDays))
                .catch(err => (err))
              )
            )
          )
        )
      )
    )
}

module.exports = {
  scrape: scrape
}
