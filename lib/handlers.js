const fs = require('fs');
const querystring = require('querystring');

const { App } = require('./app');
const { Comment, Comments } = require('./comment');
const config = require('../config');

const MIME_TYPES = {
  'html': 'text/html',
  'css': 'text/css',
};

const COMMENT_STORE = config.DATA_STORE;
const comments = Comments.load(fs.readFileSync(COMMENT_STORE,'utf8'));

const serveStaticPage = function (req, res, next) {
  const publicFolder = `${__dirname}/../public`;
  const path = req.url === '/' ? '/index.html' : req.url;
  const absolutePath = publicFolder + path;
  const stat = fs.existsSync(absolutePath) && fs.statSync(absolutePath);
  if (!stat || !stat.isFile()) {
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

const serveGuestPage = function (req, res) {
  const content = fs.readFileSync(`${__dirname}/../template/guestBook.html`, 'utf8');
  res.statusCode = 200;
  res.end(content.replace('__COMMENT__', comments.toHTML()));
};

const addComment = function (req, res) {
  const comment = new Comment(req.body.name, req.body.comment, new Date());
  comments.addComment(comment);
  fs.writeFileSync(COMMENT_STORE, comments.toJSON());
  res.writeHead(302, {
    Location: '/guestBook.html'
  });
  res.end();
};

const readBody = function (req, res, next) {
  let data = '';
  req.on('data', (chunk) => data += chunk);
  req.on('end', () => {
    req.body = data;
    if (req.headers['content-type'] === 'application/x-www-form-urlencoded')
      req.body = querystring.parse(req.body);
    next();
  });
};

const app = new App();

app.use(readBody);

app.get('/guestBook.html', serveGuestPage);
app.post('/comment', addComment);
app.get('', serveStaticPage);
app.post('/register', register);
app.get('', notFound);
app.post('', notFound);
app.use(methodNotAllowed);

module.exports = { app };