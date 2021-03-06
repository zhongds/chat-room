var loginEl = document.getElementById('login');
var homeEl = document.getElementById('home');
var chatRoomEl = document.getElementById('chat-room');

var usernameEl = document.getElementById('username');
var displayNameEl = document.getElementById('displayName');

// 展示聊天室名字
var chatRoomHeader = document.querySelector('#chat-room .header');
var chatRoomInput = document.getElementById('text-input');
var gobackEl = document.getElementById('goback');
var detailEl = document.getElementById('detail');
var roomChatContentEl = document.getElementById('room-chat-content');
var roomNameEl = document.getElementById('roomName');
var numUsersEl = document.getElementById('numUsers');
// 私人聊天
var privateChatEl = document.getElementById('private-chat');
var chatUserEl = document.getElementById('chat-user');
var goRoomEL = document.getElementById('goRoom');
var privateChatContentEl = document.getElementById('private-chat-content');
var privateChatInput = document.getElementById('private-text-input');

usernameEl.focus();

var username;
var socket;

usernameEl.addEventListener('keydown', function(event) {
  if(event.keyCode === 13) {
    username = usernameEl.value.trim();
    if(username) {
      showHomePage();
      displayNameEl.innerHTML = username;
    }
  }
})

gobackEl.addEventListener('click', function(event) {
  if(socket) {
    socket.close();
    socket = null;
  }
  clearChatContent();
  showHomePage();
})

goRoomEL.addEventListener('click', function(event) {
  showChatRoom();
})

roomChatContentEl.addEventListener('click', function (event) {
  var targetEl = event.target;
  if(targetEl.tagName === 'SPAN' && targetEl.classList.contains('username') 
    && targetEl.innerText !== username) {
    showPrivateChat();
    chatUserEl.innerText = targetEl.innerText;
  }
})

chatRoomInput.addEventListener('keydown', function(event) {
  event.stopPropagation();
  if(event.keyCode === 13) {
    var content = chatRoomInput.value.trim();
    if(content) {
      //跟后台交互，让它广播
      showChatContent({
        username,
        message: content,
      })
      socket.emit('new message', content);
      chatRoomInput.value = "";
    }
  }
})

privateChatInput.addEventListener('keydown', function(event) {
  event.stopPropagation();
  if(event.keyCode === 13) {
    var content = privateChatInput.value.trim();
    if(content) {
      //跟后台交互，让它广播
      showChatContent({
        username,
        message: content,
        isPrivate: true,
      })
      socket.emit('new private message', {
        id: socket.id,
        message: content,
      });
      privateChatInput.value = "";
    }
  }
})

homeEl.addEventListener('click', function(event) {
  console.log('event', event.target);
  var targetEl = event.target;
  if(targetEl.tagName === 'SPAN') {
    var namespace = targetEl.getAttribute('type');
    var roomName = targetEl.getAttribute('name');
    roomNameEl.innerText = targetEl.innerText;
    // 建立指定的socket连接，
    request(`/join-chat?namespace=${namespace}`).then(function (data) {
      console.log('result', data);
      socket = io(`/${namespace}`);
      registerSocketEvents();
      showChatRoom();
      // 加入房间
      socket.emit('join room', {
        username,
        roomName,
      })
    }).catch(error => {
      console.log('error', error);
    })
  }
})

function registerSocketEvents() {
  socket.on('new private message', function (data) {
    showChatContent(data);
  });

  socket.on('new message', function (data) {
    showChatContent(data);
  });

  socket.on('join room', function (data) {
    showTip(`${data.username} join room`);
    numUsersEl.innerText = data.numUsers;
  });

  socket.on('leave room', function (data) {
    showTip(`${data.username} leave room`);
    numUsersEl.innerText = data.numUsers;
  })

  socket.on('disconnect', function () {
    showTip(`${username} have been remove chat room`);
  });

  socket.on('reconnect', () => {
    showTip(`${username} have been reconnected`);
  });
}


/** helper functions */
function showLoginPage() {
  loginEl.classList.remove('none');
  chatRoomEl.classList.add('none');
  homeEl.classList.add('none');
  privateChatEl.classList.add('none');
}

function showHomePage() {
  loginEl.classList.add('none');
  chatRoomEl.classList.add('none');
  homeEl.classList.remove('none');
  privateChatEl.classList.add('none');
}

function showChatRoom() {
  loginEl.classList.add('none');
  chatRoomEl.classList.remove('none');
  homeEl.classList.add('none');
  privateChatEl.classList.add('none');
}

function showPrivateChat() {
  loginEl.classList.add('none');
  chatRoomEl.classList.add('none');
  homeEl.classList.add('none');
  privateChatEl.classList.remove('none');
}

function showChatContent(data) {
  // var fragment = document.createDocumentFragment();
  var liEl = document.createElement('li');
  liEl.classList.add('row');
  var spanEl1 = document.createElement('span');
  spanEl1.classList.add('username');
  spanEl1.innerText = data.username;
  liEl.appendChild(spanEl1);
  var spanEl2 = document.createElement('span');
  spanEl2.classList.add('messageBody');
  spanEl2.innerText = data.message;
  liEl.appendChild(spanEl2);
  if(data.isPrivate) {
    privateChatContentEl.appendChild(liEl);
  } else {
    roomChatContentEl.appendChild(liEl);    
  }
}

function clearChatContent() {
  roomChatContentEl.innerHTML = '';
}

function showTip(content) {
  var liEl = document.createElement('li');
  liEl.classList.add('row');
  liEl.classList.add('tip');
  liEl.innerText = content;
  roomChatContentEl.appendChild(liEl);
}

/** helper functions end */