const COLLECTION_NAME = "mandir";
const API_KEY = "sk-02e44d2ccb164c738a6c4a65dbf75e89";
const BASE_URL = "https://api-staging.worqhat.com/api/collections/data";

export interface UserData {
  id?: string;
  name: string;
  amount: number;
}

export async function addUser(data: Omit<UserData, "id">) {
  try {
    const response = await fetch(`${BASE_URL}/add`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        collection: COLLECTION_NAME,
        data: {
          name: data.name,
          amount: Number(data.amount),
        },
      }),
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error("Error adding user:", error);
    throw error;
  }
}

export async function updateUser(id: string, data: Partial<UserData>) {
  console.log("Update User:", id, data);
  try {
    const response = await fetch(`${BASE_URL}/update`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        collection: COLLECTION_NAME,
        docId: id,
        data: {
          name: data.name,
          amount: data.amount ? Number(data.amount) : undefined,
        },
      }),
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error("Error updating user:", error);
    throw error;
  }
}

export async function deleteUser(id: string) {
  console.log("Delete User:", id);
  try {
    const response = await fetch(`${BASE_URL}/delete`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        collection: COLLECTION_NAME,
        docId: id,
      }),
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error("Error deleting user:", error);
    throw error;
  }
}

export async function getAllUsers() {
  try {
    const response = await fetch(`${BASE_URL}/fetch/all`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        collection: COLLECTION_NAME,
        format: "JSON",
      }),
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }

    const result = await response.json();
    console.log("Fetched users:", result.data);
    return result.data;
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error;
  }
}
