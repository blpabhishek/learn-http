const request = require('supertest');
const { app } = require('../lib/handlers');


describe('GET Home Page', () => {
  it('should get the home page / path', (done) => {
    request(app.serve.bind(app))
      .get('/')
      .set('Accept', '*/*')
      .expect(200)
      .expect('Content-Type', 'text/html', done)
      .expect('Content-Length', "318")
      .expect(/Welcome/)
  });
});

describe('GET nonExisting Url',()=>{
  it('should return 404 for a non existing page',(done)=>{
    request(app.serve.bind(app))
      .get('/badPage')
      .expect(404,done);
  });
});

describe('POST /register',()=>{
  it('should post on the register url',()=>{
    request(app.serve.bind(app))
      .post('/register')
      .send('name=Ranbir')
      .expect(200)
      .expect('Done')
      .expect((res)=>{
        console.log(res);
      })
      .end((err,res)=>{
        console.log(err);
      })
  });
});