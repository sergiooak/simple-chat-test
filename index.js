const express = require('express');
const path = require('path');

const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);

app.use(express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, 'public'));
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

app.use('/', (req, res) => {
  res.render('index.html');
})

let messages = [];

io.on('connection', socket => {
  let date = Date.now();

  console.log(`Socket conectado: ${socket.id} | ${date}`);
  socket.emit('olderMessages', messages)

  io.emit('receivedMessage', {
    nome: 'Bot',
    mensagem: `🤖 Um novo arrombado se conectou (${date})`
  })

  socket.on('sendMessage', data => {
    console.log(`Mensagem Recebida: ${data}`);
    messages.push(data);
    socket.broadcast.emit('receivedMessage', data)
  })
})

var port = process.env.PORT || 3000;
server.listen(port, function () {
    console.log('Umbler listening on port %s', port);
});
