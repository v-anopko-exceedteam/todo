import React, {Component} from 'react';
import './AddItem.css';

export default class AddItem extends Component {

  constructor() {
    super();

    this.state = {
      label: '',
    };

    this.labelOnChange = (evt) => {
      this.setState({label: evt.target.value});
    };

    this.onSubmitForm = (evt) => {
      evt.preventDefault();
      evt.target.reset();
      return(this.props.onAddItem(this.state.label));
    };
  }

  render() {
    return(
      <form className="item-add-form d-flex"
            onSubmit={this.onSubmitForm}>
        <input type="text"
               className="form-control"
               placeholder="What needs to be done"
               onChange={this.labelOnChange}/>

        <button className="btn btn-outline-secondary">Add item</button>
      </form>
    );
  }
};
