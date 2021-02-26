import express from "express";
import WSServer from 'express-ws';
const { app, getWss } = WSServer(express());
import { v4 as uuidv4 } from 'uuid';

const aWss = getWss();
import cors from "cors";

const PORT = process.env.PORT || 5000;


app.use(cors());
app.use(express.json());

const todos = [{id:1, text:"Сходить в магазин"},{id:2, text:"Потестить вебсокеты"}]

app.ws("/", (ws) => {
  ws.on("message", (msg) => {
    msg = JSON.parse(msg);
    switch (msg.method) {
      case "add": {
        const text = msg.data
        todos.push({text, id: uuidv4()})
        broadcastConnection();
        break;
      }
      case "remove": {
        const id = msg.data
        const index = todos.findIndex(todo => todo.id === id)
        if (index > -1) {
          todos.splice(todos.findIndex(todo => todo.id === id), 1)
          broadcastConnection();
        }
        break;
      }
    }
  });
});

app.listen(PORT, () => {
  console.log("SERVER RUNNED on port " + PORT);
});


app.get("/", (req, res) => {
  res.json(todos)
});

const broadcastConnection = () => {
  aWss.clients.forEach((client) => {
      client.send(JSON.stringify(todos));
  });
};