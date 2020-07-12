//Burası WebSocket Server Tarafı

const socketio = require('socket.io');
const io = socketio();

const socketApi = { };
socketApi.io = io;

const users = { };

//helpers
const randomColor = require('../helpers/randomColor');

io.on('connection' , (socket) => {
    console.log("Bir kullanıcı bağlandı");

    socket.on('newUser' , (data) => {   //Burası yeni kullanıcı geldiğinde kaydetme yeri.(username,socket.id,position)
        const defaultData = {
            id: socket.id,
            position : {
                x: 0,
                y: 0
            },
            color: randomColor()
        };

        //Burada iki farklı objeyi birleştiriyoruz. (kullanıcıdan gelen username , default veriler )
        const userData = Object.assign(data , defaultData);
        users[socket.id] = userData;   //Bu array'in içine attık.
        // console.log(users);

        socket.broadcast.emit('newUser' , users[socket.id] );   //Kullanıcı giriş yaptığında diğerlerine söyleme işlemi
        socket.emit('initPlayers' , users); //O kullanıcıya mesaj gönderme
    });


    //Kullanıcının ayrılası durumunda diğer kullanıcılara emit işlemi
    socket.on('disconnect' , () => {
        socket.broadcast.emit('disUser' , users[socket.id]);
        delete users[socket.id];
        // console.log(users);
    });

    //Kullanıcı hareketlerinin herkese gönderilmesi
    socket.on('animate' , (data) => {
        users[socket.id].position.x = data.x;
        users[socket.id].position.y = data.y;

        socket.broadcast.emit('animate' , {
            socketId: socket.id,
            x: data.x,
            y: data.y
        });
    });

    socket.on('newMessage' , (data) =>  {
        socket.broadcast.emit('newMessage' , data);
    });

});

module.exports = socketApi;

