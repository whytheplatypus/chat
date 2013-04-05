require.config({
    paths: {
        sjcl: 'vendor/sjcl/index',
        marked: 'vendor/marked/lib/marked'
    },
    urlArgs: "bust=" +  (new Date()).getTime(),
    shim: {
        sjcl: {
            exports: 'sjcl'
        }
    }
});

require(['app', './alert', 'marked'], function (app, warn, marked) {
    'use strict';
    $().alert();
    marked.setOptions({
      gfm: true,
      tables: true,
      breaks: false,
      pedantic: false,
      sanitize: true,
      smartLists: true,
      langPrefix: 'language-'
    });
    
    var passwordString = document.getElementById('password_string');
    var setPassword = document.getElementById('set_password');
    
    var localID = document.getElementById("local_id");
    
    var idString = document.getElementById("id_string");
    var connect = document.getElementById("connect");
    
    var messages = document.getElementById("messages");
    var messageInput = document.getElementById("message_input");
    var sendButton = document.getElementById("send");
    
    document.getElementById('create_peer').addEventListener('click', createPeer ,false);
    
    function createPeer(event){
        /*
        var peer_options = {
            key: this.form.key.value,
            host: this.form.host.value,
            port: this.form.port.value,
            id: this.form.id.value
        };
        */
        var peer_options = {
            id: "",
            host: 'localhost',
            port: 8000
        };
        
        console.log(peer_options);
        var chat = new app();
        var peer = chat.host(peer_options.id, peer_options);
        peer.on('error', function(msg){
            console.log(msg);
            warn(msg);
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
            
        });
        
        chat.onupdate = function(msg){
            var message = document.querySelector('#message_template');
            message.content.querySelector('h6').innerHTML = msg.from;
            message.content.querySelector('div').innerHTML = marked(msg.message);
            
            messages.appendChild(message.content.cloneNode(true));
        };
        $('#settings').modal('hide');
    }
    createPeer(false);
    //$('#settings').modal('show');
    
    // use app here
    //console.log(app);
    console.log('Running jQuery %s', $().jquery);
});