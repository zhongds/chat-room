const path = require('path');
const Koa = require('koa');
const app = new Koa();
const server = require('http').createServer(app.callback());
const io = require('socket.io')(server);
const serve = require('koa-static');

const clientFiles = serve(path.join(__dirname, '../client'));
clientFiles._name = 'static/client';
app.use(clientFiles);

const port = process.env.PORT || 3001;
server.listen(port, function() {
  console.log(`Server is listening on ${port}`);
});

let numUsers = 0;

io.on('connection', function(socket){
  socket.on('new message', function (content) {
    socket.broadcast.emit('new message', {
      username: socket.username,
      message: data
    });
  })
  socket.on('add user', function (username) {
    // we store the username in the socket session for this client
    socket.username = username;
    ++numUsers;
    addedUser = true;
    socket.emit('login', {
      numUsers: numUsers
    });
    // echo globally (all clients) that a person has connected
    socket.broadcast.emit('user joined', {
      username: socket.username,
      numUsers: numUsers
    });
  })
});
