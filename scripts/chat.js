/*global define */
define(['sjcl', './alert'], function (sjcl, warn) {
    'use strict';

    
    var Chat = function(me, friend, password){
        var self = this;
        
        //this.mesh = false;
        this.peer = me;
        this.password = password || 'password';
        this.messages = [];
        this.friend = friend;
        
        //This should be overridden
        /*this.onupdate = function(msg){
            console.log(msg);
        }*/
        
        function handleData(data){
//            var text = "";
//            try {
//                text = sjcl.decrypt(self.password, data.message);
//            } catch(e){
//                warn(e);
//            }
//            
//            data.message = text;
            
            self.onmessage(data);
            self.messages.push(data);
        }
        
        function send(message){
            //I could add more info to the json..
            //encript
            var crypticMessage = message;
            console.log(message);
            //crypticMessage = sjcl.encrypt('password', message);
            
            var msg = {
                from: self.peer.id,
               //meta: conn.metadata,
                message:crypticMessage
            };
            
            friend.send(msg);
            
            msg.message = message;
            //self.onupdate(msg);
            self.onmessage(msg);
            self.messages.push(msg);
        }
        
        friend.on('data', handleData);
        
        this.send = send;
    }
    
    return Chat;
});