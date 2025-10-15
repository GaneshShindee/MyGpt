import "./ChatWindow.css";
import Chat from "./Chat.jsx";
import { Mycontext } from "./Mycontex.jsx";
import { useContext, useState, useEffect } from "react";
import { ScaleLoader } from "react-spinners";

function ChatWindow() {
  const {
    prompt,setPrompt,
    reply,setReply,
    currThreadId,
    prevChats,setPrevChats,
    newChat, setNewChat,
  } = useContext(Mycontext);

  const [loading, setLoading] = useState(false);
  const [isOpen, setisOpen] = useState(false);

  const getReply = async () => {
    setNewChat(false);
    if (!prompt.trim()) return; // prevent empty messages

    setLoading(true);
    console.log("message", prompt, "threadId", currThreadId);

    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: prompt,
        threadId: currThreadId,
      }),
    };

    try {
      const response = await fetch("https://backend-egh2.onrender.com/api/chat", options);
      const res = await response.json();
      console.log(res);
      setReply(res.reply);
    } catch (err) {
      console.log("Error fetching reply:", err);
    } finally {
      setLoading(false);
    }
  };

  // Append user & assistant messages when reply updates
  useEffect(() => {
    if (prompt && reply) {
      setPrevChats((prevChats) => [
        ...prevChats,
        {
          role: "user",
          content: prompt,
        },
        {
          role: "gpt",
          content: reply,
        },
      ]);
      setPrompt("");
      setNewChat(false);
    }
  }, [reply]);

  const handleProfileclick = () => {
    setisOpen(!isOpen);
  }
  return (
    <div className="chatWindow">
      {/* Top Navbar */}
      <div className="navbar">
        <span>
          MYGPT <i className="fa-solid fa-chevron-down"></i>
        </span>
        <div className="userIconDiv" onClick={handleProfileclick}>
          <span className="userIcon">
            <i className="fa-solid fa-user"></i>
          </span>
        </div>
      </div>
      { 
        isOpen &&
        <div className="dropDown">
            <div className="dropDownitem"><i class="fa-solid fa-gear"></i>Settings</div>
             <div className="dropDownitem" > <i class="fa-solid fa-cloud-arrow-up"></i>Upgrade Plane</div>
            <div className="dropDownitem"><i class="fa-solid fa-arrow-right-from-bracket"></i>LogOut</div>
        </div>
      }
      {/* Chat Display */}
      <Chat />

      {/* Loading Spinner */}
      <ScaleLoader color="#fff" loading={loading} />

      {/* Input Box */}
      <div className="chatInput">
        <div className="InputBox">
          <input
            type="text"
            placeholder="Ask anything"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && getReply()}
          />
          <div className="submit" onClick={getReply}>
            <i className="fa-solid fa-paper-plane"></i>
          </div>
        </div>
        <p className="info">
          MYGPT can make mistakes. Check important info. See Cookie preferences.
        </p>
      </div>
    </div>
  );
}

export default ChatWindow;
