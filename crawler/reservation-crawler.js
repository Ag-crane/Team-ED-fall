const puppeteer = require('puppeteer')

async function getReservedTime (id, roomId, date) {

  async function getStartDate () {
    const startDate = await page.$$eval(
      'td[class*="calendar-selected start-day"] span[class="num"]',
      elements => elements[0].textContent
    )
    return startDate
  }

  const browser = await puppeteer.launch()
  var page = await browser.newPage()

  const url = `https://m.booking.naver.com/booking/10/bizes/${id}/items/${roomId}`

  await page.goto(url, {
    waitUntil: 'networkidle0'
  })

  // await page.waitForSelector('a[class="time_box"]')
  await page.waitForSelector('a[class="calendar-date"] > span[class="num"]')
  console.log('로드 완료')

  //선택날짜 확인
  console.log('선택 전')
  await getStartDate().then(console.log)

  // 날짜 선택
  await page.$$eval(
    'a[class="calendar-date"] > span[class="num"]',
    (elements, date) => {
      const targetDateIndex = elements
        .map(el => el.textContent)
        .findIndex(el => el == date)
      elements[targetDateIndex].click()
    },
    date
  )

  //선택날짜 확인
  console.log('선택 후')
  await getStartDate().then(console.log)
  
  const check = await page.$$eval(
    'div[class="out_tit"]',
    elements => {
      return elements[0].textContent
    }
  )
  console.log(check)

  // ------------------여기까지는 이상 x------------------

  // await page.waitForFunction(
  //   date => {
  //     return (
  //       document.querySelector(
  //         'div[class="out_tit"]'
  //       ).textContent
  //     )
  //   },
  //   {},
  //   date
  // )
  // console.log('날짜 클릭 완료')

  const content = await page.$$eval('li[class="item none"] span[ng-bind]', elements =>
    elements.map(el => el.textContent)
  )
  console.log(content)

  await browser.close()
}

getReservedTime(329314, 3355287, 25)