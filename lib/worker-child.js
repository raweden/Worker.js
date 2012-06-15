var vm = require('vm');
var fs = require('fs');
var path = require('path');

// Setting Up Sandbox

var sandbox = {};

// Base64

sandbox.atob = function(encodedData){
    return null;
}

sandbox.btoa = function(stringToEncode){
    return null;
}

// Timer Methods
sandbox.clearInterval = clearInterval;
sandbox.clearTimeout = clearTimeout;
sandbox.dump = null;
sandbox.setInterval = setInterval;
sandbox.setTimeout = setTimeout;
// Debug Methods
sandbox.console = console;

// Worker Specific Methods

var importScriptsPrivate = function(filename){
    var nativePath = __dirname + '/' + filename;
    nativePath = path.normalize(nativePath);
    var exists = path.existsSync(nativePath);
    
    console.log('worker.js (worker) -:importing scripts from: '+filename);
    
    if(exists){
        var script = fs.readFileSync(nativePath, 'utf8');
        vm.runInContext(script, context, filename);
    }
}

sandbox.importScripts = function(){
    var filename;
    for(var i = 0;i<arguments.length;i++){
        // @Todo: determine that argument is string and non-empty string.
        filename = arguments[i];
        importScriptsPrivate(filename);
    }
}



sandbox.require = require;

//

sandbox.close = function(){
    process.exit();
}

sandbox.postMessage = function(message){
    
    //console.log('worker.js (worker) -:postMessage() called');
    //console.log(message);
    
    message = JSON.stringify(message, null, '\t');
    process.send(message);
}

// Symbolic names for our messages types
var MSGTYPE_NOOP = 0;
var MSGTYPE_ERROR = 1;
var MSGTYPE_CLOSE = 2;
var MSGTYPE_USER = 100;

sandbox.onclose = undefined;
sandbox.onmessage = undefined;

// Register Listeners

process.on('message', function(message){
    
    var data;
    var type;
    var bin = message.substr(0,7) == 'buffer:';
    var len;
    
    if(bin){
        message = message.substr(7);
        len = Buffer.byteLength(message);
        data = new Buffer(len);
        data.write(message, 0, data.length, 'utf8');
        message = data;
    }else{
        message = JSON.parse(message);
        type = message.type;
        data = message.data;
    }
    
    console.log('message is buffer: '+Buffer.isBuffer(message));
    

    /*
    switch(type){
        case MSGTYPE_NOOP:
            break;
        case MSGTYPE_ERROR:
            break;
        case MSGTYPE_CLOSE:
            break;
        case MSGTYPE_USER:
            */
            if(typeof sandbox.onmessage == 'function'){
                sandbox.onmessage(data);
            }
            /*
            break;
        default:
            console.log('resived unsupported message');
    }
    */
    
    console.log('worker.js (inside) -:onmessage() called');
    console.log(message);
});


process.on('exit', function () {
    if(typeof sandbox.onclose == 'function'){
        sandbox.onclose();
    }
    
    console.log('Worker (worker) -:about to exit.');
});

process.on('uncaughtException', function (err){
    // Copies the error.
    var obj = {};
    obj.message = err.message;
    obj.fileName = err.fileName;
    obj.lineNumber = err.lineNumber;
    
    // @Todo: send the object with send() using the specified symbols.
    console.log('Worker (worker) -:uncaught exception: ' + err);
    console.log(obj);
});

// Loading The Script
// @Todo: assert that the script argument is provided in the top if this script.
var filename = process.argv[2];
var script = fs.readFileSync(__dirname + '/' + filename, 'utf8');

// Creating The Context.
var context = vm.createContext(sandbox);
vm.runInContext(script, context, filename);

