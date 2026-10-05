import axios from "axios";

const API_URL = `${import.meta.env.VITE_API_URL}/api/v1/apartments`;

export const fetchApartments = async (params = {}) => {
  const response = await axios.get(API_URL, {
    params,
  });

  return response.data;
};

export const fetchApartmentById = async (id) => {
  const response = await axios.get(`${API_URL}/${id}`);

  return response.data;
};

export const fetchDistricts = async () => {
  const response = await axios.get(`${API_URL}/districts`);

  return response.data;
};
