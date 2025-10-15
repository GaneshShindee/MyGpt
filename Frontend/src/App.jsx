import { useState, useEffect } from "react";
import Sidebar from "./Sidebar.jsx";
import ChatWindow from "./ChatWindow.jsx";
import { Mycontext } from "./Mycontex.jsx";
import { v1 as uuidv1 } from "uuid";

function App() {
  const [prompt, setPrompt] = useState("");
  const [reply, setReply] = useState(null);
  const [currThreadId, setCurrThreadId] = useState(uuidv1());
  const [prevChats, setPrevChats] = useState([]);
  const [newChat, setNewChat] = useState(true);
  const [allThreads, setAllThreads] = useState([]);
  



  const ProviderValues = {
    prompt,setPrompt,
    reply,setReply,
    currThreadId,setCurrThreadId,
    prevChats,setPrevChats,
    newChat,setNewChat,
    allThreads, setAllThreads,
  
  };

  return (
    <Mycontext.Provider value={ProviderValues}>
      <div className="app">
        <Sidebar />
        <ChatWindow />
      </div>
    </Mycontext.Provider>
  );
}

export default App;
