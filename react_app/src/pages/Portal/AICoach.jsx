import { useState, useEffect, useRef } from "react";
import "./aicoach.css";

const Coach = () => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const chatRef = useRef(null);

  const currentDate = new Date().toLocaleDateString("en-GB", {
    year: "numeric",
    month: "long",
    day: "numeric",
    weekday: "long"
  });

  // Scroll to bottom every time messages change
  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages]);

    const handleSend = async () => {
    if (!message.trim()) return;

    const userMessage = message.trim();

    setMessages(prev => [...prev, { role: "user", text: userMessage }]);
    setMessage("");

    const thinkingId = Date.now();
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


  return (
    <div className="CoachPage">
      <div className="headerRow">
        <div>
          <h1 className="pageName">AI Coach</h1>
          <p className="coachIntro">
            Ask questions about nutrition, training, and your goals.
          </p>
        </div>
        <h3>Date: {currentDate}</h3>
      </div>

      <div className="mainCoach">
        <div className="chatWindow" ref={chatRef}>
          {messages.length === 0 && (
            <div className="chatEmptyState">
              <h2>How can I help?</h2>
              <p>Start a conversation with your personal performance coach.</p>
            </div>
          )}
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

        <form className="inputBar" onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}>
          <input
            className="chatInput"
            type="text"
            placeholder="Ask your coach a question..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            aria-label="Message for AI Coach"
          />
          <button className="sendButton" type="submit" disabled={!message.trim()}>
            Send
          </button>
        </form>
      </div>
    </div>
  );
};

export default Coach;