const express = require('express')
const app = express();
const server = require('http').Server(app);

app.use(express.static(__dirname + '/src'))

app.get('/', function (req,res){
    resizeBy.senfile(__dirname + '/index.html');
});

server.listen(1337, function(){
    console.log(`Server on localhost:${server.address().port}`)
    console.log('Enjoy the game ;)')
});
