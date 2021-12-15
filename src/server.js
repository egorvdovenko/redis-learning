const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const redis = require('redis')
const { promisifyAll } = require('bluebird')

promisifyAll(redis)

const app = express()

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(cors({ origin: '*' }))

const client = redis.createClient({
	host: process.env.REDIS_HOST,
	port: 6379
})

app.get('/', (req, res) => {
	res.send('Server is running!')
})

app.post('/settings', async (req, res) => {
	const { settings } = req.body

	try {
		await client.saddAsync('users', settings.user)
		await client.hmsetAsync(`settings:${settings.user}`,
			'fontFamily', settings.fontFamily,
			'fontSize', settings.fontSize,
			'fontWeight', settings.fontWeight,
			'color', settings.color
		)

		res.send()
	} catch (e) {
		res.send(e)
	}
})

app.get('/settings/:user', async (req, res) => {
	const user = req.params.user

	try {
		const settings = {
			fontFamily: await client.hgetAsync(`settings:${user}`, 'fontFamily'),
			fontSize: await client.hgetAsync(`settings:${user}`, 'fontSize'),
			fontWeight: await client.hgetAsync(`settings:${user}`, 'fontWeight'),
			color: await client.hgetAsync(`settings:${user}`, 'color')
		}

		res.json({ settings })
	} catch (e) {
		res.send(e)
	}
})

app.get('/users', async (req, res) => {
	try {
		const users = await client.smembersAsync('users')

		res.json({ users })
	} catch (e) {
		res.send(e)
	}
})


app.listen(5010, () => {
	console.log(`Example app listening at http://localhost:5010`)
})
