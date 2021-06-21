
import React, { useEffect, useState, useRef } from 'react';
import Message from "./message";
import Joi from 'joi-browser';
import validationService from '../services/validationService';

const MessageBoard = ({ socket, clientName }) => {
    const [messages, setMessages] = useState([]);
    const [charsRemaining, setCharsRemaining] = useState('');
    const [currentMessage, setCurrentMessage] = useState('');
    const messageRef = useRef(null);

    // listen to socket changes
    useEffect(() => {
        // listen to initial connection and set old messages
        const fetchMessages = oldMessages => {
            setMessages(oldMessages);
            messageRef.current.scrollIntoView({ behavior: 'smooth' });
        };

        socket.on('connectedToApi', fetchMessages);

        // listen to server for new messages
        const messageFromApi = messageDetails => {
            setMessages((olderMessages) => [...olderMessages, messageDetails]);
            messageRef.current.scrollIntoView({ behavior: 'smooth' });
        };

        socket.on('messageFromApi', messageFromApi);

        // remove room listeners on unmount ( i.e. when leaving current room )
        return () => {
            socket.off('messageFromApi', messageFromApi);
            socket.off('connectedToApi', fetchMessages);
        };

    }, [socket]);

    // set the Joi validation schema
    const schema = {
        clientName: Joi.string().min(1).max(255).required().label('Name'),
        textInput: Joi.string().min(1).max(1000).required().label('Message')
    }

    // handle 'enter' key when typing in message textarea
    const handleKeyDown = (event) => {
        if (event.key === 'Enter' && !event.shiftKey) {
            // prevent from both sending and inserting a new line
            event.preventDefault();
            if (currentMessage.length > 0) handleSend();
        }
    }

    // sets 'characters remaining' message
    function handleTyping({ target }) {
        setCurrentMessage(target.value);
        let remaining = 1000;
        remaining = target.value.length < 0 ? 0 : target.value.length;
        remaining = 1000 - remaining;
        remaining = remaining >= 0 ? `${remaining} character(s) remaining` : `Message exceeds max-character limit by ${Math.abs(remaining)}`
        setCharsRemaining(remaining);
    }

    // validate user details prior to send and set focus on message textarea
    const handleSend = () => {
        if (!currentMessage) return;
        const errors = validationService.validate({ clientName, textInput: currentMessage }, schema);
        if (errors) return;
        sendMessage();
        document.getElementById('textInput').focus();
    };

    // emit message to server and clear message and characters remaining states
    function sendMessage() {
        socket.emit('messageFromClient', { clientName, messageText: currentMessage }, (res) => {
            if (res.error) {
                setCharsRemaining(res.error.details[0].message);
            }
        });
        setCurrentMessage('');
        setCharsRemaining('');
    }

    return (
        <React.Fragment>
            <div className="row">
                <div className="col-12 channel-height channel shadow-sm">
                    {messages && messages.map((message) => { return <Message message={message} clientName={clientName} key={message._id} /> })}
                    <div ref={messageRef} ></div>
                </div>
            </div>
            <div className="row bg-subtle">
                <div className="col-12 message-board">
                    <span className='d-block my-1 error-field'>{charsRemaining}</span>
                    <div className="row justify-content-evenly align-items-center mb-2 message-board">
                        <div className='order-sm-2 col-10 col-sm-2 col-xl-1 py-2 py-sm-0  flex-start message-button '>
                            <button disabled={validationService.validate({ clientName, textInput: currentMessage }, schema)} onClick={() => {
                                handleSend()
                            }} className="btn btn-success py-3 w-100 col-12 rounded-3 text-break message-button" type="button" >Send</button>
                        </div>
                        <div className='order-sm-1 col-11 col-sm-10 col-md-10 col-xl-11 form-floating pr-0'>
                            <textarea onChange={handleTyping} onKeyDown={handleKeyDown} className="form-control unable-resize pt-0" id='textInput' placeholder="Say something i'm not giving up on you" value={currentMessage} />
                            {!currentMessage && !charsRemaining && <label htmlFor='textInput' className='col-11 text-secondary px-3 py-2 mx-0 lh-sm fs-7'>Say something i'm not giving up on you</label>}
                        </div>
                    </div>
                </div>
            </div>
        </React.Fragment>
    );
}

export default MessageBoard;