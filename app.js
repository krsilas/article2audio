import express from 'express'
const app = express()
import { speechSynthesisTask } from './api/polly.js'
import { scrapeHTML } from './api/scrape.js'

import bodyParser from 'body-parser'
//add body parser as middleware for all requests
app.use(bodyParser.json());

app.post('/api/scrape', (req, res) => {
    scrapeHTML(req, res)
})

app.post('/api/polly', (req, res) => {
    speechSynthesisTask(req,res)
})

app.use(express.static('frontend/dist'));
 
app.listen(process.env.PORT || 3000)