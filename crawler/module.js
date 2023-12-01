import mysql from "mysql2/promise";
import puppeteer from "puppeteer";
import path from "path";
import dotenv from "dotenv";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, ".env") });

const dbConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
};

// 크롤링 함수들
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
    waitUntil: "networkidle2",
    timeout: 10000,
  });
  await page.waitForSelector("td:not(.calendar-unselectable)");

  await setCalendar(page, date);

  await page.$eval(
    `td:not(.calendar-unselectable)[data-cal-datetext="${date}"] > a`,
    (element) => element.click()
  );
  await page.waitForTimeout(100);

  const selectedDate = await page.$eval(
    'td[class*="calendar-selected"][class*="start-day"]',
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

async function attemptCrawling(browser, connection, prId, roomId, date) {
  let attempt = 1;
  while (attempt <= 3) {
    try {
      const availableTimes = await getAvailableTime(
        browser,
        prId,
        roomId,
        date
      );
      const queries = availableTimes.map((time) =>
        connection.execute(
          `INSERT INTO reservation_datas (room_id, available_time) VALUES (?, ?) ON DUPLICATE KEY UPDATE available_time = ?`,
          [roomId, time, time]
        )
      );
      await Promise.all(queries);
      return true; // 성공
    } catch (error) {
      console.error(
        `Attempt ${attempt} failed for room: ${roomId}, Date: ${date}`
      );
      attempt++;
      await delay(30000); // 대기 후 재시도
    }
  }
  return false; // 실패
}

async function retryFailedTask(browser, connection, task, maxAttempts) {
  let attempt = 0;
  while (attempt < maxAttempts) {
    let success = await attemptCrawling(
      browser,
      connection,
      task.prId,
      task.roomId,
      task.date
    );
    if (success) {
      console.log(
        `Retry successful for prId: ${task.prId}, roomId: ${task.roomId}, Date: ${task.date}`
      );
      return;
    }
    attempt++;
    await delay(5000); // 재시도 사이의 대기 시간
  }
  console.error(
    `All retries failed for prId: ${task.prId}, roomId: ${task.roomId}, Date: ${task.date}`
  );
}

async function getWeeklyData(prId, roomId) {
  let browser = await puppeteer.launch({ headless: true });
  const connection = await mysql.createConnection(dbConfig);

  const dates = getNextDays(7);
  let failedTasks = [];
  let count = 1;

  for (const date of dates) {
    let success = await attemptCrawling(
      browser,
      connection,
      prId,
      roomId,
      date
    );

    if (!success) {
      failedTasks.push({ prId, roomId, date });
      console.error(
        `Crawling failed for task number ${count}: prId: ${prId}, roomId: ${roomId}, Date: ${date}`
      );
    } else {
      console.log(
        `Crawling successful for task number ${count}: prId: ${prId}, roomId: ${roomId}, Date: ${date}`
      );
    }
    delay(3000)
    count++;
  }

  // 크롤링이 완료된 후 실패한 작업 재시도
  console.log("failedTasks: ", failedTasks);
  for (const task of failedTasks) {
    await retryFailedTask(browser, connection, task, 3); // 여기서 3은 최대 재시도 횟수
  }

  await connection.end();
  await browser.close();
}

async function getStartDate(page) {
  const startDate = await page.$eval(
    'td[class*="calendar-selected start-day"]',
    (element) => element.getAttribute("data-cal-datetext")
  );
  console.log("현재 날짜 : ", startDate);
}

async function setCalendar(page, date) {
  let targetDateElement = null;
  while (!targetDateElement) {
    targetDateElement = await page.$(
      `td:not(.calendar-unselectable)[data-cal-datetext="${date}"]`
    );
    if (!targetDateElement) {
      await page.waitForSelector('a[title="다음 달"]');
      await page.evaluate(() => {
        const nextMonthButton = document.querySelector('a[title="다음 달"]');
        nextMonthButton.click();
      });
      await page.waitForSelector("td:not(.calendar-unselectable)");
    }
  }
}



function formatDate(date) {
  let day = date.getDate();
  let month = date.getMonth() + 1;
  let year = date.getFullYear();

  // 월과 일이 10보다 작으면 앞에 0 붙이기
  day = day < 10 ? "0" + day : day;
  month = month < 10 ? "0" + month : month;

  return `${year}-${month}-${day}`;
}

function getNextDays(days = 30) {
  let dates = [];
  // let currentDate = new Date();
  // currentDate.setDate(currentDate.getDate() + 1);
  let currentDate = new Date(2023, 11, 1);



  for (let i = 0; i < days; i++) {
    dates.push(formatDate(currentDate));
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return dates;
}

function delay(time) {
  return new Promise(function (resolve) {
    setTimeout(resolve, time);
  });
}

async function getRoomId() {
  const connection = await mysql.createConnection(dbConfig);
  const [rows] = await connection.execute(
    "SELECT pr_id, room_id FROM room_datas"
  );
  return rows;
}

function splitArrayIntoChunks(array, numberOfChunks) {
  let result = [];
  let chunkSize = Math.ceil(array.length / numberOfChunks);

  for (let i = 0; i < array.length; i += chunkSize) {
    let chunk = array.slice(i, i + chunkSize);
    result.push(chunk);
  }

  return result;
}

export {
  getAvailableTime,
  getWeeklyData,
  getRoomId,
  delay,
  splitArrayIntoChunks,
};
export default dbConfig;
