import React from 'react';
import './AppHeader.css';

const AppHeader = ({toDo, done, onLogOut}) => {
  return (
    <div className="app-header d-flex justify-content-between align-items-center">
      <div>
        <h1>Todo List</h1>
        <h2>{toDo} more to do, {done} done</h2>
      </div>
      <button className="btn btn-outline-secondary" onClick={onLogOut}>Log Out</button>
    </div>
  );
}

export default AppHeader;
