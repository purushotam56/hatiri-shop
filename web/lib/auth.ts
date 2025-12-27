/**
 * Small auth helper for the demo login page.
 *
 * Adjust the endpoint (`/api/auth/login`) to match your backend.
 */

export type LoginResponse = {
  token?: string;
  message?: string;
};

export async function login(
  username: string,
  password: string,
): Promise<LoginResponse> {
  const res = await fetch("/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });

  // try to parse json body when present
  const body = await res.json().catch(() => ({}));

  if (!res.ok) {
    // backend may return { message }
    throw new Error(
      (body && (body.message || body.error)) ||
        res.statusText ||
        "Login failed",
    );
  }

  return body as LoginResponse;
}
