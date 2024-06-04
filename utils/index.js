const jwt = require("jsonwebtoken");

module.exports = {
  jwtVerify: async (token) => {
    try {
      return jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
      throw error;
    }
  },
};
