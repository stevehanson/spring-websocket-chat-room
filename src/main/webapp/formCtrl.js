app.controller('FormCtrl', ['$rootScope', '$scope', 'socket', function($rootScope, $scope, socket) {
    
    $scope.users = [];
    $scope.stompClient = socket.stompClient;

    $scope.$on('sockConnected', function(event, frame) {

        $scope.userName = frame.headers['user-name'];
        $scope.queueSuffix = frame.headers['queue-suffix'];
        
        // be notified of other joins
        $scope.stompClient.subscribe("/topic/join", function(message) {
            user = JSON.parse(message.body);
            if(user != userName && $.inArray(user, $scope.users) == -1) {
                $scope.addUser(user);
                $scope.latestUser = user;
                $scope.$apply();
                $('#joinedChat').fadeIn(100).delay(2000).fadeOut(200);
            }
            
        });

        $scope.stompClient.subscribe('/app/join', function(message) {
            $scope.users = JSON.parse(message.body);
            $scope.$apply();
        });
        
    });

    $scope.sendMessage = function(chat) {
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