// Frontend integration layer - calls the backend endpoints if available, otherwise returns mocked data.

export async function InvokeLLM({ prompt }) {
  try {
    const res = await fetch("http://localhost:4000/api/invoke-llm", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt }),
    });
    return await res.json();
  } catch (e) {
    // fallback mock
    return {
      overall_score: 78,
      detailed_scores: { clarity: 82, grammar: 74, professionalism: 76 },
      feedback: "Mocked feedback: strong resume with minor grammar issues.",
      recommendations: ["Add measurable metrics", "Fix minor grammar errors"],
    };
  }
}

export async function UploadFile({ file }) {
  try {
    const fd = new FormData();
    fd.append("file", file);
    const res = await fetch("http://localhost:4000/api/upload", { method: "POST", body: fd });
    return await res.json();
  } catch (e) {
    return { file_url: null };
  }
}

export async function ExtractDataFromUploadedFile({ file_url, json_schema }) {
  try {
    const res = await fetch("http://localhost:4000/api/extract", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ file_url, json_schema }),
    });
    return await res.json();
  } catch (e) {
    return { status: "success", output: { content: "Extracted (mock) content from file." } };
  }
}
