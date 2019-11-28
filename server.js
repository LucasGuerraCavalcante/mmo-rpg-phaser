const express = require('express');
const app = express();
const server = require('http').Server(app);
 
app.use(express.static(__dirname + '/src'));
 
app.get('/', function (req, res) {
  res.sendFile(__dirname + '/index.html');
});
 
server.listen((process.env.PORT || 5000), function(){
  console.log('listening on *:5000');
});