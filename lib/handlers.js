const fs = require('fs');

const { App } = require('./app');

const MIME_TYPES = {
  'html': 'text/html',
  'css': 'text/css',
};

const serveStaticPage = function (req, res,next) {
  const publicFolder = `${__dirname}/../public`;
  const path = req.url === '/' ? '/index.html' : req.url;
  const absolutePath = publicFolder + path;
  const stat = fs.existsSync(absolutePath) && fs.statSync(absolutePath);
  if (!stat || !stat.isFile()){
    next();
    return;
  }
  const content = fs.readFileSync(absolutePath);
  const extension = path.split('.').pop();
  res.setHeader('Content-Type', MIME_TYPES[extension]);
  res.end(content);
};

const notFound = function (req, res) {
  res.writeHead(404);
  res.end('Not Found');
};

const register = function (req, res) {
  console.log('Body', req.body);
  res.end('Done');
};

const methodNotAllowed = function (req, res) {
  res.writeHead(400, 'Method Not Allowed');
  res.end();
}

const readBody = function (req, res, next) {
  let data = '';
  req.on('data', (chunk) => data += chunk);
  req.on('end', () => {
    req.body = data;
    next();
  });
};

const app = new App();

app.use(readBody);

app.get('', serveStaticPage);
app.post('/register', register);
app.get('', notFound);
app.post('', notFound);
app.use(methodNotAllowed);

module.exports = { app };