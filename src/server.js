const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const redis = require('redis');
const { promisifyAll } = require('bluebird');

promisifyAll(redis);

const app = express()

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors({ origin: '*' }));

const client = redis.createClient({
	host: '172.26.0.2',
	port: 6379
});

app.get('/', (req, res) => {
	res.send('Hello World!')
})

app.post('/set', async (req, res) => {
	const { username } = req.body

	try {
		await client.setAsync('username', username);
	} catch (e) {
		console.error(e)
	}
})

app.listen(5010, () => {
	console.log(`Example app listening at http://localhost:5010`)
})
