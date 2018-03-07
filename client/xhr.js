var xhr = new XMLHttpRequest();
xhr.timeout = 3000;
xhr.ontimeout = function(e) {
  console.log('timeout');
};
xhr.onerror = function(e) {
  console.log('error', e);
};

function request(url) {
  return new Promise(function (resolve, reject) {
    xhr.onreadystatechange = function () {
      if(xhr.readyState === 4) {
        var responseData = !xhr.responseType || xhr.responseType === 'text' ? xhr.responseText : xhr.response;
        if(!responseData.status || responseData.status >= 200 && responseData.status < 300) {
          resolve(responseData);          
        } else {
          reject(responseData);
        }
      }
    }
    xhr.open('get', url, true);
    xhr.send();  
  })
  
}
