const path = require('path');
const Koa = require('koa');
const app = new Koa();
const server = require('http').createServer(app.callback());
const io = require('socket.io')(server);
const serve = require('koa-static');
const Router = require('koa-router');
const router = new Router();

router.get('/login', (ctx, next) => {
  console.log('login ctx', ctx);
}).get('/join-chat', (ctx, next) => {
  console.log('参数', ctx);
  const { namespace, room } = ctx.query;
  const chat = io.of(ctx.query.namespace);
  registerSocketEvents(chat, room);
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

let numUsers = 0;

function registerSocketEvents(chat, room) {
  chat.on('connection', function(socket){
    socket.on('new message', function (data) {
      socket.emit('new message', {
        username: '31231',
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
}
