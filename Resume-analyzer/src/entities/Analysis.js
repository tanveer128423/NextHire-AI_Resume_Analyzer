const API_BASE = import.meta.env.VITE_API_BASE_URL;

export const Analysis = {
  async create(data) {
    // Analysis is saved server-side when invoke-llm is called
    // This method is a placeholder for potential future database integration
    return data;
  },

  async list() {
    const res = await fetch(`${API_BASE}/api/analyses`);
    if (!res.ok) {
      throw new Error("Failed to fetch history");
    }
    return await res.json();
  },
};
