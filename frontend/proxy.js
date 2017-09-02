import axios from 'axios';

export const login = (username, password) => axios.post('/login', { username, password });

export const register = (username, password) => axios.post('/register', { username, password });

export const logout = () => axios.delete('/logout');

export const getLoggedUser = () =>
  axios.get('/login')
  .then(res => res.data)
  .catch(() => undefined);
