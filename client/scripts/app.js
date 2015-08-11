// YOUR CODE HERE:

var roomNames = {};

var friends = [];

var app = {

    addFriend: function() {
        console.log("Friend added!");
      friends.push()
    },

    addMessage: function(message) {
      if (message.text && message.text.indexOf("<script>") === -1) {
        // only append messages with .roomname equal to the current room
        var currentRoom = $('#roomSelect').val();
        if (message.roomname === currentRoom){
          $('#chats').append('<p class="chat"><span class="username" >' + message.username + '</span>: ' +
            message.text + '</p>');
        }
      }


    },

    addRoom: function() {
        var roomname = $('#newRoom').val();
        $('#newRoom').val('');
        if (roomNames[roomname] === undefined){
          $('#roomSelect').append('<option value="' + roomname + '">' + roomname + '</option>');
        }
    },

    clearMessages: function() {
        $('#chats').html('');
    },

    fetch: function() {
        $.ajax({
            url: app.server,
            type: 'GET',
            success: function(data) {
              app.clearMessages();
              for (var i = 0; i < data.results.length; i++) {
                  app.addMessage(data.results[i]);
                  var msgRoom = data.results[i].roomname;
                  if (roomNames[msgRoom] === undefined) {
                    roomNames[msgRoom] = 0;
                  }

              }

              console.log(roomNames);
              for (var key in roomNames) {
                if (roomNames[key] === 0) {
                  $('#roomSelect').append('<option value="' + key + '">' + key + '</option>');
                  roomNames[key] = 1;
                }
              }
            }
        });
    },

    handleSubmit: function() {
      var newMessage = {};
      newMessage.text = $('input').val();
      newMessage.username = window.location.search.split('=')[1];
      newMessage.roomname = $('#roomSelect').val();
      app.send(newMessage);
      $('#message').val('');

    },

    init: function(){

    },

    send: function(message){
        $.ajax({
            url: app.server,
            type: 'POST',
            data: JSON.stringify(message),
            contentType: 'application/json',
            success: function (data) {
                console.log('chatterbox: Message sent');
            },
            error: function (data) {
                console.error('chatterbox: Failed to send message');
            }
        });
    },

    server: "https://api.parse.com/1/classes/chatterbox"
};

$( document ).ready(function(){
  $('#send').on('submit', function(event) {
    event.preventDefault();
    app.handleSubmit();
  })
  $('#addRoom').on('submit',function(event) {
    event.preventDefault();
    app.addRoom();
  })
  $('body').on('click','.username', function(event) {
    app.addFriend();
  })
});

setInterval(app.fetch, 2000);
