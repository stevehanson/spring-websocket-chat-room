var app = angular.module('angchat', []);

app.filter('reverse', function() {
  return function(items) {
    return items.slice().reverse();
  };
});

app.directive('ngFocus', function() {
    return function(scope, element, attrs) {
      element.bind('click', function() {
        $('.' + attrs.ngFocus)[0].focus();
      });
    };
});

app.factory('socket', function($rootScope) {

    var socket = new SockJS('/chatter/portfolio');
    var stompClient = Stomp.over(socket);
    stompClient.connect('steve', 'pass', function(frame) {
      $rootScope.$broadcast('sockConnected', frame);
    });

    return {
      stompClient: stompClient
    };
});

app.controller('ChatCtrl', ['$rootScope', '$scope', 'socket', function($rootScope, $scope, socket) {
  $scope.chats = [];
  stompClient = socket.stompClient;

  $scope.$on('sockConnected', function(event, frame) {

    userName = frame.headers['user-name'];
    queueSuffix = frame.headers['queue-suffix'];

    stompClient.subscribe("/queue/time-updates", function(message) {
      $('#notifications').html('<span>' + JSON.parse(message.body) + '</span>');
    });
    
    
    stompClient.subscribe("/queue/chats" + queueSuffix, function(message) {
      message = JSON.parse(message.body);
      message.direction = 'incoming';
      $scope.addChat(message);
      $scope.$apply(); // since inside closure
    });
    
    
  });

  $scope.$on('sendingChat', function(event, chat) {
    $scope.addChat({'from': 'Me', 'to': chat.to, 'message': chat.message, 'direction': 'outgoing'});
  });

 
  $scope.addChat = function(chat) {
    $scope.chats.push(chat);
    //$scope.$apply();
  };
 
 
}]);



app.controller('FormCtrl', ['$rootScope', '$scope', 'socket', function($rootScope, $scope, socket) {
  $scope.users = [];
  $scope.stompClient = socket.stompClient;
  stompClient = socket.stompClient;

  $scope.$on('sockConnected', function(event, frame) {

    $scope.userName = frame.headers['user-name'];
    $scope.queueSuffix = frame.headers['queue-suffix'];
   
    // stompClient.subscribe("/queue/time-updates", function(message) {
    //   $('#notifications').html('<span>' + JSON.parse(message.body) + '</span>');
    // });
    
    // be notified of other joins
    $scope.stompClient.subscribe("/topic/join", function(message) {
      console.log(message.body);
      user = JSON.parse(message.body);
      console.log($scope.users);
      if(user != userName && $.inArray(user, $scope.users) == -1) {
        $scope.addUser(user);
        $scope.latestUser = user;
        $scope.$apply();
        $('#joinedChat').fadeIn(100).delay(2000).fadeOut(200);
      }
      
    });

    $scope.stompClient.subscribe('/app/join', function(message) {
      console.log("All users: " );
      console.log(message);
      $scope.users = JSON.parse(message.body);
      $scope.$apply();
    });
    
  });

  $scope.sendMessage = function(chat) {
    console.log(chat);
    chat.from = $scope.userName;
    $scope.stompClient.send("/app/chat", {}, JSON.stringify(chat));
        
    $rootScope.$broadcast('sendingChat', chat);
    
    $scope.chat.message = '';       

  };

  $scope.capitalize = function(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  };
 
  $scope.addUser = function(user) {
    $scope.users.push(user);
    $scope.$apply();
  };
 
 
}]);