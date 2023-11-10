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

async function getAvailableTime(browser, prId, roomId, date) {
  const page = await browser.newPage();

  // 리소스 로드 제어 - 이미지, 스타일시트, 폰트 등은 로드하지 않음
  await page.setRequestInterception(true);
  page.on("request", (req) => {
    if (["image", "stylesheet", "font"].includes(req.resourceType())) {
      req.abort();
    } else {
      req.continue();
    }
  });
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

  await page.close();

  return datetimeValues;
}


// 날짜 형식맞추기
function formatDate(date) {
  let day = date.getDate();
  let month = date.getMonth() + 1;
  let year = date.getFullYear();

  // 월과 일이 10보다 작으면 앞에 0 붙이기
  day = day < 10 ? "0" + day : day;
  month = month < 10 ? "0" + month : month;

  return `${year}-${month}-${day}`;
}

// 내일 날짜부터 30일 간의 날짜를 반환
function getNextDays(days = 30) {
  let dates = [];
  let currentDate = new Date();

  // 날짜를 1일 더해 내일 날짜를 설정
  currentDate.setDate(currentDate.getDate() + 1);

  for (let i = 0; i < days; i++) {
    dates.push(formatDate(currentDate)); // 배열에 날짜를 포맷하여 추가
    currentDate.setDate(currentDate.getDate() + 1); // 다음 날짜를 위해 현재 날짜를 1일 증가
  }

  return dates;
}

function delay(time) {
  return new Promise(function (resolve) {
    setTimeout(resolve, time);
  });
}

async function getDataAndInsert() {
  const browser = await puppeteer.launch();

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
    const reverseRows = rows.reverse();
    let count = 1;
    for (const row of reverseRows) {
      for (let date = 1; date <= 30; date++) {
        // 재시도 및 딜레이 로직 추가
        let attempt = 1;
        while (attempt < 5) {
          try {
            const availableTimes = await getAvailableTime(
              browser,
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
            console.log(count, "room : ", row.room_id, "날짜 : ", date);
            break; // 성공할 경우 while문 탈출
          } catch (error) {
            console.log(
              "Attempt",
              attempt,
              "failed for room:",
              row.room_id,
              "Date:",
              date
            );
            attempt++;
            await delay(30000); // 대기 후 재시도
          }
        }
        await delay(3000); // 다음 요청 전에 대기
      }
      count++;
    }
  } catch (err) {
    console.error("Error:", err);
  } finally {
    await connection.end();
    await browser.close();
  }
}

async function main() {
  // 실행 시간 측정
  const start = new Date();
  const browser = await puppeteer.launch();
  const result = await getAvailableTime(browser, 329314, 3355287, "2023-12-12");
  console.log(result);
  await browser.close();
  // await getDataAndInsert();
  const end = new Date();
  console.log("소요 시간 : ", end - start);
}
main();

