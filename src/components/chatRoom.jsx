
import React, { useEffect } from 'react';
import MessageBoard from "./messageBoard";

// waits until socket connection to server is alive, then sets status to online and returns MessageBoard component
const ChatRoom = ({ socket, setConnected, clientName }) => {

    useEffect(() => {
        socket.on("connectedToApi", () => setConnected(true));

        socket.on('disconnect', () => setConnected(null))

        // disconnect when exiting the room lobby ( i.e. when navigating to login )
        return () => {
            if (socket) socket.disconnect();
            // remove any listeners the socket still holds
            socket.removeAllListeners();
        };

    }, [setConnected, socket]);

    return (
        <MessageBoard socket={socket} clientName={clientName}></MessageBoard>
    );
}

export default ChatRoom;