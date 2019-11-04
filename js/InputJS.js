var InputJS = function( config ) {
  var input = {
    keyboard: {
     active: [],
     delta: {
       down: [],
       up: [] }
    },
    mouse: {
     position: {
       real: { x: 0, y: 0 },
       smooth: { x: 0, y: 0 }
     },
     active: [],
     delta: {
       position: { x: 0, y: 0 },
       down: [],
       up: [],
       wheel: { x: 0, y: 0 } }
    }
  };
  
  var callback_functions = {
    callbacks: [],
    keyboard: {
      callbacks: [],
      delta: {
        callbacks: [],
        down: { callbacks: [] },
        up: { callbacks: [] }
      }
    },
    mouse: {
      callbacks: [],
      delta: {
        callbacks: [],
        down: { callbacks: [] },
        up: { callbacks: [] },
        wheel: { callbacks: [] }
      }
    }
  };
  
  this.getInput = function() {
    return input;
  };
  
  this.getInputData = function( clear_delta = false ) {
    var input_clone = {
      keyboard: {
       active: input.keyboard.active.slice(0),
       delta: {
         down: input.keyboard.delta.down.slice(0),
         up: input.keyboard.delta.up.slice(0) },
      },
      mouse: {
       position: {
         real: { x: input.mouse.position.real.x, y: input.mouse.position.real.y },
         smooth: { x: input.mouse.position.smooth.x, y: input.mouse.position.smooth.y }
       },
       active: input.mouse.active.slice(0),
       delta: {
         position: { x: input.mouse.delta.position.x, y: input.mouse.delta.position.y },
         down: input.mouse.delta.down.slice(0),
         up: input.mouse.delta.up.slice(0),
         wheel: { x: input.mouse.delta.wheel.x, y: input.mouse.delta.wheel.y }
       }
      }
    };
    
    if(clear_delta == 'keyboard') {
      input.keyboard.delta.down.length = 0;
      input.keyboard.delta.up.length = 0;
    } else if(clear_delta == 'mouse') {
      input.mouse.delta.position.x = 0;
      input.mouse.delta.position.y = 0;
      input.mouse.delta.down.length = 0;
      input.mouse.delta.up.length = 0;
      input.mouse.delta.wheel.x = 0;
      input.mouse.delta.wheel.y = 0;
    } else if(clear_delta == true) {
      input.keyboard.delta.down.length = 0;
      input.keyboard.delta.up.length = 0;
      input.mouse.delta.position.x = 0;
      input.mouse.delta.position.y = 0;
      input.mouse.delta.down.length = 0;
      input.mouse.delta.up.length = 0;
      input.mouse.delta.wheel.x = 0;
      input.mouse.delta.wheel.y = 0;
    }
    
    return input_clone;
  };
  
  var getInputData = this.getInputData;
  
  var keyDownHandler = function(event) {
    var key = event.key;
    var index = input.keyboard.active.indexOf( key );
    
    if(index == -1) {
      input.keyboard.active.push( key );
      input.keyboard.active.sort();
      
      if(input.keyboard.delta.down.indexOf( key ) == -1) {
        input.keyboard.delta.down.push( key );
        input.keyboard.delta.down.sort();
      }
      
      var index_up = input.keyboard.delta.up.indexOf( key );
      if(index_up != -1) {
        input.keyboard.delta.up.splice(index_up, 1);
      }
    }
    
    for( var i in callback_functions.callbacks ) { 
      callback_functions.callbacks[i](getInputData(false));
    }
    for( var i in callback_functions.keyboard.callbacks ) { 
      callback_functions.keyboard.callbacks[i](getInputData(false));
    }
    for( var i in callback_functions.keyboard.delta.callbacks ) { 
      callback_functions.keyboard.delta.callbacks[i](getInputData('keyboard'));
    }
    for( var i in callback_functions.keyboard.delta.down.callbacks ) { 
      callback_functions.keyboard.delta.down.callbacks[i](getInputData('keyboard'));
    }
  };
  
  var keyUpHandler = function(event) {
    var key = event.key;
    var index = input.keyboard.active.indexOf( key );
    
    if(index != -1) {
      input.keyboard.active.splice(index, 1);
      input.keyboard.active.sort();
            
      if(input.keyboard.delta.up.indexOf( key ) == -1) {
        input.keyboard.delta.up.push( key );
        input.keyboard.delta.up.sort();
      }
      
      var index_down = input.keyboard.delta.down.indexOf( key );
      if(index_down != -1) {
        input.keyboard.delta.down.splice(index_down, 1);
      }
    }
    
    for( var i in callback_functions.callbacks ) { 
      callback_functions.callbacks[i](getInputData(false));
    }
    for( var i in callback_functions.keyboard.callbacks ) { 
      callback_functions.keyboard.callbacks[i](getInputData(false));
    }
    for( var i in callback_functions.keyboard.delta.callbacks ) { 
      callback_functions.keyboard.delta.callbacks[i](getInputData('keyboard'));
    }
    for( var i in callback_functions.keyboard.delta.up.callbacks ) { 
      callback_functions.keyboard.delta.up.callbacks[i](getInputData('keyboard'));
    }
  };
  
  var smooth_mouse = false;
  var smooth_active = false;
  var smoothMouse = function() {
    if (input.mouse.position.smooth.x < input.mouse.position.real.x) {
      input.mouse.position.smooth.x = 
        (input.mouse.position.real.x - input.mouse.position.smooth.x > 10) ? 
          input.mouse.position.smooth.x + 3 : 
          input.mouse.position.smooth.x + 1;
    } else if (input.mouse.position.smooth.x > input.mouse.position.real.x) {
      input.mouse.position.smooth.x = 
        (input.mouse.position.smooth.x - input.mouse.position.real.x > 10) ? 
          input.mouse.position.smooth.x - 3 : 
          input.mouse.position.smooth.x - 1;
    }
    
    if (input.mouse.position.smooth.y < input.mouse.position.real.y) {
      input.mouse.position.smooth.y = 
        (input.mouse.position.real.y - input.mouse.position.smooth.y > 10) ? 
          input.mouse.position.smooth.y + 3 : 
          input.mouse.position.smooth.y + 1;
    } else if (input.mouse.position.smooth.y > input.mouse.position.real.y) {
      input.mouse.position.smooth.y = 
        (input.mouse.position.smooth.y - input.mouse.position.real.y > 10) ? 
          input.mouse.position.smooth.y - 3 : 
          input.mouse.position.smooth.y - 1;
    }
    
    if(input.mouse.position.smooth.y != input.mouse.position.real.y || 
       input.mouse.position.smooth.x != input.mouse.position.real.x) {
      requestAnimationFrame(smoothMouse);
    } else {
      smooth_active = false;
    }
    
    for( var i in callback_functions.mouse.callbacks ) { 
      callback_functions.mouse.callbacks[i](getInputData(false));
    }
    for( var i in callback_functions.mouse.delta.callbacks ) { 
      callback_functions.mouse.delta.callbacks[i](getInputData('mouse'));
    }
  };
  
  var mouseMoveHandler = function(event) {
    input.mouse.position.real.x = event.clientX;
    input.mouse.position.real.y = event.clientY;
    input.mouse.delta.position.x = event.movementX;
    input.mouse.delta.position.y = event.movementY;
    
    input.mouse.position.smooth.x = (input.mouse.position.smooth.x == 0) ? 
                                       input.mouse.position.real.x : 
                                       input.mouse.position.smooth.x;
    input.mouse.position.smooth.y = (input.mouse.position.smooth.y == 0) ? 
                                       input.mouse.position.real.y : 
                                       input.mouse.position.smooth.y;
    
    for( var i in callback_functions.callbacks ) { 
      callback_functions.callbacks[i](getInputData(0));
    }
    for( var i in callback_functions.mouse.callbacks ) { 
      callback_functions.mouse.callbacks[i](getInputData(0));
    }
    for( var i in callback_functions.mouse.delta.callbacks ) { 
      callback_functions.mouse.delta.callbacks[i](getInputData('mouse'));
    }
    
    if( smooth_mouse && !smooth_active && 
       (input.mouse.position.smooth.y != input.mouse.position.real.y || 
        input.mouse.position.smooth.x != input.mouse.position.real.x) ) {
      smooth_active = true;
      requestAnimationFrame(smoothMouse);
    }
  };
  
  var mouseDownHandler = function(event) {
    input.mouse.position.real.x = event.clientX;
    input.mouse.position.real.y = event.clientY;
    
    var button = event.button;
    var index = input.mouse.active.indexOf( button );

    if(index == -1) {
      input.mouse.active.push( button );
      input.mouse.active.sort();
      
      if(input.mouse.delta.down.indexOf( button ) == -1) {
        input.mouse.delta.down.push( button );
        input.mouse.delta.down.sort();
      }
      
      var index_up = input.mouse.delta.up.indexOf( button );
      if(index_up != -1) {
        input.mouse.delta.up.splice(index_up, 1);
      }
    }
    
    if( smooth_mouse && !smooth_active && 
       (input.mouse.position.smooth.y != input.mouse.position.real.y || 
        input.mouse.position.smooth.x != input.mouse.position.real.x) ) {
      smooth_active = true;
      requestAnimationFrame(smoothMouse);
    }
        
    for( var i in callback_functions.callbacks ) { 
      callback_functions.callbacks[i](getInputData(false));
    }
    for( var i in callback_functions.mouse.callbacks ) { 
      callback_functions.mouse.callbacks[i](getInputData(false));
    }
    for( var i in callback_functions.mouse.delta.callbacks ) { 
      callback_functions.mouse.delta.callbacks[i](getInputData('mouse'));
    }
    for( var i in callback_functions.mouse.delta.down.callbacks ) { 
      callback_functions.mouse.delta.up.callbacks[i](getInputData('mouse'));
    }
  };
  
  var mouseUpHandler = function(event) {
    input.mouse.position.real.x = event.clientX;
    input.mouse.position.real.y = event.clientY;
    
    var button = event.button;
    var index = input.mouse.active.indexOf( button );
    
    if(index != -1) {
      input.mouse.active.splice(index, 1);
      input.mouse.active.sort();
            
      if(input.mouse.delta.up.indexOf( button ) == -1) {
        input.mouse.delta.up.push( button );
        input.mouse.delta.up.sort();
      }
      
      var index_down = input.mouse.delta.down.indexOf( button );
      if(index_down != -1) {
        input.mouse.delta.down.splice(index_down, 1);
      }
    }
    
    if( smooth_mouse && !smooth_active && 
       (input.mouse.position.smooth.y != input.mouse.position.real.y || 
        input.mouse.position.smooth.x != input.mouse.position.real.x) ) {
      smooth_active = true;
      requestAnimationFrame(smoothMouse);
    }
    
    for( var i in callback_functions.callbacks ) { 
      callback_functions.callbacks[i](getInputData(false));
    }
    for( var i in callback_functions.mouse.callbacks ) { 
      callback_functions.mouse.callbacks[i](getInputData(false));
    } 
    for( var i in callback_functions.mouse.delta.callbacks ) { 
      callback_functions.mouse.delta.callbacks[i](getInputData('mouse'));
    }
    for( var i in callback_functions.mouse.delta.up.callbacks ) { 
      callback_functions.mouse.delta.up.callbacks[i](getInputData('mouse'));
    }
  }; 
  
  var mouseWheelHandler = function(event) {
    input.mouse.delta.wheel.x = event.wheelDeltaX;
    input.mouse.delta.wheel.y = event.wheelDeltaY;
    
    for( var i in callback_functions.callbacks ) { 
      callback_functions.callbacks[i](getInputData(false));
    }
    for( var i in callback_functions.mouse.callbacks ) { 
      callback_functions.mouse.callbacks[i](getInputData(false));
    } 
    for( var i in callback_functions.mouse.delta.callbacks ) { 
      callback_functions.mouse.delta.callbacks[i](getInputData('mouse'));
    }
    for( var i in callback_functions.mouse.delta.wheel.callbacks ) { 
      callback_functions.mouse.delta.wheel.callbacks[i](getInputData('mouse'));
    }
  };
  
  window.addEventListener('keydown', keyDownHandler );
  window.addEventListener('keyup', keyUpHandler );
  window.addEventListener('mousemove', mouseMoveHandler );
  window.addEventListener('mousedown', mouseDownHandler );
  window.addEventListener('mouseup', mouseUpHandler );
  window.addEventListener('wheel', mouseWheelHandler );
  
  this.set = function(cnf) {
    if(cnf) {
      if(cnf.callbacks) {
        for( var i in cnf.callbacks ) {
          callback_functions.callbacks.push(cnf.callbacks[i]); 
        }
      }
      if(cnf.keyboard) {
        if(cnf.keyboard.callbacks) {
          for( var i in cnf.keyboard.callbacks ) { 
            callback_functions.keyboard.callbacks.push(cnf.keyboard.callbacks[i]); 
          }
        }
        if(cnf.keyboard.delta) {
          if(cnf.keyboard.delta.callbacks) {
            for( var i in cnf.keyboard.delta.callbacks ) { 
              callback_functions.keyboard.delta.callbacks.push(cnf.keyboard.delta.callbacks[i]); 
            }
          }
          if(cnf.keyboard.delta.down && cnf.keyboard.delta.down.callbacks) {
            for( var i in cnf.keyboard.delta.down.callbacks ) { 
              callback_functions.keyboard.delta.down.callbacks.push(cnf.keyboard.delta.down.callbacks[i]); 
            }
          }
          if(cnf.keyboard.delta.up && cnf.keyboard.delta.up.callbacks) {
            for( var i in cnf.keyboard.delta.up.callbacks ) { 
              callback_functions.keyboard.delta.up.callbacks.push(cnf.keyboard.delta.up.callbacks[i]); 
            }
          }
        }
      }
      if(cnf.mouse) {
        if(cnf.mouse.callbacks) {
          for( var i in cnf.mouse.callbacks ) { 
            callback_functions.mouse.callbacks.push(cnf.mouse.callbacks[i]); 
          }
        }
        if(cnf.mouse.delta) {
          if(cnf.mouse.delta.callbacks) {
            for( var i in cnf.mouse.delta.callbacks ) { 
              callback_functions.mouse.delta.callbacks.push(cnf.mouse.delta.callbacks[i]); 
            }
          }
          if(cnf.mouse.delta.down && cnf.mouse.delta.down.callbacks) {
            for( var i in cnf.mouse.delta.down.callbacks ) { 
              callback_functions.mouse.delta.down.callbacks.push(cnf.mouse.delta.down.callbacks[i]); 
            }
          }
          if(cnf.mouse.delta.up && cnf.mouse.delta.up.callbacks) {
            for( var i in cnf.mouse.delta.up.callbacks ) { 
              callback_functions.mouse.delta.up.callbacks.push(cnf.mouse.delta.up.callbacks[i]); 
            }
          }
          if(cnf.mouse.delta.wheel && cnf.mouse.delta.wheel.callbacks) {
            for( var i in cnf.mouse.delta.wheel.callbacks ) { 
              callback_functions.mouse.delta.wheel.callbacks.push(cnf.mouse.delta.wheel.callbacks[i]); 
            }
          }
        }
        if(cnf.mouse.smooth) {
          smooth_mouse = cnf.mouse.smooth;
        }
      }
    }
  };
  
  if(config) {
    this.set(config);
  }
};