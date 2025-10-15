import "./Sidebar.css";
import { useEffect, useContext } from "react";
import { Mycontext } from "./Mycontex.jsx";
import { v1 as uuidv1 } from "uuid";

function Sidebar() {
    const {
        allThreads,
        setAllThreads,
        currThreadId,
        setCurrThreadId,
        setPrevChats,
        setNewChat,
        setPrompt,
        setReply,
    } = useContext(Mycontext);

    const getAllThreads = async () => {
        try {
            const response = await fetch("https://backend-egh2.onrender.com/api/thread");
            const res = await response.json();

            const filteredData = res.map(thread => ({
                threadId: thread.thread, // Use the `thread` field from DB
                title: thread.title,
            }));

            setAllThreads(filteredData);
        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        getAllThreads();
    }, [currThreadId]);

        const changeThread = async (newThreadId) => {
        console.log("Set current thread ID to:", newThreadId);
        setCurrThreadId(newThreadId);

        try {
            const response = await fetch(`https://backend-egh2.onrender.com/api/thread/${newThreadId}`);
            const res = await response.json();

            console.log("Response from backend:", res);
            setPrevChats(res);
            setNewChat(false);
            setReply(null);
        } catch (err) {
            console.error("changeThread error:", err);
        }
    };


    const createNewChat = () => {
        setNewChat(true);
        setPrompt("");
        setReply(null);
        setCurrThreadId(uuidv1());
        setPrevChats([]);
    };

    const deleteThread = async (threadId) => {
        try {
            const response = await fetch(`https://backend-egh2.onrender.com/api/thread/${threadId}`, {
                method: "DELETE",
            });
            const res = await response.json();
            console.log(res);
            setAllThreads(prev => prev.filter(thread => thread.threadId !== threadId));
            if (threadId === currThreadId) {
                createNewChat();
            }
        } catch (err) {
            console.log(err);
        }
    };

    return (
        <section className="sidebar">
            <button className="button" onClick={createNewChat}>
                <img src="src/assets/blacklogo.png" alt="gpt-logo" className="logo" />
                <span><i className="fa-solid fa-pen-to-square"></i></span>
            </button>

            <ul className="history">
                {allThreads?.map((thread, idx) => (
                    <li key={idx} onClick={(e) => changeThread(thread.threadId)}
                        className={thread.threadId === currThreadId ? "highlighted": ""}
                    >
                        {thread.title}
                        <i
                            className="fa-solid fa-trash"
                            onClick={(e) => {
                                e.stopPropagation();
                                deleteThread(thread.threadId);
                            }}
                        ></i>
                    </li>
                ))}
            </ul>

            <div className="sign">
                <p>By Dhiraj Biradar &hearts;</p>
            </div>
        </section>
    );
}

export default Sidebar;
