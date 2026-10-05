const API_URL =
  import.meta.env.VITE_API_URL ||
  'http://localhost:5000/api/v1';


// ========================================
// ADMIN LOGIN
// ========================================

export const adminLogin = async (
  username,
  password
) => {
  const response = await fetch(
    `${API_URL}/admin/login`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username,
        password,
      }),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || 'Login failed'
    );
  }

  return data;
};


// ========================================
// ADMIN REQUEST
// ========================================

export const adminRequest = async (
  endpoint,
  options = {}
) => {
  const token =
    localStorage.getItem('adminToken');

  const response = await fetch(
    `${API_URL}${endpoint}`,
    {
      ...options,
      headers: {
        'Content-Type': 'application/json',

        Authorization: `Bearer ${token}`,

        ...options.headers,
      },
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || 'Request failed'
    );
  }

  return data;
};


// ========================================
// GET ALL APARTMENTS FOR ADMIN
// ========================================

export const getAdminApartments = async () => {
  return adminRequest(
    '/apartments/admin/all'
  );
};


// ========================================
// CREATE
// ========================================

export const createApartment = async (
  apartment
) => {
  return adminRequest(
    '/apartments',
    {
      method: 'POST',
      body: JSON.stringify(apartment),
    }
  );
};


// ========================================
// UPDATE
// ========================================

export const updateApartment = async (
  id,
  apartment
) => {
  return adminRequest(
    `/apartments/${id}`,
    {
      method: 'PUT',
      body: JSON.stringify(apartment),
    }
  );
};


// ========================================
// DELETE
// ========================================

export const deleteApartment = async (id) => {
  return adminRequest(
    `/apartments/${id}`,
    {
      method: 'DELETE',
    }
  );
};


// ========================================
// AVAILABILITY
// ========================================

export const updateAvailability = async (
  id,
  available
) => {
  return adminRequest(
    `/apartments/${id}/availability`,
    {
      method: 'PATCH',
      body: JSON.stringify({
        available,
      }),
    }
  );
};


export const uploadImages = async (files) => {
  const token = localStorage.getItem('adminToken');

  const formData = new FormData();

  files.forEach((file) => {
    formData.append('images', file);
  });

  const response = await fetch(`${API_URL}/images/upload`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Upload ảnh thất bại');
  }

  return data;
};

export const deleteImage = async (publicId) => {
  const token = localStorage.getItem('adminToken');

  const response = await fetch(`${API_URL}/images`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      publicId,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Xóa ảnh thất bại');
  }

  return data;
};