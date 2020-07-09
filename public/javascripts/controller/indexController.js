app.controller('indexController' , ['$scope' , 'indexFactory', ($scope , indexFactory) => {        //Bunu da sayfamıza dahil ediyoruz.(layout.pug)

    const connectOptions = {
        connectionAttempts: 3,
        connectionDelay: 600
    };

    indexFactory.connectSocket('http://localhost:3000' , connectOptions)
        .then((socket) => {
            console.log('Bağlantı Gerçekleşti' , socket);
        }).catch((err) => {
            console.log(err);
        });
}]);


