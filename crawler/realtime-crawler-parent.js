import { splitArrayIntoChunks, getRoomId } from "./module.js";
import { fork } from "child_process";
import { writeFile } from 'fs/promises';
import dbConfig from "./module.js";
import mysql from "mysql2/promise"
async function saveResultsToFile(data, filename) {
    const jsonData = JSON.stringify(data, null, 4); // 예쁘게 출력하기 위해 indent 사용
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


const results = []; // 결과를 저장할 배열

chunks.forEach(chunk => {
    const child = fork('realtime-crawler.js', { stdio: ['pipe', 'pipe', 'pipe', 'ipc'] });
	child.send({ date, chunk });

	child.on('message', async(result) => {
		results.push(result);

        if (results.length === chunks.length) {
            try {
                await saveResultsToFile(results, 'results.json');
            } catch (err) {
                console.error('Error saving results to file:', err);
            }
        }

		if ('duration' in result) {
				console.log(`Total duration for this chunk: ${result.duration} milliseconds`);
		} else if (result.success) {
				console.log(`Crawling success for prId: ${result.prId}, roomId: ${result.roomId}`);
		} else {
				console.error(`Crawling failed for prId: ${result.prId}, roomId: ${result.roomId}, Error: ${result.error}`);
		}
});

	child.on('exit', (code) => {
			console.log(`Child process exited with code ${code}`);
	});
});