const jwt = require("jsonwebtoken");
const verifyToken = (req, res, next) => {
  const token = req.headers.cookie.split("=")[1]; // Attempt to get the token from cookies
    console.log(req.headers.cookie);
    console.log(req.headers.cookie.split("="))
    // const token = req.headers.cookie.access_token; // Attempt to get the token from cookies

  if (!token) {
    return res.status(401).json({ message: "Access Denied. No token provided." }); // No token found
  }

  try {
    // Verify the token using the same secret key used during signing
    // The 'secret' should be stored securely, e.g., in environment variables
    const decoded = jwt.verify(token, 'blog'); // Replace 'secret' with your actual secret key
    console.log(decoded);
    // Add the decoded payload (which includes user ID) to the request object
    // This makes user information available to subsequent route handlers
        req.user = decoded;
    next(); // Token is valid, proceed to the next middleware or route handler
  } catch (err) {
    // Token is invalid (e.g., expired, tampered)
    return res.status(403).json({ message: "Invalid Token." });
  }
};

module.exports = verifyToken;

// const jwt = require("jsonwebtoken");

// const verifyToken = (req, res, next) => {
//   // Check if cookies are present
//   if (!req.headers.cookie) {
//     return res.status(401).json({ message: "Access Denied. No cookies found." });
//   }

//   // Split cookie string to find the token
//   const cookieParts = req.headers.cookie.split("=");
  
//   // Check if cookie contains the token
//   if (cookieParts.length < 2 || !cookieParts[1]) {
//     return res.status(401).json({ message: "Access Denied. Token not found in cookies." });
//   }

//   const token = cookieParts[1]; // Access the actual token

//   try {
//     const decoded = jwt.verify(token, process.env.SECRET); // Use your secret key
//     req.user = decoded; // Attach user info to request
//     next(); // Continue to next middleware
//   } catch (err) {
//     return res.status(403).json({ message: "Invalid Token." });
//   }
// };

// module.exports = verifyToken;
// // This middleware checks for the presence of a JWT in cookies, verifies it, and attaches user information to the request object.