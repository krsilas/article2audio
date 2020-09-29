import express from 'express'
const app = express()
import { speechSynthesisTask } from './api/polly.js'
import { scrapeHTML } from './api/scrape.js'

import bodyParser from 'body-parser'
//add body parser as middleware for all requests
app.use(bodyParser.json());

app.use(express.static('frontend/dist'));

app.post('/api/scrape', (req, res) => {
    scrapeHTML(req, res)
})

app.post('/api/polly', (req, res) => {
    speechSynthesisTask(req,res)
})

app.get('*', (req, res) => {
    res.status(404).send('Page not found!');
});
 
console.log('App is running at http://localhost:'+ (process.env.PORT || 3000))
app.listen(process.env.PORT || 3000)

export default app;