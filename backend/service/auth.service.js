const bcrypt = require('bcrypt');

const SALT = 11;

class AuthService {
  isUserAuthenticated(validToken, request) {
    return request && validToken === request.header('Authorization');
  }

  hashPassword(password) {
    return bcrypt.hashSync(password, SALT);
  }

  isPasswordCorrect(plainPasswordToCheck, hashedPassword) {
    return bcrypt.compareSync(plainPasswordToCheck, hashedPassword);
  }
}

const authService = new AuthService();
module.exports = authService;
