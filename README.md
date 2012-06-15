# worker.js

A node implementation of the w3's web worker using the native `child_process.fork()`


## Documentation


`new Worker(String scriptURL)`  
Creates a new Worker instance.

`.postMessage(message)`
Sends a message to the worker's inner scope.
This accepts a single parameter, which is the data to send to the worker. The data
could be any JSON data (or any data type that can be serialized) it's converted 
to JSON internally.

	postMessage({'cmd': 'init', 'timestamp': Date.now()});  

**Note:** Objects passed in and out of workers must not contain functions or cyclical references, since JSON doesn't support these.
    
`.terminate()`  
Terminates the worker.

### Events

`.onmessage`  
Handles messages sent by the script in the worker's child context.

	worker.onmessage = function(message){};

`.onerror`  
Handles uncaught error that where thrown by the script in the worker's child context.

	worker.onerror = function(error){
		// error.message     A human-readable error message.
		// error.filename    The name of the script file in which the error occurred.
		// error.lineno      The line number of the script file on which the error occurred.
	};

`.onclose`  
Handles the close event of the worker's thread/process.

	worker.onclose = function(){};


## Worker Sandbox Documentation
Documentation about the methods and properties available to the script imported in 
worker's inner scope.


`postMessage(message)`
Sends a message to the worker's parent scope.
This accepts a single parameter, which is the data to send to the worker. The data
could be any JSON data (or any data type that can be serialized) it's converted 
to JSON internally.

	postMessage({'cmd': 'init', 'timestamp': Date.now()});  

**Note:** Objects passed in and out of workers must not contain functions or cyclical references, since JSON doesn't support these.


`importScripts()`  
Imports one or more scripts into the worker's scope. 
You can specify as many as you'd like, separated by commas. For example: `importScripts('foo.js', 'bar.js');`  
This method is simular to import but they are implemented diffrently, this method evaludates the script into
the worker context.


`close()`  
Terminates the worker thread.


*  *  *

`atob()`  
Equivalent to `window.atob()` currently not implemented.

`btoa()`  
Equivalent to `window.btoa()` currently not implemented.

`clearInterval()`  
Equivalent to `window.clearInterval()`

`clearTimeout()`  
Equivalent to `window.clearTimeout()`

`setInterval()`  
Equivalent to `window.setInterval()`

`setTimeout()`  
Equivalent to `window.setTimeout()`

`require()`  
Node native method. I don't need to tell you what it does.


### Events

`onclose`  
Handles the on close event of the worker.
This callback is invoked before the worker is to be termineted, and the next tick won't fire.

	worker.onclose = function(){};

`onmessage`  
Handles messages sent from the worker's parent context, `worker.postMessage()`.

	worker.onmessage = function(message){};


