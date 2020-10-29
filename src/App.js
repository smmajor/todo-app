import React, { useEffect, useState } from 'react';
// import './App.css';
import endpoints from './endpoints.json';

function App() {
  const [tasks, setTasks] = useState([]);
  const [refresh, setRefresh] = useState(true);

  useEffect(() => {
    if (refresh) {
      fetch(endpoints.getTasks).then(response => response.text()).then(result => {
        const taskItems = JSON.parse(result).body.Items;
        console.log(taskItems);
        setTasks(taskItems);
      }).catch(error => console.error(error));
      setRefresh(false);
    }
  });

  const createTask = (event) => {
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    // using built in JSON utility package turn object to string and store in a variable
    const id = Number.parseInt(document.getElementById('id').value);
    const title = document.getElementById('title').value;
    var raw = JSON.stringify(
      { "id":id,
        "title":title,
        "completed":false
      }
    );
    // create a JSON object with parameters for API call and store in a variable
    var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
    };
    // make API call with parameters and use promises to get response
    fetch(endpoints.createTask, requestOptions).then(response => {
      setRefresh(true);
    }).catch(error => console.log('error', error));
  };

  return (
    <div className="App">
      <table>
        {tasks.map(task => <tr><td><input type="checkbox"/></td><td>{task.Title}</td></tr>)}
      </table>
      <form>
        ID: <input type="text" name="id" id="id" />
        Title: <input type="text" name="title" id="title" />
        <button type="button" onClick={createTask}>Create Task</button>
      </form>
    </div>
  );
}

export default App;
