import { splitArrayIntoChunks, getRoomId } from "./module.js";
import { fork } from "child_process";
import { writeFile } from 'fs/promises';
import dbConfig from "./module.js";
import mysql from "mysql2/promise"
import axios from "axios";

async function sendResultsToServer(data) {
    try {
        const response = await axios.post('http://yourserver.com/api/results', data);
        console.log(`Results sent to server: ${response.statusText}`);
    } catch (err) {
        console.error('Error sending results to server:', err);
    }
}

async function saveResultsToFile(data, filename) {
    const jsonData = JSON.stringify(data, null, 4);
    await writeFile(filename, jsonData, 'utf8');
    console.log(`Results saved to ${filename}`);
}

async function getRoomIdByCommonAddress(commonAddress) {
	const connection = await mysql.createConnection(dbConfig);
	const query = `
	  SELECT rd.pr_id, rd.room_id 
	  FROM room_datas rd
	  JOIN pr_hasbooking phb ON rd.pr_id = phb.bookingBusinessId
	  WHERE phb.commonAddress LIKE ?;
	`;
	const [rows] = await connection.execute(query, [`%${commonAddress}%`]);
	await connection.end();
	return rows;
  }

const address = process.argv[2];
const date = process.argv[3];
const roomIds = await getRoomIdByCommonAddress(address);
const chunks = splitArrayIntoChunks(roomIds, 5);
let totalResults = [];

chunks.forEach(chunk => {
    const child = fork('realtime-crawler.js', { stdio: ['pipe', 'pipe', 'pipe', 'ipc'] });
	child.send({ date, chunk });

    child.on('message', async(message) => {
        const { results, duration } = message;
        // 결과 배열에 추가
        results.forEach(result => totalResults.push(result));
        if (totalResults.length === roomIds.length) {
            try {
                await saveResultsToFile(totalResults, 'results.json');
				console.log('Results saved to file');
            } catch (err) {
                console.error('Error saving results to file:', err);
            }
        }

        if (duration) {
            console.log(`Total duration for this chunk: ${duration} milliseconds`);
        }
});

	child.on('exit', (code) => {
			console.log(`Child process exited with code ${code}`);
	});
});