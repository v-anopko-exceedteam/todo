import React, {Component} from 'react';
import AppHeader from './../AppHeader';
import SearchPanel from './../SearchPanel';
import TodoList from './../TodoList';
import ItemStatusFilter from './../ItemStatusFilter';
import AddItem from './../AddItem';
import Loader from './../Loader';
import TodoDataService from './../../services/TodoDataService';
import {Redirect} from 'react-router-dom';
import './Todo.css';

export default class Todo extends Component {
  constructor() {
    super();

    this.todoService = new TodoDataService();

    this.state = {
      todoData: [],
      term: '',
      filterMode: 'all',
      userId: '',
      loader: true,
    };
  }

  componentDidMount() {
    this.todoService.getAllTodoElement(this.props.userId)
                    .then((todoItems) => this.setState({todoData: todoItems}));

    // создание toDo элемента
    this.createToDoItem = (label) => {
      return {
        label,
        important: false,
        done: false,
        userId: this.props.userId,
      };
    };

    /*
    вспоогательный метод для для изменения состояния.
    arr - массив состояний,
    id - элемент который нужно изенить,
    propName - имя свойства
    */
    this.toggleProperty = (arr, id, propName) => {
      const idx      = arr.findIndex( (el) => el._id === id),
            oldItem  = arr[idx],
            newItem  = {...oldItem, [propName]: !oldItem[propName]},
            newArray = [
              ...arr.slice(0, idx),
              newItem,
              ...arr.slice(idx + 1),
            ];

      this.todoService.updateTodoElement(newItem);

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
        const idx         = todoData.findIndex( (el) => el._id === deleteItemId),
              newTodoData = [
                ...todoData.slice(0, idx),
                ...todoData.slice(idx + 1),
              ];

        return({
          todoData: newTodoData,
        });
      });

      this.todoService.deleteTodoElement(deleteItemId);
    };

    // Обработчик события добавления элемента списка по клику
    this.addItemOnClick = (text) => {
      const newListElement = this.createToDoItem(text);

      this.todoService.addNewTodoElement(newListElement)
                      .then(elemToAdd => {
                        this.setState(({todoData}) => {
                          return({
                            todoData: [...todoData, elemToAdd],
                          });
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
      this.setState(({todoData}) => {
        return({
          todoData: this.toggleProperty(todoData, id, 'important'),
        });
      });
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
      this.setState({term: str});
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
  } // END componentDidMount;

  componentDidUpdate(prevProps, prevState) {
    const {todoData, userId} = this.state;

    if (prevState.todoData != todoData) {
      this.setState({loader: false});
    }
  }

  render() {
    const {todoData, term, filterMode, loader} = this.state,
          {authorized} = this.props;

    if (!authorized) {
      return(<Redirect to="/sign_in" />);
    }

    if (loader) {
      return(<Loader />);
    }

    const visibleItem = this.searchFilter(this.filterElements(filterMode), term),
          doneCount   = todoData.filter( (el) => el.done ).length,
          todoCount   = todoData.length - doneCount;

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
                  onToggleImportant={this.onToggleImportant} />

        <AddItem onAddItem={this.addItemOnClick} />
      </div>
    );
  }
}
