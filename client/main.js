var loginEl = document.getElementById('login');
var chatEl = document.getElementById('chat');
var usernameEl = document.getElementsByClassName('username')[0]

usernameEl.addEventListener('keydown', function(event) {
  if(event.keyCode === 13) {
    var username = usernameEl.value.trim();
    if(username) {
      loginEl.classList.add('none');
      chatEl.classList.remove('none');
    }
  }
})
