const API_KEY = process.env.NEXT_PUBLIC_WORQHAT_API_KEY;
const COLLECTION_NAME = "mandir_users";

export interface UserData {
  id?: string;
  name: string;
  amount: number;
}

export async function addUser(data: Omit<UserData, "id">) {
  try {
    const response = await fetch(
      "https://api.worqhat.com/api/collections/data/add",
      {
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
      },
    );

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
  try {
    const response = await fetch(
      `https://api.worqhat.com/api/collections/data/update`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          collection: COLLECTION_NAME,
          id: id,
          data: {
            name: data.name,
            amount: data.amount ? Number(data.amount) : undefined,
          },
        }),
      },
    );

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
  try {
    const response = await fetch(
      `https://api.worqhat.com/api/collections/data/delete`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          collection: COLLECTION_NAME,
          id: id,
        }),
      },
    );

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
    const response = await fetch(
      `https://api.worqhat.com/api/collections/data/list`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          collection: COLLECTION_NAME,
        }),
      },
    );

    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }

    const result = await response.json();
    return result.data;
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error;
  }
}
