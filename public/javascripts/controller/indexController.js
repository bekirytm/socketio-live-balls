//Burası Websocket Client Tarafı

app.controller('indexController' , ['$scope' , 'indexFactory', ($scope , indexFactory) => {        //Bunu da sayfamıza dahil ediyoruz.(layout.pug)


    $scope.init = () => {
        const username = prompt('Please enter username');

        if(username){
            initSocket(username);
        }
        else{
            return false;
        }

    };

    function initSocket(username) {
        const connectOptions = {
            connectionAttempts: 3,
            connectionDelay: 600
        };

        indexFactory.connectSocket('http://localhost:3000' , connectOptions)
            .then((socket) => {
                socket.emit('newUser' ,  { username });
            }).catch((err) => {
                console.log(err);
            });
    }



}]);


