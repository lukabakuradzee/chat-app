import React, { useState } from 'react';
import { forgotUsername } from '../../api/services/userServices';
import { BarLoader } from 'react-spinners';

function ForgetUsernameModal() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await forgotUsername(email);
      setMessage(response.message);
      console.log("Response: ", response)
    } catch (error) {
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  };
  console.log("")

  if (loading) return <div>loading...</div>;

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <label>Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <button type="submit">Request Username</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}

export default ForgetUsernameModal;
