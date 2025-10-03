import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { image, style, roomType } = await req.json();

    if (!image || !style || !roomType) {
      return NextResponse.json(
        { error: "Missing required fields (image, style, roomType)" },
        { status: 400 }
      );
    }

    const prompt = `A ${roomType.toLowerCase()} designed in ${style.toLowerCase()} style.`;

    // Run with 3 different seeds for variety
    const seeds = [111, 222, 333];

    const fetchPrediction = async (seed: number) => {
      const payload = {
        version:
          "76604baddc85b1b4616e1c6475eca080da339c8875bd4996705440484a6eac38", // RoomGPT model version
        input: {
          image, // Cloudinary-hosted image URL
          prompt,
          seed,
        },
      };

      // Step 1: Create prediction
      const predictionRes = await fetch(
        "https://api.replicate.com/v1/predictions",
        {
          method: "POST",
          headers: {
            Authorization: `Token ${process.env.REPLICATE_API_TOKEN}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      const prediction = await predictionRes.json();

      if (prediction.error) throw new Error(prediction.error);

      // Step 2: Poll until completed
      const getStatus = async () => {
        const statusRes = await fetch(prediction.urls.get, {
          headers: {
            Authorization: `Token ${process.env.REPLICATE_API_TOKEN}`,
          },
        });
        return statusRes.json();
      };

      let result = await getStatus();
      while (result.status !== "succeeded" && result.status !== "failed") {
        await new Promise((r) => setTimeout(r, 2000));
        result = await getStatus();
      }

      if (result.status === "succeeded") {
        console.log("🖼 Replicate Result:", result);

        const output = result.output;

        if (Array.isArray(output) && output.length > 0) {
          return output[0]; // use first image from this seed
        } else if (typeof output === "string") {
          return output; // sometimes replicate returns direct URL
        } else {
          throw new Error("Unexpected output format from Replicate");
        }
      } else {
        throw new Error("Prediction failed");
      }
    };

    // Run all predictions in parallel for speed
    const outputs = await Promise.all(seeds.map((s) => fetchPrediction(s)));

    console.log("✅ Final AI Images:", outputs);

    return NextResponse.json({ images: outputs });
  } catch (error: any) {
    console.error("❌ Error calling Replicate:", error);
    return NextResponse.json(
      { error: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
