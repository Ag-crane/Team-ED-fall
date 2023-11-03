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
    timeout: 60000,
  });

  await page.waitForSelector('a[class="calendar-date"] > span[class="num"]');

  // 디버깅용 - puppeteer 브라우저 안에서 console.log 실행
  page.on("console", (msg) => console.log(msg.text()));

  // // 현재 날짜 확인
  // await getStartDate(page);

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
    // console.log("Element found");
  } else {
    // console.log("Element not found");
    // console.log("달력 넘기기");
    await page.evaluate(() => {
      const nextMonthButton = document.querySelector('a[title="다음 달"]');
      nextMonthButton.click();
    });
    await page.waitForSelector(
      'td:not(.calendar-unselectable) > a[class="calendar-date"] > span[class="num"]'
    );
    // console.log("달력 넘기기 성공");
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

  // console.log(targetDateElement);
  await page.$$eval(
    'td:not(.calendar-unselectable) > a[class="calendar-date"] > span[class="num"]',
    (elements, date) => {
      const targetElement = elements.find((el) => el.textContent == date);
      targetElement.click();
    },
    date
  );
  await page.waitForTimeout(100);
  // // 선택 후 현재 날짜 확인
  // await getStartDate(page);

  // 선택한 날짜 저장
  const selectedDate = await page.$eval(
    'td[class*="calendar-selected"][class*="start-day"][data-cal-datetext]',
    (element) => element.getAttribute("data-cal-datetext")
  );

  // 예약가능시간 가져오기
  const availableTimes = await page.$$eval(
    'ul[class="lst_time_cont data_"] > li[class="item"] > span[class="time_txt"] > span[ng-bind]',
    (elements) => elements.map((el) => el.textContent)
  );

  // 선택한 날짜와 예약가능시간을 결합하여 datetime 변수 생성
  const datetimeValues = availableTimes.map(
    (time) => `${selectedDate} ${time}`
  );

  await browser.close();

  return datetimeValues;
}

// async function main() {
//   const result = await getAvailableTime(329314, 3355287, 5);
//   console.log(result);
// }
// main();

async function getDataAndInsert() {
  const connection = await mysql.createConnection(dbConfig);

  await connection.execute(`
  CREATE TABLE IF NOT EXISTS reservation_datas(
    room_id INT NOT NULL,
    available_time DATETIME NOT NULL,
    PRIMARY KEY (room_id, available_time)
  )`);

  try {
    const [rows] = await connection.execute(
      "SELECT pr_id, room_id FROM room_datas"
    );
    for (const row of rows) {
      //룸별
      for (let date = 1; date <= 30; date++) {
        //날짜별  // 임시로 1~30만 처리
        const availableTimes = await getAvailableTime(
          row.pr_id,
          row.room_id,
          date
        );

        for (const time of availableTimes) {
          await connection.execute(
            `INSERT INTO reservation_datas (room_id, available_time) VALUES (?, ?) ON DUPLICATE KEY UPDATE available_time = ?`,
            [row.room_id, time, time]
          );
        }
        console.log("room : ", row.room_id, "날짜 : ", date);
      }
    }
  } catch (err) {
    console.error("Error:", err);
  } finally {
    await connection.end();
  }
}

getDataAndInsert();
