var loginEl = document.getElementById('login');
var homeEl = document.getElementById('home');
var chatRoomEl = document.getElementById('chat-room');

var usernameEl = document.getElementsByClassName('username')[0];
var displayNameEl = document.getElementById('displayName');

// 展示聊天室名字
var chatRoomHeader = document.querySelector('#chat-room .header');
var chatRoomInput = document.getElementById('text-input');
var gobackEl = document.getElementById('goback');
var detailEl = document.getElementById('detail');

usernameEl.focus();

gobackEl.addEventListener('click', function(event) {
  loginEl.classList.add('none');
  chatRoomEl.classList.add('none');
  homeEl.classList.remove('none');
})

var username;

// usernameEl.addEventListener('keydown', function(event) {
//   if(event.keyCode === 13) {
//     username = usernameEl.value.trim();
//     if(username) {
//       loginEl.classList.add('none');
//       chatRoomEl.classList.add('none');
//       homeEl.classList.remove('none');
//       displayNameEl.innerHTML = username;
//     }
//   }
// })

chatRoomInput.addEventListener('keydown', function(event) {
  event.stopPropagation();
  if(event.keyCode === 13) {
    var content = chatRoomInput.nodeValue.trim();
    console.log('input content', content);
    if(content) {
      //跟后台交互，让它广播
    }
  }
})

homeEl.addEventListener('click', function(event) {
  console.log('event', event.target);
  var targetEl = event.target;
  if(targetEl.tagName === 'SPAN') {
    var roomName = targetEl.getAttribute('name');
    // 建立指定的socket连接，
  }
})
