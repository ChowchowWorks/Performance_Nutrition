import React, { useState, useEffect, useRef } from "react";
import "./aicoach.css";

const Coach = () => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]); // stores chat bubbles
  const [history, setHistory] = useState([]);   // stores last 5 Q&A pairs
  const chatRef = useRef(null);

  // Scroll to bottom every time messages change
  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages]);

    const handleSend = async () => {
    if (!message.trim()) return;

    const userMessage = message.trim();

    // Add user's message
    setMessages(prev => [...prev, { role: "user", text: userMessage }]);
    setMessage(""); // clear input

    // Show temporary "Thinking..." indicator
    const thinkingId = Date.now(); // unique ID for this thinking bubble
    setMessages(prev => [
        ...prev,
        { role: "bot", text: "Thinking...", temp: true, id: thinkingId }
    ]);

    try {
        const response = await fetch("/api", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            question: userMessage,
            history: messages.filter(m => !m.temp) // send only real messages as history
        })
        });

        const data = await response.json();
        const answer = data.answer || "No answer received.";

        // Replace the temporary bubble with actual response
        setMessages(prev =>
        prev.map(msg =>
            msg.id === thinkingId ? { role: "bot", text: answer } : msg
        )
        );
    } catch (err) {
        setMessages(prev =>
        prev.map(msg =>
            msg.id === thinkingId
            ? { role: "bot", text: "Error generating response" }
            : msg
        )
        );
        console.error(err);
    }
    };


  // Allow Enter to send
  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSend();
  };

  return (
    <div className="coachContainer">
      <div className="PageHead">
        <h2 className="coachTitle">AI Coach</h2>
      </div>

      <div className="mainCoach">
        
        <div className="chatWindow" ref={chatRef}>
          {messages.map((msg, i) => (
            <div
              key={i}
              className={msg.role === "user" ? "userBubble" : "botBubble"}
              dangerouslySetInnerHTML={msg.html ? { __html: msg.text } : undefined}
            >
              {!msg.html ? msg.text : null}
            </div>
          ))}
        </div>

        <div className="inputBar">
            <input
                className="chatInput"
                type="text"
                placeholder="Type your message..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
            />

            <button className="sendButton" onClick={handleSend}>
                Send
            </button>
        </div>


      </div>
    </div>
  );
};

export default Coach;