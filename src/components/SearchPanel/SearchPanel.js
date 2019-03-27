import React from 'react';

import './SearchPanel.css';

const SearchPanel = ({searchElementOnChange}) => {
  return (
    <input type="text"
           className="form-control search-input"
           placeholder="type to search"
           onChange={(evt) => searchElementOnChange(evt.target.value)} />
  );
};

export default SearchPanel;
