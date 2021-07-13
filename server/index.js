const server = require("http").createServer();
const io = require("socket.io")(server, {
  cors: {
    origin: "*",
  },
});

const PORT = 4000;
const NEW_CHAT_MESSAGE_EVENT = "newChatMessage";
const INIT_CHAT = "initChat";
const JOIN_CHAT = "joinChat";

const { MysqlConnect } = require('./mysql');
MysqlConnect.connect(function(err) {
  if (err) throw err;
  console.log("DB Connected!");
});

io.on("connection", (socket) => {
  console.log(`Client ${socket.id} connected`);

  // Join a conversation
  const { projectId } = socket.handshake.query;
  

  // Listen for new messages
  socket.on(NEW_CHAT_MESSAGE_EVENT, (data) => {
    // save message on database
    const message = { project_id: 1, from: 1, to: 9, message: 'sdfas' };
    MysqlConnect.query('INSERT INTO messages SET ?', message, (err, res) => {
      if(err) throw err;

      console.log('Last insert ID:', res.insertId);
    });
    io.in(projectId).emit(NEW_CHAT_MESSAGE_EVENT, data);
  });

  socket.on(JOIN_CHAT, ({ projectId, userId }) => {
    // get messages from database
    socket.join(projectId);
    MysqlConnect.query('SELECT * FROM messages', (err,rows) => {
      if(err) throw err;
      socket.emit(INIT_CHAT, { messages: rows });
      console.log(rows);
    });

  })

  // Leave the room if the user closes the socket
  socket.on("disconnect", () => {
    console.log(`Client ${socket.id} diconnected`);
    socket.leave(projectId);
  });
});

server.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
