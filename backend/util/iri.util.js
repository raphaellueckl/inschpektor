class IriUtil {

  constructor() {
    this.iriIp = null;
    this.IRI_PORT = null;
  }

  createIriRequest(command, ip = this.iriIp) {
    return {
      url: `http://${ip}:${this.IRI_PORT}`,
      data: {command},
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
        'X-IOTA-API-Version': '1'
      },
      timeout: 5000
    };
  }

}

const iriUtil = new IriUtil();
module.exports = iriUtil;