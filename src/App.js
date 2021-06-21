import "./App.css";
import React, { useState } from "react";
import ChatRoom from "./components/chatRoom";
import Login from "./components/login";

function App() {
    // displaying Login component until client has completed login, then sets app state with the name and socket connection. the ChatRoom component is then displayed
    const [clientName, setClientName] = useState("");
    const [connected, setConnected] = useState(null);
    const [socket, setSocket] = useState(null);

    // set margin for h1 title before \ after connection
    function setHeaderClass() {
        let classes = clientName ? "my-0 mb-0 mt-1 pb-1" : "my-3";
        return classes;
    }

    return (
        <React.Fragment>
            <header>
                <div className="container-fluid container-md bg-subtle mt-3 rounded-top header-height">
                    <div className="row text-center justify-content-center h-100 align-items-center border-bottom border-2 shadow">
                        <div
                            className={"col-12 col-md-auto " + setHeaderClass()}
                        >
                            <h1 className="align-center">
                                Live Public Chat Room
                            </h1>
                            {connected && (
                                <span
                                    onClick={() => setClientName("")}
                                    className="text-success"
                                >
                                    Connected as {clientName}
                                </span>
                            )}
                            {clientName && !connected && (
                                <span className="span-error">loading...</span>
                            )}
                        </div>
                    </div>
                </div>
            </header>
            <main>
                <div className="container-fluid container-md bg-subtle-transparent rounded-bottom shadow">
                    {!clientName && (
                        <Login
                            setClientName={setClientName}
                            setSocket={setSocket}
                        ></Login>
                    )}
                    {clientName && (
                        <ChatRoom
                            socket={socket}
                            setConnected={setConnected}
                            clientName={clientName}
                        ></ChatRoom>
                    )}
                </div>
            </main>
            <footer className="mt-4">
                <p className="border-top pb-3 pt-2 text-center mb-0">
                    Chatroom &copy; {new Date().getFullYear()}
                </p>
            </footer>
        </React.Fragment>
    );
}

export default App;
