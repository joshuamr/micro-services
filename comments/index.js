const express = require('express')
const bodyParser = require('body-parser')
const { randomBytes } = require('crypto')
const axios = require('axios')
const cors = require('cors')

const app = express()

app.use(bodyParser.json())
app.use(cors())


const commentsByPostId = {}


app.get('/posts/:id/comments', (req, res) => {
	const {id} = req.params
	res.send(commentsByPostId[id] || [])

})

app.post('/posts/:id/comments', async (req, res) => {
	console.log('post received')
	const idForComment = randomBytes(4).toString('hex')
	const {content} = req.body
	const {id} = req.params
	const data = {content, id: idForComment, postId: id, status: 'pending'}
	await axios.post('http://event-bus-srv:4005/events', {
		type: 'CommentCreated',
		data
	}).catch((err) => {
		console.log(err.message);
	  });
	if (!commentsByPostId[id])commentsByPostId[id] = []
	commentsByPostId[id].push(data)

	res.status(201).send(commentsByPostId[id])
})

app.post('/events', async (req, res) => {
	console.log('event received', req.body.type)
	const { type, data } = req.body
	if (type == 'CommentModerated') {
			await axios.post('http://event-bus-srv:4005/events', {
		type: 'CommentUpdated',
		data
	}).catch((err) => {
		console.log(err.message);
	  });
	}
	

	res.send({})
})

app.listen(4001, () => {
	console.log('listening on port 4001')
})