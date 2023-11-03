const mysql = require("mysql2/promise");
const puppeteer = require("puppeteer");

require("dotenv").config();
const dbConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
};

async function getStartDate(page) {
  const startDate = await page.$$eval(
    'td[class*="calendar-selected start-day"] span[class="num"]',
    (elements) => elements[0].textContent
  );
  console.log("현재 날짜 : ", startDate);
}

async function getAvailableTime(prId, roomId, date) {
  const browser = await puppeteer.launch();
  var page = await browser.newPage();

  const url = `https://m.booking.naver.com/booking/10/bizes/${prId}/items/${roomId}`;

  await page.goto(url, {
    waitUntil: "networkidle0",
  });

  await page.waitForSelector('a[class="calendar-date"] > span[class="num"]');
  console.log("로드 완료");
  page.on("console", (msg) => console.log(msg.text())); // 디버깅용

  // 현재 날짜 확인
  await getStartDate(page);

  // 타겟 날짜가 달력에 있는지 먼저 확인
  let targetDateElement = await page.$$eval(
    'td:not(.calendar-unselectable) > a[class="calendar-date"] > span[class="num"]',
    (elements, date) => {
      const targetElement = elements.find((el) => el.textContent == date);
      return targetElement ? targetElement.outerHTML : null;
    },
    date
  );

  if (targetDateElement) {
    console.log("Element found");
  } else {
    console.log("Element not found");
    console.log("달력 넘기기");
    await page.evaluate(() => {
      const nextMonthButton = document.querySelector('a[title="다음 달"]');
      nextMonthButton.click();
    });
    await page.waitForSelector(
      'td:not(.calendar-unselectable) > a[class="calendar-date"] > span[class="num"]'
    );
    console.log("달력 넘기기 성공");
  }

  // 타겟 날짜 재설정
  targetDateElement = await page.$$eval(
    'td:not(.calendar-unselectable) > a[class="calendar-date"] > span[class="num"]',
    (elements, date) => {
      const targetElement = elements.find((el) => el.textContent == date);
      return targetElement ? targetElement.outerHTML : null;
    },
    date
  );

  console.log(targetDateElement);
  await page.$$eval(
    'td:not(.calendar-unselectable) > a[class="calendar-date"] > span[class="num"]',
    (elements, date) => {
      const targetElement = elements.find((el) => el.textContent == date);
      targetElement.click();
    },
    date
  );
  await page.waitForTimeout(100)
  // 선택 후 현재 날짜 확인
  await getStartDate(page);

  // 예약가능시간 가져오기
  const availableTimes = await page.$$eval(
    'ul[class="lst_time_cont data_"] > li[class="item"] > span[class="time_txt"] > span[ng-bind]',
    (elements) => elements.map((el) => el.textContent)
  );

  await browser.close();

  return availableTimes;
}
  const connection = await mysql.createConnection(dbConfig);

  await connection.execute(`
  CREATE TABLE IF NOT EXISTS reservation_datas(
    room_id INT NOT NULL,
    available_time DATETIME NOT NULL,
    PRIMARY KEY (room_id, available_time)
  )`);
