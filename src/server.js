import http from "http";
import SocketIo from "socket.io"
// import WebSocket from 'ws';
import express from "express";

const app = express();

app.set("view engine", "pug")
app.set("views",__dirname + "/views");
app.use("/public", express.static(__dirname+"/public"));
app.get("/", (req,res) => res.render("home"));
app.get("/*", (_,res) => res.redirect("/"));

const handleListen = () => console.log(`Listening on http://localhost:3000`);

// app.listen(3000, handleListen);
const server = http.createServer(app);
const io = SocketIo(server);


function publicRooms() {
    const {sockets: { adapter: { sids, rooms } } } = io;
    
    const publicRooms = [];
    rooms.forEach((_, key) => {
      if (sids.get(key) === undefined) {
        publicRooms.push(key);
      }
    });
    return publicRooms;
  }

io.on("connection", (socket) => {

    io.sockets.emit("room_change", publicRooms());
    socket["nickname"]= "Anon";

    socket.onAny((event, ...args) => {
        console.log(io.sockets.adapter);
        console.log(`Socket Event: ${event}`);
      });


    socket.on("enter_room", (roomName, done) => {
        socket.join(roomName);
        // console.log(socket.rooms);
        done();
        socket.to(roomName).emit("welcome", socket.nickname);

        // sockets.emit 은 모든 socket에 메세지를 보냄
        io.sockets.emit("room_change", publicRooms());
    });

    socket.on("disconnecting", () => {
        socket.rooms.forEach(room => {
            socket.to(room).emit("bye", socket.nickname)
        });
    })

    socket.on("disconnect", () => {
        io.sockets.emit("room_change", publicRooms());
    })

    socket.on("new_message", (msg,room,done) => {
        socket.to(room).emit("new_message", `${socket.nickname} : ${msg}`);
        done();
    })

    socket.on("nickname", (nickname) => (socket["nickname"] = nickname));
});


server.listen(3000,handleListen);


// 아래 websocket 쓸 떄 코드
/* 
const wss = new WebSocket.Server({server});
const sockets =[];
wss.on("connection", (socket) => {
    sockets.push(socket);
    socket["nickname"] = "Anonymous";
    console.log("Connected to Browser ✅");
    socket.on("close", () => console.log("Disconnected from the Browser ❌"));
    socket.on("message", (msg) => {
        const message = JSON.parse(msg);
        switch (message.type) {
        case "new_message":
            sockets.forEach((aSocket) =>
            aSocket.send(`${socket.nickname}: ${message.payload}`)
            );
        case "nickname":
            socket["nickname"] = message.payload;
        }
    });
  }); */


// server는 꼭 써야되는거아님, websocket 서버만 쓰려면 wss 사용해도 될듯함


