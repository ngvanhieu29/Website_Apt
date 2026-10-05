import axios from "axios";

const API_URL = "http://localhost:5000/api/v1/apartments";

/* =========================================================
   GET APARTMENTS
========================================================= */

export const fetchApartments = async (params = {}) => {
  const response = await axios.get(API_URL, {
    params,
  });

  return response.data;
};

/* =========================================================
   GET APARTMENT DETAIL
========================================================= */

export const fetchApartmentById = async (id) => {
  const response = await axios.get(`${API_URL}/${id}`);

  return response.data;
};

/* =========================================================
   GET DISTRICTS
========================================================= */

export const fetchDistricts = async () => {
  const response = await axios.get(`${API_URL}/districts`);

  return response.data;
};
