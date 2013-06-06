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

require(['app', './alert'], function (app, warn) {
    'use strict';
    $().alert();
    
    
    document.getElementById('connect').addEventListener('click', createPeer ,false);
    
    
    
    function createPeer(event){

//        var peer_options = {
//            id: "",
//            host: 'localhost',
//            port: 8000
//        };
        
        var peer_options = {
            key: "5e62xgu1fv67p66r",
            id: document.getElementById('local_id_string').value
        }
        
        console.log(peer_options);
        var listRef = new Firebase('https://p2p-chat.firebaseio.com/user-list');
        var App = new app(peer_options, listRef);
        //var peer = chat.host(peer_options.id, peer_options);
        App.peer.on('error', function(msg){
            console.log(msg);
            warn(msg);
        });
        
        App.onchat = function(chat){
            var chatui = new Chat();
            //add chatui to screen
            document.getElementById('chat_room').addSection(chatui, chat.friend.peer);
            document.getElementById(chat.friend.peer+"_chat").addEventListener('send', function(evt){
                console.log("sending", evt);
                chat.send(evt.detail.message);
            }, false);
            chat.onmessage = function(msg){
                document.getElementById(chat.friend.peer+"_chat").addMessage(msg.from, msg.message);
            }
        }
        
        function handleUsers(snapshot){
            console.log(snapshot);
            var msgData = snapshot.val();
            if(msgData == document.getElementById('local_id').innerHTML)
                return;
            console.log(msgData);
            var newPerson = document.getElementById('user_list').addItem(msgData, {
                class:"user"
            });
            
            newPerson.addEventListener('click', function call(evt){
                if(App.chats[newPerson.innerHTML] !== undefined){
                    document.getElementById('chat_room').viewSection(newPerson.innerHTML);
                }else{
                    var chat = App.call(newPerson.innerHTML, "password");
                }
            }, false);
        }
        
        //var listRef = new Firebase('https://p2p-chat.firebaseio.com/user-list');
        //listRef.on('value', handleUsers);
        listRef.on('child_added', handleUsers);
        
        listRef.on('child_removed', function(oldChildSnapshot) {
          console.log("removed", oldChildSnapshot);
          document.getElementById('user_list').removeItem(oldChildSnapshot.val());
        });
        
        $('#settings').modal('hide');
    }
    $('#settings').modal('show');
    
    // use app here
    //console.log(app);
    console.log('Running jQuery %s', $().jquery);
});