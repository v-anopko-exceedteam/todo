export default class TodoDataService {
<<<<<<< HEAD
  async serviceRequest(mode = '', modeValue = '') {
    const serviceUri       = `http://localhost:3001/${mode + modeValue}`,
          serviceResponse  = await fetch(serviceUri),
=======
  async serviceRequest(mode = '', modeValue = '', settings = {}) {
    const serviceUri       = `http://localhost:3001/${mode + modeValue}`,
          serviceResponse  = await fetch(serviceUri, settings),
>>>>>>> fd085e04da32cadfdeefdab376484fb59f027bb1
          responseBody     = await serviceResponse.json();

    if (!serviceResponse.ok) {
      throw new Error(`Could not fetch ${serviceResponse.url}, received ${serviceResponse.status}`);
    }

    return responseBody;
  }

<<<<<<< HEAD
  async getAllTodoElement() {
    const allTodoElement = await this.serviceRequest();
=======
  async getAllTodoElement(userId) {
    const allTodoElement = await this.serviceRequest('', '', {
      method: 'post',
      body: userId,
    });
>>>>>>> fd085e04da32cadfdeefdab376484fb59f027bb1

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
<<<<<<< HEAD
=======

  async registration(userInfo) {
    const registrationStatus = await this.serviceRequest('registration', '', {
      method: 'post',
      body: JSON.stringify(userInfo),
    });
    
    return registrationStatus;
  }

  async signIn(user) {
    const userId = await this.serviceRequest('sign_in', '', {
      method: 'post',
      body: JSON.stringify(user),
    });

    return userId;
  }
>>>>>>> fd085e04da32cadfdeefdab376484fb59f027bb1
}
