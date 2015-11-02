var timerId = null;
var interval = 100;

self.onmessage = function(msg) {
  if (msg.data === 'start') {
    timerId = setInterval(function() {
      postMessage('tick');
    }, interval);
  } else if (msg.data.interval) {
    interval = msg.data.interval;

    if (timerId) {
      clearInterval(timerId);
      timerId = setInterval(function() {
        postMessage('tick');
      }, interval);
    }
  } else if (msg.data === 'stop') {
    clearInterval(timerId);
    timerId = null;
  }
};
