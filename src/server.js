import http from "http";
import WebSocket from 'ws';
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
const wss = new WebSocket.Server({server});

// server는 꼭 써야되는거아님, websocket 서버만 쓰려면 wss 사용해도 될듯함
server.listen(3000,handleListen);

