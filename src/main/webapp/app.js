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


app.controller('RandomFactCtrl', ['$rootScope', '$scope', 'socket', function($rootScope, $scope, socket) {
    
    $scope.stompClient = socket.stompClient;
    console.log("RANDOM1");
    $scope.$on('sockConnected', function(event, frame) {

        userName = frame.headers['user-name'];
        queueSuffix = frame.headers['queue-suffix'];
        console.log("RANDOM");
        $scope.stompClient.subscribe("/queue/random-fact", function(message) {
            $scope.fact = JSON.parse(message.body);
            $scope.$apply();
        });
        
        
        
    });
 
}]);