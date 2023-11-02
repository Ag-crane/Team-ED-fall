const puppeteer = require('puppeteer')

async function getStartDate(page) {
  const startDate = await page.$$eval(
    'td[class*="calendar-selected start-day"] span[class="num"]',
    (elements) => elements[0].textContent
  );
  console.log("현재 날짜 : ", startDate);
}

  const browser = await puppeteer.launch()
  var page = await browser.newPage()

  const url = `https://m.booking.naver.com/booking/10/bizes/${id}/items/${roomId}`

  await page.goto(url, {
    waitUntil: 'networkidle0'
  })

  // 현재 날짜 확인
  await getStartDate(page);
  // 선택 후 현재 날짜 확인
  await getStartDate(page);
