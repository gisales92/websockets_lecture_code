import React, { useState } from 'react';

const ValidationErrors = ({ errors }) => {
  if (errors === null || errors.length === 0) {
    return null;
  }

  return (
    <div>
      <p>Please correct the following errors:</p>
      <ul>
        { errors.map(error => <li key={error}>{error}</li>) }
      </ul>
    </div>
  );
};

const Home = ({ updateUsername }) => {
  const [username, setUsername] = useState('');
  const [errors, setErrors] = useState([]);

  const onChange = (e) => {
    setUsername(e.target.value);
  };

  const onSubmit = (e) => {
    e.preventDefault();

    const errorsToSet = [];

    if (!username) {
      errorsToSet.push('Please provide a username.');
    }

    if (errorsToSet.length > 0) {
      setErrors(errorsToSet);
      return;
    }

    updateUsername(username);
  };

  return (
    <div className='wrapper'>
      <h1>Welcome to the WebSockets Chat Room!</h1>
      <p>Please provide your username and
        click the "Chat Now" button to start chatting.</p>
      <ValidationErrors errors={errors} />
      <form onSubmit={onSubmit}>
        <input type='text' value={username}
          onChange={onChange} />
        <button>Chat Now</button>
      </form>
    </div>
  );
}

export default Home;