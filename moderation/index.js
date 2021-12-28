const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const axios = require('axios')


app.use(bodyParser.json())

app.post('/events', async (req, res) => {
	console.log('event received', req.body.type)
	
	const { type, data} = req.body
	
	if (type == 'CommentCreated') {
		const status = data?.content?.includes?.('orange') ? 'rejected' : 'approved'
			await axios.post('http://event-bus:4005/events', {
		type: 'CommentModerated',
		data: { ...data, status }
	}).catch((err) => {
		console.log(err.message);
	  });
		
	}

	res.send({})
})

app.listen(4003, () => {
	console.log('listening on port 4003')
})