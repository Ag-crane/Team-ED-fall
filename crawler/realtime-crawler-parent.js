import { splitArrayIntoChunks, getRoomId } from "./module.js";
import { fork } from "child_process";
import { writeFile } from 'fs/promises';

async function saveResultsToFile(data, filename) {
    const jsonData = JSON.stringify(data, null, 4); // 예쁘게 출력하기 위해 indent 사용
    await writeFile(filename, jsonData, 'utf8');
    console.log(`Results saved to ${filename}`);
}

const roomIds = await getRoomId();
const chunks = splitArrayIntoChunks(roomIds, 5);
// const region = process.argv[2]
const date = process.argv[2];

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