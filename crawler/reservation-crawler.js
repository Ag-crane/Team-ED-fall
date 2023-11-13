import { getAvailableTime, getDataAndInsert, getMonthlyData } from "./module.js";





async function main() {
  // 실행 시간 측정
  const start = new Date();
  // const browser = await puppeteer.launch();
  // const result = await getAvailableTime(browser, 329314, 3355287, "2023-12-12");
  // console.log(result);
  // await browser.close();
  // await getDataAndInsert("2023-11-15");
  await getMonthlyData(331813,3361583);
  const end = new Date();
  console.log("소요 시간 : ", end - start);
}
main();
