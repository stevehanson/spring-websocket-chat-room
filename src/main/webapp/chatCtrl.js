app.controller('ChatCtrl', ['$rootScope', '$scope', 'socket', function($rootScope, $scope, socket) {
    
    $scope.chats = [];
    $scope.stompClient = socket.stompClient;

    $scope.$on('sockConnected', function(event, frame) {

        userName = frame.headers['user-name'];
        queueSuffix = frame.headers['queue-suffix'];

        
        $scope.stompClient.subscribe("/queue/chats" + queueSuffix, function(message) {
            message = JSON.parse(message.body);
            message.direction = 'incoming';
            $scope.addChat(message);
            $scope.$apply(); // since inside closure
        });
        
        
    });

    $scope.$on('sendingChat', function(event, sentChat) {
        chat = angular.copy(sentChat);
        chat.from = 'Me';
        chat.direction = 'outgoing';
        $scope.addChat(chat);
    });

 
    $scope.addChat = function(chat) {
        $scope.chats.push(chat);
        //$scope.$apply();
    };
 
 
}]);