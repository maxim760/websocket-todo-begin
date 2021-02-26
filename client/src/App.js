import React, { useEffect, useState } from "react";
import { useInput } from "./useInput";
import axios from "axios";


export const App = () => {
  const { resetInput, ...todo } = useInput();
  const [socket, setSocket] = useState()
  const [todos, setTodos] = useState([]);
  React.useEffect(() => {
    const webSocket = new WebSocket("ws://localhost:5000/")
    setSocket(webSocket)
    webSocket.onmessage = event => {
      const response = JSON.parse(event.data)
      setTodos(response)
    }
  }, [])
  const addTodo = (e) => {
    e.preventDefault();
    if (socket) {
      socket.send(JSON.stringify({data:todo.value, method:"add"}))
      resetInput()
    }
  };
  const removeTodo = (id) => () => {
    socket.send(JSON.stringify({data:id, method:"remove"}))
  };
  useEffect(() => {
    const getTodos = async () => {
      const { data } = await axios.get("http://localhost:5000/");
      console.log(data);
      if (data) {
        setTodos(data);
      }
    };
    getTodos();
  }, []);
  return (
    <div className="app">
      <form onSubmit={addTodo}>
        <input {...todo} />
        <button type="submit">Отправить</button>
      </form>
      <hr />
      {todos.length ? (
        todos.map(({ text, id }) => (
          <ol key={id} className="block">
            <p>{text}</p>
            <button className="btn" onClick={removeTodo(id)}>
              Удалить
            </button>
          </ol>
        ))
      ) : (
        <h1>Нет задач. Добавьте</h1>
      )}
    </div>
  );
};
