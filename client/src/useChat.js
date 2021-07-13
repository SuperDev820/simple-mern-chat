import { useEffect, useRef, useState } from "react";
import socketIOClient from "socket.io-client";

const NEW_CHAT_MESSAGE_EVENT = "newChatMessage";
const INIT_CHAT = "initChat";
const JOIN_CHAT = "joinChat";
const SOCKET_SERVER_URL = "http://localhost:4000";

const useChat = (projectId) => {
  const [messages, setMessages] = useState([]);
  const socketRef = useRef();

  useEffect(() => {
    socketRef.current = socketIOClient(SOCKET_SERVER_URL, {
      query: { projectId },
    });

    socketRef.current.on(NEW_CHAT_MESSAGE_EVENT, (message) => {
      const incomingMessage = {
        ...message,
        ownedByCurrentUser: message.senderId === socketRef.current.id,
      };
      setMessages((messages) => [...messages, incomingMessage]);
    });

    socketRef.current.on(INIT_CHAT, ({ messages }) => {
      if (Array.isArray(messages)) {
        setMessages(messages);
      }
    })

    socketRef.current.emit(JOIN_CHAT, {
      projectId: projectId,
      userId: 1
    })

    return () => {
      socketRef.current.disconnect();
    };
  }, [projectId]);

  const sendMessage = (messageBody) => {
    socketRef.current.emit(NEW_CHAT_MESSAGE_EVENT, {
      body: messageBody,
      senderId: socketRef.current.id,
    });
  };

  return { messages, sendMessage };
};

export default useChat;
