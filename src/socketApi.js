//Burası WebSocket Server Tarafı

const socketio = require('socket.io');
const io = socketio();

const socketApi = { };
socketApi.io = io;

const users = [ ];

io.on('connection' , (socket) => {
    console.log("Bir kullanıcı bağlandı");


    socket.on('newUser' , (data) => {   //Burası yeni kullanıcı geldiğinde kaydetme yeri.(username,socket.id,position)
        const defaultData = {
            id: socket.id,
            position : {
                x: 0,
                y: 0
            }
        };


        //Burada iki farklı objeyi birleştiriyoruz. (kullanıcıdan gelen username , default veriler )
        const userData = Object.assign(data , defaultData);
        users.push(userData);   //Bu array'in içine attık.
        console.log(users);
    });

});

module.exports = socketApi;