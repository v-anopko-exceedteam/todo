export default class TodoDataService {
  async serviceRequest(mode = '', modeValue = '', settings = {}) {
    const serviceUri       = `http://localhost:3001/${mode + modeValue}`,
          serviceResponse  = await fetch(serviceUri, settings),
          responseBody     = await serviceResponse.json();

    if (!serviceResponse.ok) {
      throw new Error(`Could not fetch ${serviceResponse.url}, received ${serviceResponse.status}`);
    }

    return responseBody;
  }

  async getAllTodoElement(userId = '') {
    const allTodoElement = await this.serviceRequest('', '', {
      method: 'post',
      body: userId,
    });

    return allTodoElement;
  }

  async checkToken() {
    const response = await this.serviceRequest('check_token', '', {
      method: 'post',
      body: this.getToken(),
    }),
    userId = response.userId;
    
    return userId;
  }

  async addNewTodoElement(newElem) {
    const addedItem = await this.serviceRequest('add/', encodeURIComponent(JSON.stringify(newElem)));

    return addedItem;
  }

  updateTodoElement(elemToUpdate) {
    this.serviceRequest('update/', encodeURIComponent(JSON.stringify(elemToUpdate)));
  }

  async deleteTodoElement(elemId) {
    const deleteResult = await this.serviceRequest('delete/', elemId);

    return deleteResult;
  }

  async registration(userInfo) {
    const registrationStatus = await this.serviceRequest('registration', '', {
      method: 'post',
      body: JSON.stringify(userInfo),
    });

    return registrationStatus;
  }

  async signIn(user) {
    const signInInfo = await this.serviceRequest('sign_in', '', {
            method: 'post',
            body: JSON.stringify(user),
          }),
          {token} = signInInfo;

    this.setToken(token);

    return signInInfo;
  }

  setToken(token, tokenName = 'TodoApp verify') {
    localStorage.setItem(tokenName, token);
  }

  getToken(tokenName = 'TodoApp verify') {
    return(localStorage.getItem(tokenName));
  }

  removeToken(tokenName = 'TodoApp verify') {
    localStorage.removeItem(tokenName);
  }
}
