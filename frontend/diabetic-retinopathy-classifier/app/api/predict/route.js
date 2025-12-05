export async function POST(req) {
  try {
    const formData = await req.formData();

    // CORRECTED URL (must start with /)
    const response = await fetch("http://localhost:5000/predict", {
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
