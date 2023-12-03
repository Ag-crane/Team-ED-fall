import { getAvailableTime, delay } from "./module.js";
import puppeteer from "puppeteer";

process.on("message", async (message) => {
  const { date, chunk } = message;
  const startTime = Date.now();
  const browser = await puppeteer.launch({ headless: true });

  let results = []; // 결과를 저장할 배열

  for (let pair of chunk) {
    try {
      const datetimeValues = await getAvailableTime(
        browser,
        pair.pr_id,
        pair.room_id,
        date
      );
      results.push({
        success: true,
        prId: pair.pr_id,
        roomId: pair.room_id,
        data: datetimeValues,
      });
    } catch (error) {
      results.push({
        success: false,
        prId: pair.pr_id,
        roomId: pair.room_id,
        error: error.message,
      });
    }
    await delay(1000);
  }

  await browser.close();
  const endTime = Date.now();
  const duration = endTime - startTime;

  // 모든 작업이 완료된 후에 결과 전송
  process.send({ results: results, duration: duration });
  process.exit();
});
