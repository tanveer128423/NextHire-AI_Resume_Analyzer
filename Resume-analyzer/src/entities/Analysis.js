// Frontend wrapper for Analysis API with fallback
export const Analysis = {
  async create(data) {
    try {
      const res = await fetch("http://localhost:4000/api/analyses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      return await res.json();
    } catch (e) {
      // fallback local create
      return { id: Date.now(), created_date: new Date().toISOString(), ...data };
    }
  },

  async list(limit = 50) {
    try {
      const res = await fetch(`http://localhost:4000/api/analyses`);
      return await res.json();
    } catch (e) {
      return [];
    }
  },
};
