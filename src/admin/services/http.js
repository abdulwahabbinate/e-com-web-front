const getHeaders = () => {
  const token = localStorage.getItem('admin_token')

  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  }
}

const parseResponse = async (response) => {
  const data = await response.json()

  if (!response.ok) {
    throw new Error(data?.message || 'Request failed')
  }

  return data
}

export const http = {
  get: async (url) => {
    const response = await fetch(url, {
      method: 'GET',
      headers: getHeaders(),
    })
    return parseResponse(response)
  },

  post: async (url, body) => {
    const response = await fetch(url, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(body),
    })
    return parseResponse(response)
  },

  put: async (url, body) => {
    const response = await fetch(url, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(body),
    })
    return parseResponse(response)
  },

  delete: async (url) => {
    const response = await fetch(url, {
      method: 'DELETE',
      headers: getHeaders(),
    })
    return parseResponse(response)
  },
}
