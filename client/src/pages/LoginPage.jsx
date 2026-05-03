import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Alert } from 'react-bootstrap';
import AuthForm from '../components/Form';
import { BASE_URL } from '../constants/constant';
import { saveSession } from '../services/sessionService';
import axios from 'axios';

function LoginPage() {
  const [status, setStatus] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (formData) => {
    setStatus('');

    try {
      const response = await axios.post(`${BASE_URL}/users/login`, formData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = response.data;
      saveSession(data.token);
      navigate('/dashboard');
    } catch (error) {
      setStatus(error.response?.data?.message || error.message);
    }
  };

  return (
    <div className="d-flex justify-content-center">
      <Card className="shadow-sm" style={{ width: '100%', maxWidth: '520px' }}>
        <Card.Body>
          <Card.Title>Login</Card.Title>
          <Card.Text className="text-muted mb-4">
            Enter your email and password to sign in.
          </Card.Text>

          <AuthForm mode="login" onSubmit={handleLogin} submitText="Login" />

          {status && <Alert variant="danger" className="mt-4">{status}</Alert>}
        </Card.Body>
      </Card>
    </div>
  );
}

export default LoginPage;
