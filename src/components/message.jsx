import React from 'react';

const Message = ({ message, clientName }) => {
    return (
        <div className="row my-2">
            <div className="col-auto">
                <div className="card shadow-sm">
                    <div className="card-body">
                        <h5 className="card-title">{message.clientName} {clientName === message.clientName && <span className='text-secondary'>(me)</span>} says:</h5>
                        <p className="card-text whitespace-newline">{message.messageText}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Message;