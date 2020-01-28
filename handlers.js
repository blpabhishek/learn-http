const fs = require('fs');

const homePage = function (req, res) {
  const content = fs.readFileSync('./index.html');
  res.setHeader('Content-Type', 'text/html');
  res.end(content);
};

const notFound = function (req, res) {
  res.writeHead(404);
  res.end('Not Found');
};

const register = function (req, res) {
  let data = '';
  req.on('data', (chunk) => data += chunk);
  req.on('end', () => {
    console.log(data);
    res.end('Done');
  });
  return;
};

const methodNotAllowed = function (req, res) {
  res.writeHead(400, 'Method Not Allowed');
  res.end();
}

const getHandlers = {
  '/': homePage,
  'defaultHandler': notFound
};

const postHandlers = {
  '/register': register,
  'defaultHandler': notFound
};

const methods = {
  GET: getHandlers,
  POST: postHandlers,
  NOT_ALLOWED: { defaultHandler: methodNotAllowed }
}

module.exports = {methods};