import React, { useEffect, useState } from 'react';
import './App.css';
import endpoints from './endpoints.json';

function App() {
  const [tasks, setTasks] = useState([]);
  const [refreshList, setRefreshList] = useState(true);
  const [completedTasks, setCompletedTasks] = useState([]);
  const [showCompletedTasks, setShowCompletedTasks] = useState(false);

  useEffect(() => {
    console.log('useEffect');
    if (refreshList) {
      fetch(endpoints.getTasks).then(response => response.text()).then(result => {
        const taskItems = JSON.parse(result).body;
        setTasks(taskItems);
      }).catch(error => console.error(error));
      setRefreshList(false);
      if (showCompletedTasks) {
        fetchCompletedTasks();
      }
    }
  });

  const createTask = (event) => {
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    const id = Date.now(); //Number.parseInt(document.getElementById('id').value);
    const title = document.getElementById('title').value;
    document.getElementById('title').value = '';
    var raw = JSON.stringify(
      { "id":id,
        "title":title,
        //"completed":false
      }
    );
    var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
    };
    fetch(endpoints.createTask, requestOptions).then(response => {
      setRefreshList(true);
    }).catch(error => console.log('error', error));
  };

  const finishTask = (event) => {
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    const id = Number.parseInt(event.target.value);
    var raw = JSON.stringify(
      { "id":id,
        //"completed":true
      }
    );
    var requestOptions = {
        method: 'DELETE',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
    };
    fetch(endpoints.finishTask, requestOptions).then(response => {
      setRefreshList(true);
    }).catch(error => console.log('error', error));
  };

  const showHideCompletedTasks = () => {
    if (!showCompletedTasks) {
      fetchCompletedTasks();
      setShowCompletedTasks(true);
    } else {
      setShowCompletedTasks(false);
    }
  };

  const fetchCompletedTasks = () => {
    fetch(endpoints.getCompletedTasks).then(response => response.text()).then(result => {
      const taskItems = JSON.parse(result).body;
      setCompletedTasks(taskItems);
    }).catch(error => console.error(error));
  }

  return (
    <div className="App">
      <div id="tasks">
        {tasks.map(task => <div key={task.id}><input type="checkbox" value={task.id} onClick={finishTask}/><label>{task.title}</label></div>)}
      </div>
      <div id="form">
        <input type="text" name="title" id="title" />
        <button type="button" onClick={createTask}>Create Task</button>
      </div>
      <div>
        <a href="#" onClick={showHideCompletedTasks}>{ showCompletedTasks ? 'Hide completed tasks' : 'Show completed tasks' }</a>
        <div id="completedTasks">
          { showCompletedTasks ? completedTasks.map(task => <div key={task.id}><label className="completedTask">{task.title}</label></div>) : null }
        </div>
      </div>
    </div>
  );
}

export default App;
