const path = require('path');
const Koa = require('koa');
const app = new Koa();
const server = require('http').createServer(app.callback());
const io = require('socket.io')(server);
const serve = require('koa-static');
const Router = require('koa-router');
const router = new Router();

const namespaces = [];
router.get('/login', (ctx, next) => {
  console.log('login ctx', ctx);
}).get('/join-chat', (ctx, next) => {
  const { namespace } = ctx.query;
  let chat;
  if(namespaces.indexOf(namespace) === -1) {
    console.log('只应该进来一次');
    const chat = io.of(`/${namespace}`);
    registerSocketEvents(chat);
    namespaces.push(namespace);
  }
  ctx.body = 'success';
}).get('/', (ctx, next) => {
  console.log('root router', ctx);
})

const clientFiles = serve(path.join(__dirname, '../client'));
clientFiles._name = 'static/client';
app.use(clientFiles);

app.use(router.routes()).use(router.allowedMethods());

const port = process.env.PORT || 3001;
server.listen(port, function() {
  console.log(`Server is listening on ${port}`);
});

// key: roomName, value: numUsers
const roomMap = {};

function registerSocketEvents(chat) {
  chat.on('connection', function(socket){
    socket.on('join room', function (data) {
      socket.join(data.roomName, function () {
        // we store the username in the socket session for this client
        socket.username = data.username;
        socket.room = data.roomName;
        roomMap[socket.room] ? ++roomMap[socket.room] : roomMap[socket.room] = 1;
        // echo globally (all clients) that a person has connected
        // 房间内所有人都能收到信息，包括自己
        chat.to(data.roomName).emit('join room', {
          username: socket.username,
          numUsers: roomMap[socket.room],
        })
        // 房间内所有人都能收到信息，除了自己
        // socket.broadcast.to(data.roomName).emit('join room', {
        //   username: socket.username,
        //   numUsers: numUsers
        // });
      });  
    })

    socket.on('new message', function (data) {
      socket.broadcast.to(socket.room).emit('new message', {
        username: socket.username,
        message: data
      });
    })

    socket.on('disconnect', function() {
      socket.leave(socket.room, function () {
        console.log(`${socket.username} leave ${socket.room}`);
        // chat.sockets.in(roomid).emit('system','hello,'+data+'加入了房间');//包括自己
        --roomMap[socket.room];
        chat.to(socket.room).emit('leave room', {
          username: socket.username,
          numUsers: roomMap[socket.room],
        });
      })
    });
    
  }); 
}