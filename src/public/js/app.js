const socket = io();

const welcome = document.getElementById("welcome");
const form = welcome.querySelector("form");
const room = document.getElementById("room");

let roomName;

function addMessage(message) {
  const ul = room.querySelector("ul");
  const li = document.createElement('li');
  li.innerText = message;
  ul.appendChild(li);
}


room.hidden = true;

function handleMessageSubmit(event) {
  event.preventDefault();
  const input = room.querySelector("#msg input");
  const value = input.value;
  socket.emit("new_message", input.value, roomName, () => {
    addMessage(`You: ${value}`);
  });
  input.value="";
}

function handleNicknameSubmit(event) {
  event.preventDefault();
  const input = room.querySelector("#name input");
  socket.emit("nickname", input.value);
}

function showRoom() {
  welcome.hidden=true;
  room.hidden=false;
  const h3 = room.querySelector("h3");
  h3.innerText=`Room ${roomName}`;
  const msgForm = room.querySelector("#msg");
  const nameForm = room.querySelector("#name");
  msgForm.addEventListener("submit", handleMessageSubmit);
  nameForm.addEventListener("submit", handleNicknameSubmit);
}

function handleRoomSubmit(event) {
  event.preventDefault();
  const input = form.querySelector("input");
  roomName = input.value;
  socket.emit("enter_room",input.value, showRoom);
  input.value = "";
}

form.addEventListener("submit", handleRoomSubmit);


socket.on("welcome", (user) => {
  addMessage(`${user} joined!`);
})

socket.on("bye", (left) => {
  addMessage(`${left} left!`);
})

// socket.on("new_message",(msg) => addMessage(msg));
//아래랑 위는 같음
socket.on("new_message",addMessage);

socket.on("room_change", (rooms) => {
  const roomList = welcome.querySelector("ul");
  roomList.innerHTML = "";
  if(rooms.length === 0) {
    return;
  }
  
  rooms.forEach(room => {
    const li = document.createElement("li");
    li.innerText = room;
    roomList.append(li);
  });
});



//////////////////////////////////////////////websocket 내용////////////////////////////////////////////////////////////////

// const messageList = document.querySelector("ul");
// const nickForm = document.querySelector("#nick");
// const messageForm = document.querySelector("#message");


// const socket = new WebSocket(`ws://${window.location.host}`);


// socket.addEventListener("open", () => {
//     console.log("Connected to Server ✅");
//   });
  
// socket.addEventListener("message", (message) => {
//     const li = document.createElement("li");
//     li.innerText = message.data;
//     messageList.append(li);
// });

// socket.addEventListener("close", () => {
// console.log("Disconnected from Server ❌");
// });


// function makeMessage(type, payload) {
//     const msg = { type, payload };
//     return JSON.stringify(msg);
//   }

  
// function handleSubmit(event) {
//     event.preventDefault();
//     let input = messageForm.querySelector("input");
//     socket.send(makeMessage("new_message", input.value));

//     const li = document.createElement("li");
//     li.innerText = `You:${input.value}`;
//     messageList.append(li);

//     input.value = "";
//   }
  
//   function handleNickSubmit(event) {
//     event.preventDefault();
//     const input = nickForm.querySelector("input");
//     socket.send(makeMessage("nickname", input.value));
//   }


//   messageForm.addEventListener("submit", handleSubmit);
//   nickForm.addEventListener("submit", handleNickSubmit);
  