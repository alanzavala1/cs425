import axios from 'axios';

const API_URL = 'http://127.0.0.1:8000';

export const getUsers = async () => {
  try {
    const response = await axios.get(`${API_URL}/users/`);
    return response.data;
  } catch (error) {
    console.error('There was an error!', error);
  }
};