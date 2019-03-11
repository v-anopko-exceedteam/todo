import React, {Component} from 'react';

import AppHeader from './../AppHeader';
import SearchPanel from './../SearchPanel';
import TodoList from './../TodoList';
import ItemStatusFilter from './../ItemStatusFilter';
import AddItem from './../AddItem';

import './App.css';

export default class App extends Component {

  constructor() {
    super();

    // свойство для добавления id к todo элементам
    this.maxId = 100;

    // создание toDo элемента
    this.createToDoItem = (label) => {
      return {
        label,
        important: false,
        done: false,
        id: this.maxId++,
      };
    };

    this.state = {
      todoData: [
        this.createToDoItem('Drink coffee!'),
        this.createToDoItem('Have a lunch!'),
        this.createToDoItem('Go to interview!'),
      ],
      term: '',
      filterMode: 'all',
    };

    /*
    вспоогательный метод для для изменения состояния.
    arr - массив состояний,
    id - элемент который нужно изенить,
    propName - имя свойства
    */
    this.toggleProperty = (arr, id, propName) => {
      const idx      = arr.findIndex( (el) => el.id === id),
            oldItem  = arr[idx],
            newItem  = {...oldItem, [propName]: !oldItem[propName]},
            newArray = [
                        ...arr.slice(0, idx),
                        newItem,
                        ...arr.slice(idx + 1),
                      ];

      return (newArray);
    };

    // фильтрация элементов списка
    this.filterElements = (filterName) => {
      const elements = this.state.todoData;

      switch (filterName) {
        case 'active':
          return elements.filter((el) => el.done === false);
          break;
        case 'done':
          return elements.filter((el) => el.done === true);
          break;
        default:
          return elements;
      }
    };

    // Обработчик события удаления элемента списка по клику
    this.deleteItem = (deleteItemId) => {
      this.setState(({todoData}) => {
        const idx         = todoData.findIndex( (el) => el.id === deleteItemId),
              newTodoData = [
                              ...todoData.slice(0, idx),
                              ...todoData.slice(idx + 1),
                            ];

        return({
          todoData: newTodoData,
        });
      });
    };

    // Обработчик события добавления элемента списка по клику
    this.addItemOnClick = (text) => {
      this.setState(({todoData}) => {
        const newListElement = this.createToDoItem(text);

        return({
          todoData: [...todoData, newListElement],
        });
      });
    };

    // обработчик события нажатия done
    this.onToggleDone = (id) => {
      this.setState(({todoData}) => {
        return ({
          todoData: this.toggleProperty(todoData, id, 'done'),
        });
      });
    };

    // обработчик события нажатия important
    this.onToggleImportant = (id) => {
      this.setState( ({todoData}) => {
        return({
          todoData: this.toggleProperty(todoData, id, 'important'),
        });
      } );
    };

    // обработчик filterElementsOnClick - принимает имя фильтра
    this.filterElementsOnClick = (filterName) => {
      let filterResult;

      this.setState(({filterMode}) => {
        return({
          filterMode: filterName,
        });
      });

      filterResult = this.filterElements(filterName);

      return filterResult;
    };

    // обработчик searchElementOnChange - принимает строку из поля поиска
    this.searchElementOnChange = (str) => {
      this.setState(() => {
        return({
          term: str,
        });
      });
    };

    // поиск по списку
    this.searchFilter = (elements, str) => {
      return elements.filter((element) => {
                                            if (str == 0) {
                                              return element;
                                            }

                                            return element.label.indexOf(str) !== (-1)
                                          });
    };

  } // END constructor

  render() {

    const {todoData, term, filterMode} = this.state,
          visibleItem      = this.searchFilter(this.filterElements(filterMode), term),
          doneCount        = todoData.filter( (el) => el.done ).length,
          todoCount        = todoData.length - doneCount;

    return (
      <div className="todo-app">
      <AppHeader toDo={todoCount}
      done={doneCount} />
      <div className="top-panel d-flex">
      <SearchPanel searchElementOnChange={this.searchElementOnChange} />
      <ItemStatusFilter filterElementsOnClick={this.filterElementsOnClick}
                        filterMode={filterMode} />
      </div>

      <TodoList todos={visibleItem}
      onDeleted={this.deleteItem}
      onToggleDone={this.onToggleDone}
      onToggleImportant={this.onToggleImportant}
      />

      <AddItem onAddItem={this.addItemOnClick}/>
      </div>
    );
  }
}
