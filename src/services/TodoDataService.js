export default class TodoDataService {
  async serviceRequest(mode = '', modeValue = '') {
    const serviceUri       = `http://localhost:3001/${mode + modeValue}`,
          serviceResponse  = await fetch(serviceUri),
          responseBody     = await serviceResponse.json();

    if (!serviceResponse.ok) {
      throw new Error(`Could not fetch ${serviceResponse.url}, received ${serviceResponse.status}`);
    }

    return responseBody;
  }

  async getAllTodoElement() {
    const allTodoElement = await this.serviceRequest();

    return allTodoElement;
  }

  async addNewTodoElement(newElem) {
    const addedItem = await this.serviceRequest('add/', encodeURIComponent(JSON.stringify(newElem)));

    return addedItem;
  }

  updateTodoElement(elemToUpdate) {
    this.serviceRequest('update/', encodeURIComponent(JSON.stringify(elemToUpdate)));
  }

  deleteTodoElement(elemId) {
    this.serviceRequest('delete/', elemId);
  }
}
