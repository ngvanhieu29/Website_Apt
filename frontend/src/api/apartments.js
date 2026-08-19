import axios from 'axios';

const API = axios.create({
  baseURL: '/api/apartments',
});

export const fetchApartments = (params = {}) => API.get('/', { params });
export const fetchApartmentById = (id) => API.get(`/${id}`);
export const fetchDistricts = () => API.get('/districts');
