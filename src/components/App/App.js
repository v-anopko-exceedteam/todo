<<<<<<< HEAD
import React, {Component} from 'react';
import AppHeader from './../AppHeader';
import SearchPanel from './../SearchPanel';
import TodoList from './../TodoList';
import ItemStatusFilter from './../ItemStatusFilter';
import AddItem from './../AddItem';
import TodoDataService from './../../services/TodoDataService';
import './App.css';

export default class App extends Component {
  constructor() {
    super();

    this.todoService = new TodoDataService();

    // создание toDo элемента
    this.createToDoItem = (label) => {
      return {
        label,
        important: false,
        done: false,
      };
    };

    this.state = {
      todoData: [],
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

  } // END constructor

  componentDidMount() {
    this.todoService.getAllTodoElement()
                    .then((todoItems) => this.setState({todoData: todoItems}));
  }

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
                  onToggleImportant={this.onToggleImportant} />

        <AddItem onAddItem={this.addItemOnClick}/>
      </div>
    );
  }
}
=======
import React, {Component} from 'react';
import {BrowserRouter as Router, Route, Redirect} from 'react-router-dom';
import Todo from './../Todo';
import SignIn from './../SignIn';
import Registration from './../Registration';
import TodoDataService from './../../services/TodoDataService';
import Loader from './../Loader';
import './App.css';

export default class App extends Component {
  constructor() {
    super();

    this.todoService = new TodoDataService();
    this.state = {
      authorized: false,
      userId: '',
      loader: false
    };

    this.enterInTodo = (userId) => {
      this.setState({
        userId,
        authorized: true,
      });
    };
  }

  render() {
    const {loader, authorized, userId} = this.state;
    
    if (loader) {
      return(<Loader />);
    }

    return(
      <Router>
        <Route path="/" render={() => <Todo authorized={authorized} userId={userId} />} exact />

        <Route path="/registration" component={Registration} />

        <Route path="/sign_in" render={() => <SignIn authorized={authorized} enterInTodo={this.enterInTodo} />} />
      </Router>
    );
  }
}
>>>>>>> fd085e04da32cadfdeefdab376484fb59f027bb1
