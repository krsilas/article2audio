/**
* test/test.js
* All endpoint tests for the API
*/

import chai from 'chai'
import { expect } from 'chai'

import app from '../app'

//chai-http used to send async requests to our app
const http = require('chai-http');
chai.use(http);


describe('App basic tests', () => {

  it('Should exists', () => {
    expect(app).to.be.a('function');
  })


  it('/GET should return 200 and a message', (done) => {
    
    //send a GET request to /
    chai.request(app).get('/').then( res => {

      //validate response has a message
      expect(res).to.have.status(200);
      done();
    }).catch(err => {
      console.log(err);
    });
  })
  
  it('Returns 404 error for non defined routes', (done) => {
    chai.request(app).get('/unexisting').then((res) => {
      expect(res).to.have.status(404);
      done();
    });
  });
})

describe('API Endpoints', () => {
  it('should return 200 and correct response for valid input', (done) => {
    //mock valid input
    let params = { "url": "https://www.hdm-stuttgart.de" }

    //send /POST request to /api/scrape
    chai.request(app).post('/api/scrape').send(params).then((res) => {
      //validate
      expect(res).to.have.status(200);
      expect(res.body.title).to.be.equal('Studieren. Wissen. Machen.');
      expect(res.body.slug).to.exist;
      done();
    }).catch(err => {
      console.log(err);
    });
  })

  it('should return 404 and error response for a page, that does not exist', (done) => {
    //mock page with 404 status code
    let params = { "url": "https://www.hdm-stuttgart.de/404" }
    
    //send /POST request to /api/scrape
    chai.request(app).post('/api/scrape').send(params).then(res => {
      expect(res).to.have.status(404);
      expect(res.body.error).to.be.equal('Page not found!');
      done();
    }).catch(err => {
      console.log(err);
    });
  })
})