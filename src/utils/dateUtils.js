const getFirstSundayOfYear = (year) => {
  const firstDay = new Date(year, 0, 1)
  const dayOfWeek = firstDay.getDay()
  const daysToAdd = dayOfWeek === 0 ? 0 : (7 - dayOfWeek)
  return new Date(year, 0, 1 + daysToAdd, 12, 0, 0)
}

const firstSundayDaysAgo = (daysAgo) => {
  const today = new Date()
  const pastDate = new Date(today)
  pastDate.setDate(pastDate.getDate() - daysAgo)

  while (pastDate.getDay() !== 0) {
    pastDate.setDate(pastDate.getDate() - 1)
  }
  pastDate.setHours(1, 0, 0, 0)
  return pastDate
}

const formatDate = (date) => {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')

  return `${year}-${month}-${day}`
}

module.exports = {
  getFirstSundayOfYear,
  formatDate,
  firstSundayDaysAgo
}
