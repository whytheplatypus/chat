require.config({
    paths: {
        jquery: 'vendor/jquery/jquery',
        bootstrap: 'vendor/bootstrap/index',
        sjcl: 'vendor/sjcl/index'
    },
    urlArgs: "bust=" +  (new Date()).getTime(),
    shim: {
        boostrap: {
            deps: ['jquery'],
            exports: 'jquery'
        },
        sjcl: {
            exports: 'sjcl'
        }
    }
});

require(['app', 'jquery', 'bootstrap'], function (app, $) {
    'use strict';
    var startScreen = document.getElementById('setup');
    var chatRoom = document.getElementById('chat_room');
    
    var localIdString = document.getElementById("local_id_string");
    var startButton = document.getElementById("start");
    
    var passwordString = document.getElementById('password_string');
    var setPassword = document.getElementById('set_password');
    
    var localID = document.getElementById("local_id");
    
    var idString = document.getElementById("id_string");
    var connect = document.getElementById("connect");
    
    var messages = document.getElementById("messages");
    var messageInput = document.getElementById("message_input");
    var sendButton = document.getElementById("send");
    
    startButton.addEventListener('click', function(){
        var chat = new app();
        var peer = chat.host(localIdString.value, {
            url: document.getElementById('server_url').value, 
            port: document.getElementById('server_port').value,
            key: document.getElementById('peerjs_key').value
        });
        peer.on('error', function(msg){
            console.log(msg);
            document.getElementById('set_id').innerHTML("Something when wrong.. that ID may have already been taken.  Try Another one:")
        });
        peer.on('open', function(id){
            console.log(id);
            localID.innerHTML = id;
            
            connect.addEventListener("click", function(){
                chat.connect(idString.value);
            }, false);
            
            setPassword.addEventListener("click", function(){
                chat.password = passwordString.value;
            }, false);
            
            sendButton.addEventListener("click", function(){
                chat.send(messageInput.value);
            }, false);
            
            //could switch this to height to get cool transitions?
            startScreen.style.display = 'none';
            chatRoom.style.display = 'block';
        });
        
        chat.onupdate = function(msg){
            var message = document.createElement("p");
            message.innerHTML = msg.from+" : "+msg.message;
            //eventually also have it put this through a markdown parser
            messages.appendChild(message);
        };
        
    }, false);
    
    // use app here
    console.log(app);
    console.log('Running jQuery %s', $().jquery);
});