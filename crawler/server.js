import express from "express";
import { realtimeCrawler } from "./realtime-crawler-parent.js";
import "dotenv/config";

const port = process.env.Crawling_Server_Port;
const ip = process.env.Crawling_Server_IP;
const url = `${ip}:${port}`;

const app = express();
app.use(express.json());

app.get(`/`, (req, res) => {
  res.send(`crawler server is running on ${port}`);
});

app.post(`/run-realtime-crawler`, async (req, res) => {
  const { region, date } = req.body;
  try {
    const results = await realtimeCrawler(region, date);
    res.status(200).json(results);
  } catch (error) {
    res.status(500).json({ message: "Error occurred", error: error.message });
  }
});

app.listen(port, () => {
  console.log(`Express server listening at http://${url}`);
});
