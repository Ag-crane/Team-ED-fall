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
  console.log('현재 날짜 :')
  await getStartDate().then(console.log)

  
  await page.evaluate(date => {
    // MutationObserver 이용해서 날짜선택 후에 변경사항 반영될 때까지 기다리기
    return new Promise(async resolve => {
      // 변화를 감지할 DOM 요소
      const target = document.querySelector('div[class="time_controler_inner"] > ul');
      if (!target) {
        console.error('Element not found');
        resolve();
        return;
      }

      // 변화를 감지하는 MutationObserver
      const observer = new MutationObserver(() => {
        resolve(); // 변화가 감지되면 프로미스 해결하고
        observer.disconnect(); // 연결해제
      });
      // observer 변화감지 시작
      observer.observe(target, { childList: true, subtree: true, attributes: true, characterData: true});
      
      // 날짜 클릭
      const elements = Array.from(document.querySelectorAll('a[class="calendar-date"] > span[class="num"]'));
      const targetDateElement = elements.find(el => el.textContent == date);
      if (targetDateElement) {
        targetDateElement.click();
      } else {
        console.error('Date element not found');
        resolve();
      }
    });
  }, date);

  // 선택날짜 확인
  console.log('선택한 날짜 :')
  await getStartDate().then(console.log)

  const content = await page.$$eval('li[class="item none"] span[ng-bind]', elements =>
    elements.map(el => el.textContent)
  )
  console.log(content)

  await browser.close()
}

getReservedTime(329314, 3355287, 30)