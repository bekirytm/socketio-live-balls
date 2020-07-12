//Burası Websocket Client Tarafı

app.controller('indexController' , ['$scope' , 'indexFactory', ($scope , indexFactory) => {        //Bunu da sayfamıza dahil ediyoruz.(layout.pug)

    $scope.messages = [ ];
    $scope.players = { };

    $scope.init = () => {
        const username = prompt('Please enter username');

        if (username)
            initSocket(username);
        else
            return false;
    };

    function scroolTop() {
        setTimeout(()=> {
            const element = document.getElementById('chat-area');
            element.scrollTop = element.scrollHeight;
        });
    }
    
    function showBubble(id, message) {
        $('#' + id).find('.message').show().html(message);

        setTimeout(() => {
            $('#' + id).find('.message').hide();
        }, 2000);
    }

    function initSocket(username) {
        const connectOptions = {
            connectionAttempts: 3,
            connectionDelay: 600
        };

        indexFactory.connectSocket('http://localhost:3000' , connectOptions)
            .then((socket) => {
                socket.emit('newUser' ,  { username });

                socket.on('initPlayers' , (players) => {
                    $scope.players = players;
                    $scope.$apply();
                });

                //Karşılama ve mesajlara ekleme
                socket.on('newUser', (data) => {
                    const messageData = {
                        type: {
                            code: 0,        // server or user message
                            message: 1      // login or disconnect message
                        },
                        username: data.username
                    };
                    $scope.messages.push(messageData);
                    $scope.players[data.id] = data;
                    scroolTop();
                    $scope.$apply();
                });

                socket.on('disUser' , (data) => {
                    const messageData = {
                        type: {
                            code: 0,        // server or user message
                            message: 1      // login or disconnect message
                        },
                        username: data.username
                    };

                    $scope.messages.push(messageData);
                    delete $scope.players[data.id];
                    scroolTop();
                    $scope.$apply();
                });

                //Animate Karşılama
                socket.on('animate' , (data) => {
                    $('#'+ data.socketId).animate({'left': data.x , 'top': data.y } , () => {
                        animate = false;
                    });
                });

                socket.on('newMessage' , (message) => {
                    $scope.messages.push(message);
                    $scope.$apply();
                    showBubble(message.socketId , message.text );
                    scroolTop();
                });

                //Animations
                let animate = false;
                $scope.onClickPlayer = ($event) => {
                    if(!animate){
                        let x = $event.offsetX;
                        let y = $event.offsetY;
                        socket.emit('animate' , { x, y });

                        animate = true;
                        $('#'+ socket.id).animate({'left': x , 'top': y } , () => {
                            animate = false;
                        });
                    }
                };

                $scope.newMessage = () => {
                  let message = $scope.message;
                  const messageData = {
                      type: {
                          code: 1,        // server or user message
                      },
                      username: username,
                      text : message
                  };
                  $scope.messages.push(messageData);
                  $scope.message = '';

                  socket.emit('newMessage' , messageData);

                  showBubble(socket.id , message);
                  scroolTop();
                };


            }).catch((err) => {
                console.log(err);
            });
    }
}]);


