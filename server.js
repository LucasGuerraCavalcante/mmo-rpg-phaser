const express = require('express');
const app = express();
const server = require('http').Server(app);
 
app.use(express.static(__dirname + '/src'));
 
app.get('/', function (req, res) {
  res.sendFile(__dirname + '/index.html');
});

dom.window.gameLoaded = () => {
  let port = process.env.PORT;
  if (port == null || port == "") {
    port = 8082;
  }
  server.listen(port, function () {
    console.log(`Enjoy =D port:${server.address().port}`);
  });
};