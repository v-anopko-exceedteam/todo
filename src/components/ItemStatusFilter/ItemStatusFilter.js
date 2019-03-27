import React, {Component} from 'react';
import './ItemStatusFilter.css';

export default class ItemStatusFilter extends Component {
  render() {

    const {filterMode} = this.props,
          buttonsInfo  = [
            {name: 'all', label: 'All'},
            {name: 'active', label: 'Active'},
            {name: 'done', label: 'Done'},
          ],
          getButtons = () => {
            return buttonsInfo.map((el) => {
              let activeBtnClassName = filterMode === el.name ? 'btn-info' : 'btn-outline-secondary';

              return(
                <button type="button"
                        className={`btn ${activeBtnClassName}`}
                        key={el.name}
                        onClick={() => filterElementsOnClick(el.name)}>
                  {el.label}
                </button>
              );
            });
          };

    const {filterElementsOnClick} = this.props;

    return (
      <div className="btn-group">
        {getButtons()}
      </div>
    );
  }
}
