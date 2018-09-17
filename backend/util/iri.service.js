class IriUtil {

  createIriRequest(iriIp, iriPort, command) {
    return {
      url: `http://${iriIp}:${iriPort}`,
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