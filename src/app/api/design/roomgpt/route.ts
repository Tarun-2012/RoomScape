import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { image, style, roomType } = await req.json();

  const prompt = `A ${roomType.toLowerCase()} designed in ${style.toLowerCase()} style.`;

  const payload = {
    version: "76604baddc85b1b4616e1c6475eca080da339c8875bd4996705440484a6eac38", // Replace with latest if needed
    input: {
      image: image,
      prompt: prompt,
    },
  };

  console.log("🧠 Sending to Replicate:", payload);

  try {
    const predictionRes = await fetch("https://api.replicate.com/v1/predictions", {
      method: "POST",
      headers: {
        Authorization: `Token ${process.env.REPLICATE_API_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const prediction = await predictionRes.json();

    if (prediction.error) {
      console.error("❌ Prediction error:", prediction.error);
      return NextResponse.json({ error: prediction.error }, { status: 500 });
    }

    const getStatus = async () => {
      const statusRes = await fetch(prediction.urls.get, {
        headers: {
          Authorization: `Token ${process.env.REPLICATE_API_TOKEN}`,
        },
      });
      return statusRes.json();
    };

    // Wait for prediction to finish
    let result = await getStatus();
    while (result.status !== "succeeded" && result.status !== "failed") {
      await new Promise((r) => setTimeout(r, 2000));
      result = await getStatus();
    }

    if (result.status === "succeeded") {
      const output = result.output;
      console.log("✅ Final Image:", output);
      return NextResponse.json({ image: output });
    } else {
      return NextResponse.json({ error: "Prediction failed" }, { status: 500 });
    }
  } catch (error) {
    console.error("❌ Error calling Replicate:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
