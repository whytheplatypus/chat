/*global define */
define(['sjcl', './alert'], function (sjcl, warn) {
    'use strict';
    
    var Chat = function(){
        var self = this;
        
        this.mesh = false;
        this.peer = false;
        this.password = "password";
        this.messages = [];
        
        //This should be overridden
        this.onupdate = function(msg){
            console.log(msg);
        }
        
        function host(id, opts){
            
            if(opts.host !== "" && opts.port !== ""){
                if(id === ""){
                    console.log("asking for id");
                    self.peer = new Peer({host: opts.host, port:opts.port, debug: false});
                } else {
                    self.peer = new Peer(id, {host: opts.host, port:opts.port, debug: false});
                }
            } else if(opts.key !== ""){
                if(id === ""){
                    console.log("asking for id with key");
                    self.peer = new Peer({key:opts.key, debug: true});
                    self.peer.on("open", function(id){console.log(id);});
                } else {
                    self.peer = new Peer(id, {key:opts.key, debug: false});
                }
            }
            if(self.peer){
                console.log(self.peer);
                self.peer.on('error', function(error){
                    console.log(error);
                });
                self.peer.on('open', function(id){
                    console.log(id);
                    self.mesh = new Mesh(self.peer);
                    console.log(self.mesh);
                    self.mesh.on('data', handleData);
                });
                return self.peer;
            } else {
                console.log("need to fill something out");
                warn("need to fill something out");
            }
        }
        
        function handleData(data){
            var text = "";
            try {
                text = sjcl.decrypt(self.password, data.message);
            } catch(e){
                warn(e);
            }
            
            data.message = text;
            
            self.onupdate(data);
            self.messages.push(data);
        }
        
        function connect(id){
            console.log("connecting to " + id);
            self.mesh.connect(id);
        }
        
        function send(message){
            //I could add more info to the json..
            //encript
            var crypticMessage = message;
            if(message != "ping")
                crypticMessage = sjcl.encrypt(self.password, message);
            
            var msg = {
                from: self.mesh.peer.id,
               //meta: conn.metadata,
                message:crypticMessage
            };
            
            self.mesh.write(msg);
            
            msg.message = message;
            self.onupdate(msg);
            self.messages.push(msg);
        }
        
        this.send = send;
        this.host = host;
        this.connect = connect;
    }
    
    return Chat;
});