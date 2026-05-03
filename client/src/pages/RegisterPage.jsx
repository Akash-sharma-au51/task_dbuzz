import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Alert } from 'react-bootstrap';
import AuthForm from '../components/Form';
import { BASE_URL } from '../constants/constant';
import { saveSession } from '../services/sessionService';
import axios from 'axios';

function RegisterPage() {
  const [status, setStatus] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (formData) => {
    setStatus('');

    try {
      const response = await axios.post(`${BASE_URL}/users/register`, formData, {
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
          <Card.Title>Create an account</Card.Title>
          <Card.Text className="text-muted mb-4">
            Enter your name, email, and password to create a new account.
          </Card.Text>

          <AuthForm mode="register" onSubmit={handleRegister} submitText="Register" />

          {status && <Alert variant="danger" className="mt-4">{status}</Alert>}
        </Card.Body>
      </Card>
    </div>
  );
}

export default RegisterPage;
