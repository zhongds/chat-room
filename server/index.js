const app = require('koa')();
const server = require('http').createServer(app.callback());
const io = require('socket.io')(server);

const port = process.env.PORT || 3001;
server.listen(port, function() {
  console.log(`Server is listening on ${port}`);
});

io.on('connection', function(){ /* … */ });
