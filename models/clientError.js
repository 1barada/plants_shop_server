function clientError (status, message = '', detail = '', type = '', instance = '') {
    this.status = status,
    this.message = message,
    this.detail = detail,
    this.type = type,
    this.instance = instance
};

export default clientError;