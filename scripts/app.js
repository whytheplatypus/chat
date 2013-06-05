/*global define */
define(['./alert', './chat'], function (warn, Chat) {
    'use strict';
    
    var App = function(peer_options, usersRef){
        var self = this;
        
        self.chats = {};
        if(peer_options.id == ""){
            console.log(peer_options.key);
            self.peer = new Peer({key:peer_options.key, debug: false});
        } else {
            self.peer = new Peer(peer_options.id, {key:peer_options.key, debug: false});
        }
        //self.peer = new Peer(peer_options.id, {host:peer_options.host, port:peer_options.port, debug: true});
        if(self.peer){
            console.log(self.peer);
            self.peer.on('error', function(error){
                console.log(error);
            });
            self.peer.on('connection', function setupConnection(conn){
                self.chats[conn.peer] = new Chat(self.peer, conn, conn.metadata.password);
                self.onchat(self.chats[conn.peer]);
            });
            self.peer.on('open', function(id){
                document.getElementById('local_id').innerHTML = id;
                var idRef = usersRef.push(id);
                window.onbeforeunload = function(){
                    idRef.remove();
                }
            });
        } else {
            console.log("need to fill something out");
            warn("need to fill something out");
        }
        
        
        
        function _call(id, password){
            var conn = self.peer.connect(id, {'metadata':{'password': password}});
            self.chats[conn.peer] = new Chat(self.peer, conn, conn.metadata.password);
            self.onchat(self.chats[conn.peer]);
            return self.chats[conn.peer];
        };
        
        self.call = _call;
    }
    
    return App;
});