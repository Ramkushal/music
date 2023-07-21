import React, { createContext, useContext, useState } from 'react';

const MessagesContext = createContext();

export const MessagesProvider = ({ children }) => {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessages] = useState("");
    const [socketConnected, setSocketConnected] = useState(false);
    const [typing, setTyping] = useState(false);
    const [istyping, setIsTyping] = useState(false);

  return (
    <MessagesContext.Provider value={{ messages, setMessages ,newMessage ,setNewMessages ,socketConnected ,setSocketConnected ,typing ,setTyping ,istyping ,setIsTyping}}>
      {children}
    </MessagesContext.Provider>
  );
};

export const useMessageContext = () => useContext(MessagesContext);