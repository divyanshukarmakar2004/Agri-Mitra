// Simple auth service for handling authentication
// This is a placeholder implementation that can be replaced with actual Firebase auth

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const auth = {
  // Sign out the current user
  signOut: async () => {
    await delay(800);
    localStorage.removeItem("auth_token");
    localStorage.removeItem("user_data");
    return { success: true };
  },
  // Check if user is authenticated
  isAuthenticated: () => {
    return !!localStorage.getItem("auth_token");
  },
};

export const API_BASE =
  import.meta.env.VITE_API_BASE || "http://localhost:5000";

async function handle(res) {
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function fetchFarmers() {
  const res = await fetch(`${API_BASE}/api/farmers`);
  return handle(res);
}

export async function fetchFarmerById(id) {
  const res = await fetch(`${API_BASE}/api/farmers/${id}`);
  return handle(res);
}

export async function fetchPestReport() {
  const res = await fetch(`${API_BASE}/api/pest-report`);
  return handle(res);
}

export async function createAlert(payload) {
  const res = await fetch(`${API_BASE}/api/alerts`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return handle(res);
}

export async function createScheme(payload) {
  const res = await fetch(`${API_BASE}/api/schemes`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return handle(res);
}

export async function createReport(payload) {
  const res = await fetch(`${API_BASE}/api/reports`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return handle(res);
}