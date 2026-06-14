const API_URL = 'http://127.0.0.1:1337/api';

export const registerUser = async (username: string, email: string, password: string) => {
  const response = await fetch(`${API_URL}/auth/local/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, email, password })
  });
  return response.json();
};

export const loginUser = async (identifier: string, password: string) => {
  const response = await fetch(`${API_URL}/auth/local`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ identifier, password })
  });
  return response.json();
};

export const fetchTodos = async (token: string, userId: number) => {
  const response = await fetch(
    `${API_URL}/todo-lists?filters[users_permissions_user][id][$eq]=${userId}&sort[0]=createdAt:desc`,
    {
      headers: { 'Authorization': `Bearer ${token}` }
    }
  );
  const data = await response.json();
  if (data && data.data) {
    data.data = data.data.map((item: any) => ({
      id: item.id,
      documentId: item.documentId,
      title: item.Title || '',
      description: item.description || '',
      isCompleted: item.isCompleted || false
    }));
  }
  return data;
};

export const createTodo = async (token: string, title: string, description: string, userId: number) => {
  const response = await fetch(`${API_URL}/todo-lists`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({
      data: {
        Title: title,
        description: description,
        users_permissions_user: userId,
        isCompleted: false
      }
    })
  });
  
  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Failed to create: ${text}`);
  }
  
  return response.json();
};

export const updateTodoStatus = async (token: string, id: string | number, isCompleted: boolean) => {
  const res = await fetch(`${API_URL}/todo-lists/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ data: { isCompleted } }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Failed to update: ${text}`);
  }

  return res.json();
};

export const deleteTodo = async (token: string, id: string | number) => {
  const res = await fetch(`${API_URL}/todo-lists/${id}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Failed to delete: ${text}`);
  }

  return res.json();
};

