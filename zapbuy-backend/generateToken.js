// generateToken.js
const jwt = require('jsonwebtoken');

const token = jwt.sign(
  {
    id: "688e11d26cc093d701c7c1c0", // Replace with your user's _id
    role: "ADMIN"
  },
  "N@NIa8686a!85", // JWT_SECRET from your .env
  {
    expiresIn: "7d"
  }
);

console.log("JWT Token:\n", token);
