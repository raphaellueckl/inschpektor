class AuthUtil {

  isUserAuthenticated(validToken, request) {
    return request && validToken === request.header('Authorization');
  }

}

const authUtil = new AuthUtil();
module.exports = authUtil;