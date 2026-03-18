const getHeaders = (isFormData = false) => {
  const token = localStorage.getItem('admin_token')

  return {
    ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  }
}

const parseResponse = async (response) => {
  const data = await response.json().catch(() => ({}))

  if (!response.ok) {
    const error = new Error(data?.message || 'Request failed')
    error.response = data
    throw error
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
    const isFormData = body instanceof FormData

    const response = await fetch(url, {
      method: 'POST',
      headers: getHeaders(isFormData),
      body: isFormData ? body : JSON.stringify(body),
    })

    return parseResponse(response)
  },

  put: async (url, body) => {
    const isFormData = body instanceof FormData

    const response = await fetch(url, {
      method: 'PUT',
      headers: getHeaders(isFormData),
      body: isFormData ? body : JSON.stringify(body),
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