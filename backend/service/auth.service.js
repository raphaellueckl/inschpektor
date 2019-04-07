class AuthService {
  isUserAuthenticated(validToken, request) {
    return request && validToken === request.header('Authorization');
  }
}

const authService = new AuthService();
module.exports = authService;
