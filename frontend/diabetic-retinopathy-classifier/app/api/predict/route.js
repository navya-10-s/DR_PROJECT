export async function POST(req) {
  try {
    const formData = await req.formData();

    // Use environment variable OR fallback to same-domain backend
    const BACKEND_URL =
      process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";

    const response = await fetch(`${BACKEND_URL}/predict`, {
      method: "POST",
      body: formData,
    });

    const data = await response.json();
    return Response.json(data);
  } catch (error) {
    console.error("API Error:", error);
    return Response.json({ error: "Prediction failed" }, { status: 500 });
  }
}
