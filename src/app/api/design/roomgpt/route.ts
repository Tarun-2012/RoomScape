import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { image, style, roomType } = await req.json();

    if (!image || !style || !roomType) {
      return NextResponse.json(
        { error: "Missing required fields (image, style, roomType)" },
        { status: 400 }
      );
    }

    const prompt = `A ${roomType.toLowerCase()} designed in ${style.toLowerCase()} style.`;

    // Seeds used to generate 3 variations
    const seeds = [111, 222, 333];

    // Helper function to call Replicate API for one seed
    const fetchPrediction = async (seed: number): Promise<string> => {
      const payload = {
        version:
          "76604baddc85b1b4616e1c6475eca080da339c8875bd4996705440484a6eac38",
        input: {
          image, // URL from Cloudinary
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

      // Step 2: Poll status until completed
      const pollResult = async () => {
        const statusRes = await fetch(prediction.urls.get, {
          headers: {
            Authorization: `Token ${process.env.REPLICATE_API_TOKEN}`,
          },
        });

        return statusRes.json();
      };

      let result = await pollResult();

      while (result.status !== "succeeded" && result.status !== "failed") {
        await new Promise((resolve) => setTimeout(resolve, 2000));
        result = await pollResult();
      }

      if (result.status === "succeeded") {
        const output = result.output;

        // Replicate sometimes returns array, sometimes string
        if (Array.isArray(output) && output.length > 0) {
          return output[0];
        } else if (typeof output === "string") {
          return output;
        } else {
          throw new Error("Unexpected output format from Replicate API");
        }
      }

      throw new Error("Prediction failed");
    };

    // Run all 3 predictions in parallel
    const images = await Promise.all(seeds.map((seed) => fetchPrediction(seed)));

    console.log("✅ Final AI Images:", images);

    return NextResponse.json({ images });
  } catch (error) {
    console.error("❌ Error calling Replicate:", error);

    const message =
      error instanceof Error ? error.message : "Internal Server Error";

    return NextResponse.json({ error: message }, { status: 500 });
  }
}
