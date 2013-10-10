app.controller('ChatCtrl', ['$rootScope', '$scope', 'socket', function($rootScope, $scope, socket) {
    
    $scope.chats = [];
    $scope.stompClient = socket.stompClient;

    $scope.$on('sockConnected', function(event, frame) {

        $scope.userName = frame.headers['user-name'];
        queueSuffix = frame.headers['queue-suffix'];

        
        $scope.stompClient.subscribe("/queue/chats" + queueSuffix, function(message) {
            $scope.processIncomingMessage(message, false);
        });

        $scope.stompClient.subscribe("/queue/chats", function(message) {
            $scope.processIncomingMessage(message, true);
        });
        
        
    });

    $scope.$on('sendingChat', function(event, sentChat) {
        chat = angular.copy(sentChat);
        chat.from = 'Me';
        chat.direction = 'outgoing';
        $scope.addChat(chat);
    });

    $scope.processIncomingMessage = function(message, isBroadcast) {
        message = JSON.parse(message.body);
        message.direction = 'incoming';
        message.broadcast = isBroadcast;
        if(message.from != $scope.userName) {
        	$scope.addChat(message);
            $scope.$apply(); // since inside subscribe closure
        }
    };

 
    $scope.addChat = function(chat) {
        $scope.chats.push(chat);
    };
 
 
}]);