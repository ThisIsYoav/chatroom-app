import React, { useState } from 'react';
import { io } from "socket.io-client";
import { apiUrl } from "../config.json";
import Joi from 'joi-browser';
import validationService from '../services/validationService';

const Login = ({ setClientName, setSocket }) => {
    // displaying Login component until client has completed login, then sets App state with the name and socket connection. the ChatRoom component is then displayed
    const [nameInput, setNameInput] = useState('');
    const [error, setError] = useState('');

    // set the Joi validation schema
    const schema = {
        nameInput: Joi.string().min(1).max(255).required().label('Name')
    }

    // real time validation for user input
    function handleTyping({ target }) {
        setNameInput(target.value);
        const errorMessage = validationService.validateProperty(target.id, target.value, schema);
        if (errorMessage) setError(errorMessage);
        else setError('');
    }

    // validate the user input, create socket connection
    const handleLogin = () => {
        if (!nameInput) return;
        const errors = validationService.validate({ nameInput: nameInput }, schema);
        const firstError = errors ? errors[Object.keys(errors)[0]] : '';

        setError(firstError);
        if (errors) return;

        const socket = io.connect(apiUrl, { auth: { clientName: nameInput } });
        // setting App's state with the socket and client name
        setSocket(socket);
        setClientName(nameInput);
    }

    return (
        <div className='row justify-content-center bg-light align-items-center main-height' style={{ minHeight: 300 }}>
            <div className='col-sm-8 col-md-6 col-lg-5 col-xl-4 form-floating text-center rounded-3 bg-main'>
                <input onChange={handleTyping} className="col-10 py-1 mt-4 form-control text-center" id='nameInput' type="text" placeholder="Enter name" value={nameInput} />
                <label htmlFor='nameInput' className='mt-3 col-12 text-secondary'>Enter a name</label>
                <span className='my-1 error-field span-error'>{error}</span>
                <br />
                <input disabled={validationService.validate({ nameInput: nameInput }, schema)} onClick={() => {
                    handleLogin();
                }} className="col-6 py-2 mb-3 btn btn-success text-wrap" type="button" value="Join Chat" />
            </div>
        </div>
    );
}

export default Login;