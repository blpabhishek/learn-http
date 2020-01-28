const http = require('http');

const options = {
  hostname:'localhost',
  port:4000,
  path:'/register',
  method:'POST',
  headers:{
    'content-type':'text/plain'
  }
};

const req = http.request(options,(res)=>{
  let data = '';
  console.log(res.statusCode);
  console.log(res.headers);
  res.setEncoding('utf8');
  res.on('data',(chunk)=>{
    data+=chunk;
  });
  res.on('end',()=>{
    console.log('Data:',data);
  })
});

const data = {
  name:'Ranbir'
};

req.write(JSON.stringify(data));
req.end();