import "./App.css";
import React, { useState } from "react";
import ChatRoom from "./components/chatRoom";
import Login from "./components/login";

function App() {
	// displaying Login component until client has completed login, then sets app state with the name and socket connection. the ChatRoom component is then displayed
	const [clientName, setClientName] = useState("");
	const [connected, setConnected] = useState(null);
	const [socket, setSocket] = useState(null);

	return (
		<React.Fragment>
			<div className="container-fluid h-100 d-flex flex-column">
				<header className="row text-center justify-content-center align-items-center">
					<div
						className="col-12 col-sm-11 col-md-10 col-lg-9 col-xl-8 col-xxl-6 bg-subtle rounded-top border-bottom border-2 shadow pb-1">
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
				</header>
				<main className="row flex-grow-1 justify-content-center position-relative">
					<div className='bg-subtle-transparent col-12 col-sm-11 col-md-10 col-lg-9 col-xl-8 col-xxl-6 rounded-bottom d-flex flex-column shadow'>
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
				<footer className="row">
					<p className="footer-text col-12 border-top pb-1 pt-0 text-center mb-0">
						Chatroom &copy; {new Date().getFullYear()}
					</p>
				</footer>
			</div>
		</React.Fragment>
	);
}

export default App;
