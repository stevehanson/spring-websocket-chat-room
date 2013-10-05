var app = angular.module('angchat', []);

app.filter('reverse', function() {
  return function(items) {
    return items.slice().reverse();
  };
});

// angular.module('angchat.services', [])
//   .factory('stompService', [function() {

//     var socket = new SockJS('/chatter/portfolio');
//     var stompClient = Stomp.over(socket);

//     return {
//       stompClient: stompClient
//     };
// }]);

// app.factory('stompService', [function() {

//     var socket = new SockJS('/chatter/portfolio');
//     var stompClient = Stomp.over(socket);

//     return {
//       stompClient: stompClient
//     };
// }]);

app.controller('ChatCtrl', ['$scope', function($scope) {
  $scope.chats = [
    {from:'Steve', to: 'Bill', message: 'Hey Bill', direction: 'outgoing'},
    {from:'Bill', to: 'Steve', message: 'Oh.. hey Steve', direction: 'incoming'}
  ];
  console.log($scope);
  $scope.chats.push({from:'Bill', to: 'Steve', message: 'Oh.. hey Steve', direction: 'incoming'});

  
  //stompClient = stompService.stompClient;

  stompClient.connect('steve', 'pass', function(frame) {

    console.log('Connected ' + frame);
    userName = frame.headers['user-name'];
    var queueSuffix = frame.headers['queue-suffix'];
   
    stompClient.subscribe("/queue/time-updates", function(message) {
      $('#notifications').html('<span>' + JSON.parse(message.body) + '</span>');
    });
    
    
    stompClient.subscribe("/queue/chats" + queueSuffix, function(message) {
      console.log("Received chat! ::");
      message = JSON.parse(message.body);
      message.direction = 'incoming';
      console.log(message);
      console.log($scope);
      $scope.chats.push(message);
      $scope.$apply();
      // console.log(message);
      // $('#chats').prepend(
      //     '<div class="incoming chat"><span class="from">' 
      //       + message.from + 
      //       '</span><span class="message">' + message.message + '</span</div>').fadeIn(); 
    });
    
    stompClient.subscribe('/app/join');
    
    // be notified of other joins
    stompClient.subscribe("/topic/join", function(message) {
      console.log(message);
      message = JSON.parse(message.body);
      $('#to').append('<option value="' + message + '">' + message + '</option>');
      $('#joinedChat').text(message + ' has joined the chat!').fadeIn(100).delay(2000).fadeOut(200);
      console.log('new user joined');
      console.log(message);
    });
    
    stompClient.subscribe("/app/test", function(message) {
      console.log("SUBSCRIBED TO TEST: " + JSON.parse(message.body));
    });
    
     $('#chatForm').submit(function(e) {
        chat = {
            to: $('#to').val(),
            message: $('#message').val(),
            from: userName
        };

        stompClient.send("/app/chat", {}, JSON.stringify(chat));
        
        chat.from = 'Me';
        chat.direction = 'outgoing';
        //client.send("/app/chat", {}, JSON.stringify({message: "This is an auto test", from: "BILL"}));
        $scope.chats.push(chat);
        $scope.$apply();

        $('#message').val('');
        $('#message').focus();
        
        e.preventDefault();
      });

  });


 
  $scope.addChat = function(chat) {
    $scope.chats.push(chat);
    //$scope.todoText = '';
  };
 
 
}]);