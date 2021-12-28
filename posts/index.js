const express = require('express')
const bodyParser = require('body-parser')
const { randomBytes } = require('crypto')
const cors = require('cors')
const axios = require('axios')
const app = express()

app.use(bodyParser.json())
app.use(cors())

const posts = {}


app.get('/posts', (req, res) => {
	res.send(posts)

})

app.post('/posts', async (req, res) => {
	console.log('post received')
	const id = randomBytes(4).toString('hex')
	const {title} = req.body
	const data = {id, title}
	
	posts[id] = {...data}

	await axios.post('http://event-bus-srv:4005/events', {
		type: 'PostCreated',
		data
	}).catch((err) => {
		console.log(err.message);
	  });

	res.status(201).send(posts[id])
})

app.post('/events', async (req, res) => {
	console.log('event received', req.body.type)

	res.send({})
})

app.listen(4000, () => {
	console.log('v55')
	console.log('listening on port 4000')
})