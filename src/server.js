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

io.on("connection", (socket) => {
    socket.on("enter_room", (msg, done) => {
        console.log(msg);
        setTimeout(() => {
          done();
        }, 3000);
    });
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


