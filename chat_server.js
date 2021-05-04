// require("dotenv").config({ path: "./config/config.env" });
// const express = require('express');
// const app = express();
// const http = require('http').Server(app);
// const io = require('socket.io')(http, {
//     origins: '*:*'
// });


// const connectDB = require("./config/db");
// connectDB();

// app.use('/public', express.static('public'));
// app.set('view engine', 'ejs');

// const db = require('./models');
// const Chat = db.chats;

// app.get('/', (req, res) => {
//     Chat.find({}).then(messages => {
//         res.render('index', { messages });
//     }).catch(err => console.error(err));
// });

// io.on('connection', socket => {
//     socket.on('chat', data => {
//         Chat.create({ name: data.handle, message: data.message }).then(() => {
//             io.sockets.emit('chat', data); // return data
//         }).catch(err => console.error(err));
//     });
//     socket.on('typing', data => {
//         socket.broadcast.emit('typing', data); // return data
//     });
// });

// // listen
// const PORT = process.env.CHAT_PORT || 4000;
// http.listen(PORT, () => {
//     console.log('Server is running on port:' + PORT);
// });



require("dotenv").config({ path: "./config/config.env" });
const express = require('express');
const connectDB = require("./config/db");
const methodOverride = require('method-override');
const moment = require('moment');
const cors = require("cors");
const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http, {
    origins: '*:*'
});

app.use(cors());
app.use(methodOverride());
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});
/* Config For Push Notification */
const admin = require('firebase-admin');
const serviceAccount = require("./config/privatekey.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://todo-ff43f.firebaseio.com"
});
const db = require('./models');
const Chat = db.chats;
const socket_list = [];

connectDB();

app.use('/public', express.static('public'));
app.set('view engine', 'ejs');

app.get('/', (req, res) => {
    Chat.find({}).then(messages => {
        res.status(200).send(messages);
        res.render('index', { messages });
    }).catch(err => console.error(err));
});

io.on('connection', (socket) => {
    socket.on('chat', data => {
        Chat.create({ 
            name: data.handle, 
            message: data.message 
        }).then(() => {
            io.sockets.emit('chat', data); // return data
        }).catch(err => console.error(err));
    });
    socket.on('typing', data => {
        socket.broadcast.emit('typing', data); // return data
    });


    
    socket.on('send_otp_code', (data) => {
        io.emit('get_otp_code' + data.uid, { code: data.code });
    });
    socket.on('disconnect', function () {
        remove_from_socket(socket);
    });
    socket.on('set_uid', (data) => {
        socket.u_id = data.u_id;
        add_to_socket(socket);
        change_chat_status(data.u_id);
    });
    socket.on('add-message', (message) => {
        var to_sock_id = find_from_socket(message.toUserId);
        io.emit('get_msg' + message.toUserId, message);
        if (to_sock_id != null) {
            // io.to(to_sock_id).emit('message', message);
            add_message(message, 1);
        } else {
            add_message(message, 0);
            var fcm_id = message.fcm_id;
            var msg = "New message from a task";
            var pass_data = {
                id: message.task_id,
                name: message.task_id,
                page_type: "3"
            };
            if (fcm_id != null) {
                push_notification(msg, pass_data, fcm_id);
            }
            console.log("User Not Connected");
        }
    });
});

const port = 4000;
http.listen(port, function () {
    console.log('listening in http://localhost:' + port);
});

function add_to_socket(socket) {
    if (socket_list.length > 0) {
        for (var i = 0; i < socket_list.length; i++) {
            if (socket_list[i].id == socket.id) {
                console.log("Socket Already Exists");
                return 0;
            }
        }
        socket_list.push(socket);
        // console.log("Total Clients Connected ",socket_list[0].u_id);
        console.log("Total Clients Connected " + socket_list.length);
    } else {
        socket_list.push(socket);
        // console.log("Total Clients Connected ",socket_list[0].u_id);
        console.log("Total Clients Connected " + socket_list.length);
    }
}
function remove_from_socket(socket) {
    console.log("Total Clients Connected " + socket_list.length);
    if (socket_list.length > 0) {
        for (var i = 0; i < socket_list.length; i++) {
            if (socket_list[i].id == socket.id) {
                socket_list.splice(i, 1);
                console.log("Socket Removed");
                console.log("Total Clients Connected " + socket_list.length);
                return 0;
            }
        }
    } else {
        console.log("Total Clients Connected " + socket_list.length);
    }
}
function find_from_socket(u_id) {
    if (socket_list.length > 0) {
        for (var i = 0; i < socket_list.length; i++) {
            if (socket_list[i].u_id == u_id) {
                return socket_list[i].id;
            }
        }
    }
    return null;
}
function add_message(msg, status) {
    Chat.create({
        task_id: msg.task_id,
        sent_from: msg.userId,
        sent_to: msg.toUserId,
        message: msg.text,
        sent_time: msg.time,
        status: status
    }, function (err, user) {
        if (err) {
            console.log(err);
        }
        console.log("Data Saved");
    });
}
function change_chat_status(uid) {
    console.log("uid = " + uid);
    var query = {
        sent_to: uid,
        status: 0
    };
    Chat.updateMany({ "sent_to": uid, "status": 0 }, { "status": 1 }, function (err2, res) {
        if (err2) console.log(err2);
    });
}
function push_notification(msg, pass_data, fcm_id) {
    var created = moment(new Date()).format("MMM, DD YYYY HH:mm:ss");
    var count = Math.floor(Math.random() * 9999999) + 1;
    var payload = {
        data: {
            body: msg + " " + created,
            sound: "default",
            ledColor: "[0, 0, 0, 255]",
            id: pass_data.id.toString(),
            page_type: pass_data.page_type.toString(),
            task_name: pass_data.name,
            notId: count.toString(),
            overdue: "0"
        }
    };
    var options = {
        priority: "high",
        timeToLive: 60 * 60 * 24
    };
    admin.messaging().sendToDevice(fcm_id, payload, options)
        .then(function (response) {
            console.log("Successfully sent message:", response);
            if (response.results[0].error) {
                console.log(response.results[0].error);
            }
        })
        .catch(function (error) {
            console.log("Error sending message:", error);
        });
}