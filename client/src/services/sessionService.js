export const getToken = () => sessionStorage.getItem('token');

export const getUser = () => {
  const userJson = sessionStorage.getItem('user');
  if (!userJson) return null;

  try {
    return JSON.parse(userJson);
  } catch {
    return null;
  }
};

const decodeTokenPayload = (token) => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const padded = base64.padEnd(Math.ceil(base64.length / 4) * 4, '=');
    return JSON.parse(atob(padded));
  } catch {
    return null;
  }
};

export const saveSession = (token) => {
  sessionStorage.setItem('token', token);

  const payload = decodeTokenPayload(token);
  if (!payload) return null;

  const user = {
    id: payload.id,
    email: payload.email,
    isAdmin: payload.isAdmin || false,
  };
  sessionStorage.setItem('user', JSON.stringify(user));
  return user;
};

export const clearSession = () => {
  sessionStorage.removeItem('token');
  sessionStorage.removeItem('user');
};
