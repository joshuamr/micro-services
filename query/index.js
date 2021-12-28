const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const app = express()
const axios = require('axios')


app.use(bodyParser.json())
app.use(cors())

const posts = {}

const handleEvent = (type, data) => {
	if (type === 'PostCreated') {
		const { id, title } = data
		posts[id] = { id, title, comments: [] };
	}
	if (type === 'CommentCreated') {
		const { id, content, postId, status } = data;
		const post = posts[postId];
		post.comments.push({ id, content, status });
	}
	if (type === 'CommentUpdated') {
		const { id, content, postId, status } = data;
		console.log(id)
		const post = posts[postId];
		console.log(post)
		const comment = post.comments.find(comment => comment.id === id);
		comment.status = status 
		comment.content = content;
	}
}

app.get('/posts', (req, res) => {
	res.send(posts)
})

app.post('/events', async (req, res) => {
	console.log('event received', req.body.type)

	const {type, data} = req.body

	handleEvent(type, data)
	
	console.log(posts)
	
	res.send({});
})


app.listen(4002, async () => {
	console.log('listening on port 4002')

	const res = await axios.get('http://event-bus-srv:4005/events')
	console.log(res.data)

	for (const event of res.data) {
		handleEvent(event.type, event.data)
	}
})