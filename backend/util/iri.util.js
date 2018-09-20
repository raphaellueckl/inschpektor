class IriUtil {

  constructor() {
    this.iriIp = null;
    this.iriPort = null;
  }

  createIriRequest(command, ip = this.iriIp) {
    return {
      url: `http://${ip}:${this.iriPort}`,
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