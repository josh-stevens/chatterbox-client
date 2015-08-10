// YOUR CODE HERE:

var app = {

    addFriend: function() {
        console.log("Friend added!");

    },

    addMessage: function(message) {
      if (message.text.indexOf("<script>") === -1) {
        $('#chats').append('<p class="chat"><span class="username" onclick="app.addFriend()">' + message.username + '</span>: ' +
          message.text + '</p>');
      }


    },

    addRoom: function(roomname) {
        $('#roomSelect').append('<option value="' + roomname + '">' + roomname + '</option>');
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
                }
            }
        })
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
});

setInterval(app.fetch, 2000);