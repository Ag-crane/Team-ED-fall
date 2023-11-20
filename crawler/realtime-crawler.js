import { getAvailableTime } from "./module.js";
import puppeteer from "puppeteer";


process.on('message', async (message) => {
    const { date, chunk } = message;
    const startTime = Date.now();
    const browser = await puppeteer.launch({ headless: true });

    for (let pair of chunk) {
        try {
            const datetimeValues = await getAvailableTime(browser, pair.pr_id, pair.room_id, date);
            process.send({ success: true, prId: pair.pr_id, roomId: pair.room_id, data: datetimeValues });
        } catch (error) {
            process.send({ success: false, prId: pair.pr_id, roomId: pair.room_id, error: error.message });
        }
    }
    
    await browser.close();
    const endTime = Date.now();
    const duration = endTime - startTime;
    process.send({ duration: duration });
    process.exit();
});
