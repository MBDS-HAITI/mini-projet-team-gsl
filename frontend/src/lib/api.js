const BASE_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:8010/api";

export async function postData(url, data, options = {}) {
  try {
    const response = await fetch(`${BASE_URL}${url}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      body: JSON.stringify(data),
      ...options,
    });

    if (!response.ok) {
      let errorMessage = `Error: ${response.status} ${response.statusText}`;
      const errorBody = await response.json();
      errorMessage = errorBody.message || errorMessage;
      throw new Error(errorMessage);
    }

    if (response.status === 204) {
      return null;
    }

    return await response.json();
  } catch (error) {
    console.error(`POST request to ${url} failed:`, error);
    throw error;
  }
}