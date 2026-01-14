const API_BASE_URL = 'http://localhost:8010/api';

async function getAuthToken() {
  try {
    if (window.Clerk && window.Clerk.session) {
      return await window.Clerk.session.getToken();
    }
  } catch (error) {
    console.error('Token error:', error);
  }
  return null;
}

async function apiRequest(endpoint, options = {}) {
  const token = await getAuthToken();
  
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  const url = `${API_BASE_URL}${endpoint}`;
  
  console.log(`🌐 ${options.method || 'GET'} ${url}`);
  
  const response = await fetch(url, { ...options, headers });
  const data = await response.json();
  
  if (!response.ok) {
    console.error(`❌ Error ${response.status}:`, data);
    throw {
      response: { status: response.status, data },
      message: data.error || `HTTP ${response.status}`
    };
  }
  
  console.log(`✅ Success`);
  return { data };
}

export const studentAPI = {
  getAll: () => apiRequest('/students'),
  getById: (id) => apiRequest(`/students/${id}`),
  create: (data) => apiRequest('/students', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  update: (id, data) => apiRequest(`/students/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  delete: (id) => apiRequest(`/students/${id}`, {
    method: 'DELETE',
  }),
};

export const courseAPI = {
  getAll: () => apiRequest('/courses'),
  getById: (id) => apiRequest(`/courses/${id}`),
  create: (data) => apiRequest('/courses', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  update: (id, data) => apiRequest(`/courses/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  delete: (id) => apiRequest(`/courses/${id}`, {
    method: 'DELETE',
  }),
};

export const gradeAPI = {
  getAll: () => apiRequest('/grades'),
  getById: (id) => apiRequest(`/grades/${id}`),
  getMyGrades: () => apiRequest('/grades/my-grades'),
  create: (data) => apiRequest('/grades', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  update: (id, data) => apiRequest(`/grades/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  delete: (id) => apiRequest(`/grades/${id}`, {
    method: 'DELETE',
  }),
};

export const userAPI = {
  getAll: () => apiRequest('/users'),
  getById: (id) => apiRequest(`/users/${id}`),
  update: (id, data) => apiRequest(`/users/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  delete: (id) => apiRequest(`/users/${id}`, {
    method: 'DELETE',
  }),
};