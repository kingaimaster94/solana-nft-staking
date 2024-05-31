const app = require('./app');
const http = require('http');
const httpServer = http.createServer(app);
const PORT = process.env.PORT || 3005;
httpServer.listen(PORT, () =>
  console.log(`The server is running on port ${PORT}`)
);

// const port = 3001
// app.listen(port)
// console.log(`listening on http://localhost:${port}`)