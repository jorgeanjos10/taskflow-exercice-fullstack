export async function apiFetch(
  path: string,
  method: string,
  userId?: string,
  body?: any
) {
  const response = await fetch(`http://localhost:8080/api${path}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(userId && { "X-USER-ID": userId }),
    },
    ...(body && { body: JSON.stringify(body) }),
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw {
      status: response.status,
      message: data?.message || "Something went wrong",
    };
  }

  return data;
}