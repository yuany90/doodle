if (!window.requestAnimationFrame) {
  window.requestAnimationFrame = 
  (window.webkitRequestAnimationFrame ||
   window.mozRequestAnimationFrame ||
   window.msRequestAnimationFrame ||
   window.oRequestAnimationFrame ||
   function (callback) {
     return window.setTimeout(callback, 17 /*~ 1000/60*/);
   });
}
if (!window.cancelAnimationFrame) {
  window.cancelAnimationFrame = (window.cancelRequestAnimationFrame ||
  window.webkitCancelAnimationFrame || window.webkitCancelRequestAnimationFrame ||
  window.mozCancelAnimationFrame || window.mozCancelRequestAnimationFrame ||
  window.msCancelAnimationFrame || window.msCancelRequestAnimationFrame ||
  window.oCancelAnimationFrame || window.oCancelRequestAnimationFrame ||
  window.clearTimeout);
}

window.animate = {};

window.animate.captureXY = 
function (eventPageX, eventPageY, 
  eventClientX, eventClientY,
  bodyScrollLeft, bodyScrollTop,
  elemScrollLeft, elemScrollTop,
  offsetLeft, offsetTop){
    var x, y, result;
    if (eventPageX || eventPageY) {
      x = eventPageX;
      y = eventPageY;
    } else {
      x = eventClientX + bodyScrollLeft + elemScrollLeft;
      y = eventClientY + bodyScrollTop + elemScrollTop;
    }
    x -= offsetLeft;
    y -= offsetTop;
    result = {'x': x, 'y': y};
    return result;
}

window.animate.captureMouse = function (element) {
  var mouse = {x: 0, y: 0, prevX: 0, prevY: 0, event: null, move: false},
      body_scrollLeft = document.body.scrollLeft,
      element_scrollLeft = document.documentElement.scrollLeft,
      body_scrollTop = document.body.scrollTop,
      element_scrollTop = document.documentElement.scrollTop,
      offsetLeft = element.offsetLeft,
      offsetTop = element.offsetTop;
  
  element.addEventListener('mouseover', function (event) {
    var pos = animate.captureXY (
      event.pageX, event.pageY, 
      event.clientX , event.clientY,
      body_scrollLeft, body_scrollTop,
      element_scrollLeft, element_scrollTop,
      offsetLeft, offsetTop);
    
    mouse.x = pos.x;
    mouse.y = pos.y;
  }, false);
  
  element.addEventListener('mousemove', function (event) {
    var pos = animate.captureXY (
      event.pageX, event.pageY, 
      event.clientX , event.clientY,
      body_scrollLeft, body_scrollTop,
      element_scrollLeft, element_scrollTop,
      offsetLeft, offsetTop);
    
    mouse.prevX = mouse.x;
    mouse.prevY = mouse.y;
    mouse.x = pos.x;
    mouse.y = pos.y;
    mouse.event = event;
    mouse.move = true;
  }, false);
  
  return mouse;
}


window.animate.captureTouch = function (element) {
  var touches = [],
  //{x: null, y: null, prevX: 0, prevY: 0, 
  //    isPressed: false, event: null, move: false},
      body_scrollLeft = document.body.scrollLeft,
      element_scrollLeft = document.documentElement.scrollLeft,
      body_scrollTop = document.body.scrollTop,
      element_scrollTop = document.documentElement.scrollTop,
      offsetLeft = element.offsetLeft,
      offsetTop = element.offsetTop;

  element.addEventListener('touchstart', function (event) {
    for(var i = 0; i < event.touches.length; i++){
      touch_event = event.touches[i];
      var pos = animate.captureXY (
        touch_event.pageX, touch_event.pageY, 
        touch_event.clientX , touch_event.clientY,
        body_scrollLeft, body_scrollTop,
        element_scrollLeft, element_scrollTop,
        offsetLeft, offsetTop); 
      var touch = {x: pos.x, y: pos.y, prevX: 0, prevY: 0, 
      move: false};
      touches[touch_event.identifier] = touch;
    }
  }, false);

  element.addEventListener('touchend', function (event) {
    touch.isPressed = false;
    touch.x = null;
    touch.y = null;
    touch.event = event;
  }, false);
  
  element.addEventListener('touchmove', function (event) {
    for(var i = 0; i < event.touches.length; i++){
      touch_event = event.touches[i];
      var pos = animate.captureXY (
        touch_event.pageX, touch_event.pageY, 
        touch_event.clientX , touch_event.clientY,
        body_scrollLeft, body_scrollTop,
        element_scrollLeft, element_scrollTop,
        offsetLeft, offsetTop); 
      var prevX = 0;
      var prevY = 0;
      if(touches[touch_event.identifier] != undefined){
        prevX = touches[touch_event.identifier].x;
        prevY = touches[touch_event.identifier].y
      }
      var touch = {'x': pos.x, 'y': pos.y, 'prevX': prevX, 'prevY': prevY, 
      'move': true};
      touches[touch_event.identifier] = touch;
    }
  }, false);
  
  return touches;
}
