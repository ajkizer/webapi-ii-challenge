const express = require("express");
const BlogRouter = require("./data/db-router.js");

const server = express();
server.use(express.json());
server.use(cors());
server.use("/api/posts", BlogRouter);

server.get("/", (req, res) => {
  res.send(`
    <h2>Lambda Hubs Blog</h>
    <p>Welcome to the Lambda Blog API</p>
  `);
});

module.exports = server;
