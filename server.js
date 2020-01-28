const http = require('http');
const { methods } = require('./handlers');

const requestListener = function (req, res) {
  console.log('Request: ', req.url, req.method);
  const handlers = methods[req.method] || methods.NOT_ALLOWED;
  const handler = handlers[req.url] || handlers.defaultHandler;
  return handler(req, res);
};

const server = new http.Server(requestListener);

server.listen(4000, () => console.log('listening to 4000'));