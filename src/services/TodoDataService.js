export default class TodoDataService {

  async serviceRequest(mode = '', modeValue = '') {
    const serviceUri       = `http://localhost:3001/${mode + modeValue}`,
          serviceResponse  = await fetch(serviceUri),
          responseBody     = await serviceResponse.json();

    if (!serviceResponse.ok) {
      throw new Error(`Could not fetch ${serviceResponse.url}` +
        `, received ${serviceResponse.status}`);
    }

    return responseBody;
  }

  async getAllTodoElement() {
    const allTodoElement = await this.serviceRequest();

    return allTodoElement;
  }

  async addNewTodoElement(newElem) {
    this.serviceRequest('add/', encodeURIComponent(JSON.stringify(newElem)));
  }

  async updateTodoElement(elemToUpdate) {}

  async deleteTodoElement(elemId) {}

}
