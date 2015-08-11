// Execution starts on line 118!

var roomNames = {};

var friends = [];

var app = {

    addFriend: function(friendName) {
      if (friends.indexOf(friendName) === -1) {
        friends.push(friendName);
      }
      else {
        friends.splice(friends.indexOf(friendName), 1);
      }
    },

    addMessage: function(message) {
      // Don't allow scripts to be injected into messages
      if (message.text && message.text.indexOf("<script>") === -1 && message.username.indexOf("<script>") === -1 ) {

        // only append messages with .roomname equal to the current room selected in the #roomSelect drop down
        var currentRoom = $('#roomSelect').val();
        if (message.roomname === currentRoom){

          // Check if the current message is posted by a friend by checking the message.username property to see
          // if it exists in the friends array. If it does, append the message with a red username and bold message text
          if (friends.indexOf(message.username) > -1) {
            $('#chats').append('<p class="chat"><span style="color: red;" class="username" >' + message.username + '</span>: <strong>' +
            message.text + '</strong></p>');
          }

          // If it's not posted by a friend, post the message with regular styling
          else {
            $('#chats').append('<p class="chat"><span class="username" >' + message.username + '</span>: ' +
              message.text + '</p>');
          }
        }
      }


    },

    addRoom: function() {
      // Get the new room name from the #newRoom input box, then clear the #newRoom input box
      var roomname = $('#newRoom').val();
      $('#newRoom').val('');

      // If that room doesn't already exist, add it to the drop down
      if (roomNames[roomname] === undefined){
        $('#roomSelect').append('<option value="' + roomname + '">' + roomname + '</option>');
      }
    },

    clearMessages: function() {
      $('#chats').html('');
    },

    // Sends a GET request to the server

    fetch: function() {
        $.ajax({
            url: app.server,
            type: 'GET',
            success: function(data) {

              // When the data is successfully retrieved, first we clear the chatbox
              app.clearMessages();

              // The "data" object has a property called "results" which contains an array of messages.
              // Next we iterate through all of the messages on the server
              for (var i = 0; i < data.results.length; i++) {

                // Call app.addMessage on each message
                app.addMessage(data.results[i]);

                // If the message is being posted to a room that is not yet in the roomNames object,
                // add the room as a key in the roomNames object
                var msgRoom = data.results[i].roomname;
                if (roomNames[msgRoom] === undefined) {
                  roomNames[msgRoom] = 0;
                }
              }

              // Iterate over the roomNames object and add all of the rooms to the #roomSelect drop down
              for (var key in roomNames) {
                if (roomNames[key] === 0) {
                  $('#roomSelect').append('<option value="' + key + '">' + key + '</option>');

                  // We only want to add each room ONCE, so set the value to 1 after it's added so it won't be added again
                  roomNames[key] = 1;
                }
              }
            }
        });
    },

    handleSubmit: function() {
      // Construct a message object to pass into app.send. Grab the text from the input textbox,
      // the username from the window.location.search string, and the roomname from the #roomSelect
      // drop down

      var newMessage = {};
      newMessage.text = $('input').val();
      newMessage.username = window.location.search.split('=')[1];
      newMessage.roomname = $('#roomSelect').val();
      app.send(newMessage);

      // After passing the message to app.send, clear the message text box
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

    // Server is easily changed for both send and fetch functions by changing it here
    server: "https://api.parse.com/1/classes/chatterbox"
};

// The document ready function handles user interaction

$( document ).ready(function(){

  // When the user submits text in the message box, we don't want to refresh the page,
  // which is the default behavior of form submission. So we must prevent default and then
  // call our handleSubmit function
  $('#send').on('submit', function(event) {
    event.preventDefault();
    app.handleSubmit();
  })

  // Same as above, we must prevent default behavior for submitting a new room, and call
  // our addRoom function
  $('#addRoom').on('submit',function(event) {
    event.preventDefault();
    app.addRoom();
  })

  // When a user clicks on a username, that user should be toggled on or off as a friend
  // We get the username by looking at event.target and checking the text it contains
  $('body').on('click','.username', function(event) {
    app.addFriend($(event.target).text());
  })
});

// Begin by setting up app.fetch() to call every 2 seconds
setInterval(app.fetch, 2000);
