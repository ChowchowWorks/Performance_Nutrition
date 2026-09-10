import { useState, useEffect, useRef } from "react";
import "./aicoach.css";
import { auth } from "../../firebase";
import { supabase } from "../../supabase";

const Coach = () => {
  const [message, setMessage] = useState("");
  const storageKey = auth.currentUser
    ? `ai-coach-messages-${auth.currentUser.uid}`
    : null;
  const [messages, setMessages] = useState(() => {
    if (!storageKey) return [];

    try {
      const savedMessages = localStorage.getItem(storageKey);
      return savedMessages ? JSON.parse(savedMessages) : [];
    } catch (error) {
      console.error("Unable to load AI Coach conversation:", error);
      return [];
    }
  });
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

  useEffect(() => {
    if (!storageKey) return;

    try {
      localStorage.setItem(storageKey, JSON.stringify(messages));
    } catch (error) {
      console.error("Unable to save AI Coach conversation:", error);
    }
  }, [messages, storageKey]);

  const getUserData = async (userId) => {
    const [workouts, nutrition, goals] = await Promise.all([
      supabase
        .from("workouts")
        .select("date, exercise_type, duration, calories, step_count")
        .eq("user_id", userId)
        .order("date", { ascending: false })
        .limit(100),
      supabase
        .from("nutrition_stats")
        .select("date, meal_type, calories, protein, carbs, fat, water, weight")
        .eq("user_id", userId)
        .order("date", { ascending: false })
        .limit(100),
      supabase
        .from("nutrition_goals")
        .select("calorie_goal, protein_goal, carbs_goal, fat_goal, weight_goal, step_goal, water_goal")
        .eq("user_id", userId)
        .maybeSingle()
    ]);

    const failedQuery = [workouts, nutrition, goals].find(({ error }) => error);
    if (failedQuery?.error) {
      throw failedQuery.error;
    }

    return {
      workouts: workouts.data ?? [],
      nutrition: nutrition.data ?? [],
      goals: goals.data ?? null
    };
  };

  const handleSend = async () => {
    if (!message.trim()) return;

    const user = auth.currentUser;
    if (!user) {
      setMessages(prev => [
        ...prev,
        { role: "bot", text: "Please log in again before using the AI Coach." }
      ]);
      return;
    }

    const userMessage = message.trim();

    setMessages(prev => [...prev, { role: "user", text: userMessage }]);
    setMessage("");

    const thinkingId = Date.now();
    setMessages(prev => [
        ...prev,
        { role: "bot", text: "Thinking...", temp: true, id: thinkingId }
    ]);

    try {
        const userData = await getUserData(user.uid);
        const response = await fetch(
          import.meta.env.VITE_CHATBOT_API_URL || "http://localhost:8000/ask",
          {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            question: userMessage,
            history: messages
              .filter(m => !m.temp)
              .map(({ role, text }) => ({
                role: role === "bot" ? "assistant" : role,
                content: text
              })),
            user_data: userData
        })
          }
        );

        if (!response.ok) {
          const errorBody = await response.json().catch(() => ({}));
          throw new Error(
            errorBody.detail || `AI Coach request failed (${response.status})`
          );
        }

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
            ? { role: "bot", text: err.message || "Error generating response" }
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
            autoComplete="off"
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