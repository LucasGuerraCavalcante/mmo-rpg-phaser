const express = require('express');
const app = express();
const server = require('http').Server(app);
 
app.use(express.static(__dirname + '/src'));
 
app.get('/', function (req, res) {
  res.sendFile(__dirname + '/index.html');
});
 
server.listen(8082, function () {
  console.log(`Listening on ${server.address().port}`);
});