var cp = require('child_process');

/**
 * A Worker Implementation
 * 
 * https://developer.mozilla.org/En/DOM/Worker/Functions_available_to_workers
 * https://developer.mozilla.org/en/DOM/Worker
 */
module.exports = function Worker(scriptURL){
    
    var self = this;
    var options = {};
    options.cwd = __dirname;
    //options.env;
    options.encoding = 'utf8';
    
    var tread = cp.fork(__dirname + '/worker-child.js', [scriptURL], options);
    
    tread.on('message', function(message){
        //console.log('Worker.onmessage:\n', message);
        
        message = JSON.parse(message);
        
        if(self.onmessage){
            self.onmessage(message);
        }
    });
    
    tread.on('exit',function(){
        console.log('Worker did quit');
    });
    
    process.on('exit',function(){
        tread.kill();
    })
    
    
    this.postMessage = function(message){
        var data;
        
        if(Buffer.isBuffer(message)){
            data = 'buffer:' + message.toString('utf8');
        }else{
            data = JSON.stringify(message);
        }
        
        tread.send(data);
    }
    
    this.terminate = function(){
        tread.kill();
    }
    
    this.onmessage = null;
    this.onerror = null;
    
}