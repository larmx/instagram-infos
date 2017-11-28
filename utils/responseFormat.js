class ResponseFormat {
  constructor(res) {
    this.res = res;
    this.data = null;
  }

  success(data = 'OK') {
    this.data = data;
    this.res.status(200);

    return this;
  }

  send() {
    let result = {};

    if (typeof this.data === 'string') {
      result = {
        message: this.data
      };
    } else {
      result = this.data;
    }

    result = Object.assign(result, this.payload);

    return this.res.json(result);
  }
}

module.exports = ResponseFormat;
