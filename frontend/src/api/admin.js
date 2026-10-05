const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api/v1";

/* =========================================================
   ADMIN LOGIN
========================================================= */

export const adminLogin = async (username, password) => {
  const response = await fetch(`${API_URL}/admin/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      username,
      password,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Login failed");
  }

  return data;
};

/* =========================================================
   ADMIN REQUEST
========================================================= */

export const adminRequest = async (endpoint, options = {}) => {
  const token = localStorage.getItem("adminToken");

  if (!token) {
    throw new Error("Bạn chưa đăng nhập Admin");
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,

    headers: {
      "Content-Type": "application/json",

      Authorization: `Bearer ${token}`,

      ...(options.headers || {}),
    },
  });

  let data = {};

  try {
    data = await response.json();
  } catch {
    data = {};
  }

  if (!response.ok) {
    if (response.status === 401) {
      localStorage.removeItem("adminToken");
    }

    throw new Error(data.message || "Request failed");
  }

  return data;
};

/* =========================================================
   GET ADMIN APARTMENTS
========================================================= */

export const getAdminApartments = async (params = {}) => {
  const query = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      query.set(key, String(value));
    }
  });

  const queryString = query.toString();

  const endpoint = `/apartments/admin/all${
    queryString ? `?${queryString}` : ""
  }`;

  return adminRequest(endpoint);
};

/* =========================================================
   CREATE
========================================================= */

export const createApartment = async (apartment) => {
  return adminRequest("/apartments", {
    method: "POST",

    body: JSON.stringify(apartment),
  });
};

/* =========================================================
   UPDATE
========================================================= */

export const updateApartment = async (id, apartment) => {
  return adminRequest(`/apartments/${id}`, {
    method: "PUT",

    body: JSON.stringify(apartment),
  });
};

/* =========================================================
   DELETE
========================================================= */

export const deleteApartment = async (id) => {
  return adminRequest(`/apartments/${id}`, {
    method: "DELETE",
  });
};

/* =========================================================
   UPDATE AVAILABILITY
========================================================= */

export const updateAvailability = async (id, available) => {
  return adminRequest(`/apartments/${id}/availability`, {
    method: "PATCH",

    body: JSON.stringify({
      available,
    }),
  });
};

/* =========================================================
   UPLOAD IMAGES
========================================================= */

export const uploadImages = async (files) => {
  const token = localStorage.getItem("adminToken");

  if (!token) {
    throw new Error("Bạn chưa đăng nhập Admin");
  }

  const formData = new FormData();

  files.forEach((file) => {
    formData.append("images", file);
  });

  /*
    QUAN TRỌNG:
    Không set Content-Type thủ công.

    Browser sẽ tự thêm:
    multipart/form-data; boundary=...
  */
  const response = await fetch(`${API_URL}/images/upload`, {
    method: "POST",

    headers: {
      Authorization: `Bearer ${token}`,
    },

    body: formData,
  });

  let data = {};

  try {
    data = await response.json();
  } catch {
    data = {};
  }

  if (!response.ok) {
    throw new Error(data.message || "Upload images failed");
  }

  return data;
};

/* =========================================================
   DELETE CLOUDINARY IMAGE
========================================================= */

export const deleteImage = async (publicId) => {
  return adminRequest("/images/delete", {
    method: "POST",

    body: JSON.stringify({
      publicId,
    }),
  });
};
