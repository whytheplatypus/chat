/*global define */
define(['sjcl'], function (sjcl) {
    'use strict';
    
    var Chat = function(){
        var self = this;
        this.peer = false;
        this.password = "password";
        //this.incomming = [];
        this.outgoing = {};
        this.messages = [];
        
        //This should be overridden
        this.onupdate = function(msg){
            console.log(msg);
        }
        
        function host(id, opts){
            self.peer = false;
            if(opts.url !== "" && opts.port !== ""){
                if(id === ""){
                    console.log("asking for id");
                    self.peer = new Peer({host: opts.url, port:opts.port, debug: false});
                } else {
                    self.peer = new Peer(id, {host: opts.url, port:opts.port, debug: true});
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
                    
                    //need a remove connection too
                    //self.incomming.push(conn);
                    conn.on('data', function(data) {
                        console.log('Got data:', data);
                        var message = {
                            from: conn.peer,
                            meta: conn.metadata,
                            message:sjcl.decrypt(self.password, data)
                        };
                        self.onupdate(message);
                        self.messages.push(message);
                    });
                    self.outgoing[conn.peer] = {open: false};
                });
                return self.peer;
            } else {
                console.log("need to fill something out");
                throw "need to fill something out";
            }
        }
        function connect(id){
            console.log("connecting to "+id);
            var conn = self.peer.connect(id);
            /*conn.on('open', function() {
              conn.send('Hello world!');
            });
            conn.on('data', function(data){
              console.log('Got data:', data);
            });*/
            //still have to be able to remove connections.. i think there's an event
            self.outgoing[id] = conn;
            
            return conn;
        }
        
        function send(message){
            //I could add more info to the json..
            //encript
            for(var key in self.outgoing){
                if(self.outgoing[key].open){
                    self.outgoing[key].send(sjcl.encrypt(self.password, message));
                } else {
                    var conn = connect(key);
                    conn.on('open', function() {
                        conn.send(sjcl.encrypt(self.password, message));
                    });
                }
            }
            var msg = {
                from: self.peer.id,
               //meta: conn.metadata,
                message:message
            };
            self.onupdate(msg);
            self.messages.push(msg);
        }
        
        this.send = send;
        this.host = host;
        this.connect = connect;
    }
    
    return Chat;
});