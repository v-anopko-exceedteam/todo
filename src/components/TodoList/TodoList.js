import React from 'react';
import TodoListItem from './../TodoListItem';

import './TodoList.css';

const TodoList = ({ todos, onDeleted, onToggleImportant, onToggleDone }) => {

  const elements = todos.map((element) => {

    const {_id, ...itemProps} = element;

    return(
      <li key={_id} className="list-group-item">
        <TodoListItem {...itemProps}
                      onDeleted={ () => onDeleted(_id) }
                      onToggleDone={ () => onToggleDone(_id) }
                      onToggleImportant={ () => onToggleImportant(_id) }
                      />
      </li>
    );
  });

  return (
    <ul className="list-group todo-list">
      {elements}
    </ul>
  );
};

export default TodoList;
