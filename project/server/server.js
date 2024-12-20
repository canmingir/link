const jsonServer = require("json-server");
const cors = require("cors");

const server = jsonServer.create();
const router = jsonServer.router("mock.json");
const middlewares = jsonServer.defaults();

// Add middlewares
server.use(middlewares);
server.use(cors());

// Add authentication middleware
server.use((req, res, next) => {
  // Check for authorization header
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ error: "Authorization header required" });
  }

  // Basic validation - you might want to add more robust token validation
  if (!authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Invalid authorization format" });
  }

  // Add a simple token validation
  const token = authHeader.split(" ")[1];
  if (token !== "test-token") {
    // You can change this to any token value you want to use
    return res.status(401).json({ error: "Invalid token" });
  }

  next();
});

server.use(router);

server.listen(3000, () => {
  console.log("JSON Server is running");
});
