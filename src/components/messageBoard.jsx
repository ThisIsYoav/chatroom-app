
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

	const validateMessage = () => validationService.validate({ clientName, textInput: currentMessage }, schema);

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
		const errors = validateMessage();
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
			<div className="channel row position-absolute col-12 col-sm-11 col-md-10 col-lg-9 col-xl-8 col-xxl-6">
				<div className="col-12 shadow-sm">
					{messages && messages.map((message) => { return <Message message={message} clientName={clientName} key={message._id} /> })}
					<div ref={messageRef} ></div>
				</div>
			</div>
			<div className="board-row row flex-grow-1 bg-subtle col-12 col-sm-11 col-md-10 col-lg-9 col-xl-8 col-xxl-6">
				<div className="col-12 h-100">
					<div className="row justify-content-evenly align-items-end mb-2">
						<span className='error-field d-none d-sm-block my-1'>{charsRemaining}</span>
						<div className='order-sm-2 col-10 col-sm-2 py-2 py-sm-0 ps-sm-1 flex-start '>
							<button disabled={validateMessage()} onClick={() => {
								handleSend()
							}} className="message-button btn btn-success py-1 w-100 col-12 rounded-3 text-break" type="button" >Send</button>
						</div>
						<div className='order-sm-1 col-11 col-sm-10 form-floating pe-sm-1 pr-0 h-100'>
							<textarea onChange={handleTyping} onKeyDown={handleKeyDown} className="form-control pt-0" id='textInput' placeholder="Say something i'm not giving up on you" value={currentMessage} />
							{!currentMessage && !charsRemaining && <label htmlFor='textInput' className='col-11 text-secondary px-3 py-2 mx-0 lh-sm fs-7'>Say something i'm not giving up on you</label>}
						</div>
					</div>
				</div>
			</div>
		</React.Fragment>
	);
}

export default MessageBoard;