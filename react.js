// This is a simple real-time chat app built using React.js and WebSockets
// It uses native WebSocket API and basic React 

import React, { useState, useEffect, useRef } from "react";

const ChatApp = () => {
  // State to hold all chat messages
  const [messages, setMessages] = useState([]); // Logic: Chat history handling

  // State to track user input
  const [input, setInput] = useState(""); // Logic: Controlled input for text field

  // Ref to persist WebSocket connection between renders
  const ws = useRef(null); // Logic: WebSocket connection persistence

  useEffect(() => {
    // Establish WebSocket connection when component mounts
    ws.current = new WebSocket("ws://localhost:3001"); // Logic: WebSocket connection initiation

    // Handle incoming messages
    ws.current.onmessage = (event) => {
      const message = JSON.parse(event.data);
      setMessages((prevMessages) => [...prevMessages, message]); // Logic: Append incoming message
    };

    // Cleanup when component unmounts
    return () => {
      ws.current.close(); // Logic: Close connection to avoid memory leaks
    };
  }, []);

  // Function to send a message
  const sendMessage = () => {
    if (input.trim() === "") return; // Logic: Prevent empty messages from being sent

    const message = {
      text: input,
      timestamp: Date.now(),
      from: "You",
    };

    ws.current.send(JSON.stringify(message)); // Logic: Serialize and send message to server

    setMessages((prev) => [...prev, message]); // Logic: Update local chat with sent message
    setInput(""); // Logic: Clear input after sending
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-6">
      <h1 className="text-2xl font-bold mb-4">Real-Time Chat App</h1>
      <div className="w-full max-w-md border rounded-lg shadow bg-white p-4">
        {/* Message Display Area */}
        <div className="h-64 overflow-y-auto border-b pb-2 mb-2">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`mb-1 text-sm ${msg.from === "You" ? "text-blue-600 text-right" : "text-gray-800"}`}
            >
              {msg.text}
              <div className="text-xs text-gray-400">
                {new Date(msg.timestamp).toLocaleTimeString()} {/* Logic: Format timestamp */}
              </div>
            </div>
          ))}
        </div>

        {/* Input & Send Button */}
        <div className="flex">
          <input
            className="flex-grow border rounded p-2 mr-2"
            value={input}
            placeholder="Type your message..."
            onChange={(e) => setInput(e.target.value)} // Logic: Update input state
            onKeyDown={(e) => {
              if (e.key === "Enter") sendMessage(); // Logic: Send on Enter key
            }}
          />
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded"
            onClick={sendMessage} // Logic: Trigger message send
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatApp;
