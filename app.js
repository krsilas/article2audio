import express from 'express'
const app = express()
import { speechSynthesisTask } from './api/polly.js'
import { scrapeHTML } from './api/scrape.js'

import bodyParser from 'body-parser'
//add body parser as middleware for all requests
app.use(bodyParser.json());
 
app.get('/', (req, res) => {
  res.send('index.html')
})

app.post('/api/scrape', (req, res) => {
    scrapeHTML(req, res)
})

app.post('/api/polly', (req, res) => {
    speechSynthesisTask(req,res)
})
 
app.listen(3000)