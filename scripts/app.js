/*global define */
define(['sjcl', './alert'], function (sjcl, warn) {
    'use strict';
    
    var Chat = function(){
        var self = this;
        
        this.peer = false;
        this.password = "password";
        this.messages = [];
        
        //This should be overridden
        this.onupdate = function(msg){
            console.log(msg);
        }
        
        function host(id, opts){
            self.peer = false;
            if(opts.host !== "" && opts.port !== ""){
                if(id === ""){
                    console.log("asking for id");
                    self.peer = new Peer({host: opts.host, port:opts.port, debug: false});
                } else {
                    self.peer = new Peer(id, {host: opts.host, port:opts.port, debug: true});
                }
            } else if(opts.key !== ""){
                if(id === ""){
                    console.log("asking for id");
                    self.peer = new Peer({key:opts.key, debug: true});
                } else {
                    self.peer = new Peer(id, {key:opts.key, debug: true});
                }
            }
            if(self.peer){
                self.peer.on('connection', function(conn){
                    conn.on('data', function(data) {
                        handleData(data, conn);
                    });
                    deceminate({
                       type:"connect",
                       id:id
                    });
                    self.onupdate({
                        from: conn.peer,
                        message:"connected"
                    });
                });
                return self.peer;
            } else {
                console.log("need to fill something out");
                warn("need to fill something out");
            }
        }
        
        function handleData(data, conn){
            console.log('Got data:', data);
            if(data.type == 'connect'){
                if(self.peer.connections[data.id] === undefined){
                    connect(data.id);
                }
            } else if(data != "ping"){
                var text = "";
                try {
                    text = sjcl.decrypt(self.password, data);
                } catch(e){
                    warn(e);
                }
                
                var message = {
                    from: conn.peer,
                    meta: conn.metadata,
                    message: text
                };
                self.onupdate(message);
                self.messages.push(message);
            }
        }
        
        function deceminate(message){
            for(var key in self.peer.connections){
                if(self.peer.connections[key].open){
                    self.peer.connections[key].send(message);
                } else {
                    var conn = self.peer.connections[key];
                    conn.once('open', function() {
                        conn.send(message);
                    });
                }
            }
        }
        
        function connect(id){
            console.log("connecting to " + id);
            var connectingAlert = warn("connecting to " + id, 'alert-success');
            
            deceminate({
               type:"connect",
               id:id
            });
            
            var conn = self.peer.connect(id);
            conn.on('open', function() {
                $(connectingAlert).alert('close');
                self.onupdate({
                    from: id,
                    message:"connected"
                });
            });
            conn.on('data', function(data){
                handleData(data, conn);
            });
            return conn;
        }
        
        function send(message){
            //I could add more info to the json..
            //encript
            var crypticMessage = message;
            if(message != "ping")
                crypticMessage = sjcl.encrypt(self.password, message);
            
            deceminate(crypticMessage)
            
            if(message != "ping"){
                var msg = {
                    from: self.peer.id,
                   //meta: conn.metadata,
                    message:message
                };
                self.onupdate(msg);
                self.messages.push(msg);
            }
        }
        
        this.send = send;
        this.host = host;
        this.connect = connect;
    }
    
    return Chat;
});