const jsdom = require('jsdom')
const { JSDOM } = jsdom

async function fetchContributions (username, year) {
  try {
    const url = `https://github.com/users/${username}/contributions?from=${year}-11-30&to=${year}-12-30`
    const response = await fetch(url)
    const text = await response.text()
    const dom = new JSDOM(text)
    const days = dom.window.document.querySelectorAll('.ContributionCalendar-day')
    const contributions = {}

    days.forEach(day => {
      const date = day.getAttribute('data-date')
      const count = parseInt(day.textContent.split(' ')[0])
      contributions[date] = isNaN(count) ? 0 : count
    })
    dom.window.close()
    return contributions
  } catch (error) {
    console.warn('Youe current contributions can not be retrieve')
    console.error(error)
    return {}
  }
}

module.exports = fetchContributions
