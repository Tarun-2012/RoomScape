import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { image, style, roomType } = await req.json();

    if (!image || !style || !roomType) {
      return NextResponse.json(
        { error: "Missing fields (image, style, roomType)" },
        { status: 400 }
      );
    }

    const prompt = `A ${roomType.toLowerCase()} designed in ${style.toLowerCase()} style.`;

    const modelVersion =
      "76604baddc85b1b4616e1c6475eca080da339c8875bd4996705440484a6eac38";

    async function runSeed(seed: number): Promise<string> {
      // 1. Create prediction
      const createRes = await fetch("https://api.replicate.com/v1/predictions", {
        method: "POST",
        headers: {
          Authorization: `Token ${process.env.REPLICATE_API_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          version: modelVersion,
          input: { image, prompt, seed },
        }),
      });

      const prediction = await createRes.json();
      console.log("Replicate prediction response:", prediction);

      if (!prediction.urls || !prediction.urls.get) {
        throw new Error("Replicate did not return a valid prediction URL");
      }

      // 2. Poll status UNTIL finished
      async function poll() {
        const res = await fetch(prediction.urls.get, {
          headers: {
            Authorization: `Token ${process.env.REPLICATE_API_TOKEN}`,
          },
        });

        const data = await res.json();
        return data;
      }

      let result = await poll();

      while (result.status !== "succeeded" && result.status !== "failed") {
        await new Promise((r) => setTimeout(r, 2500));
        result = await poll();
      }

      if (result.status === "failed") {
        throw new Error("Replicate failed for seed " + seed);
      }

      const output = result.output;

      if (Array.isArray(output) && output.length > 0) return output[0];
      if (typeof output === "string") return output;

      throw new Error("Unexpected Replicate output");
    }

    // -------------------------------
    // RUN SEEDS **SEQUENTIALLY**
    // -------------------------------
    const images: string[] = [];

    for (const seed of [111, 222, 333]) {
      console.log("⚡ Running seed:", seed);
      const img = await runSeed(seed);
      images.push(img);
      await new Promise((r) => setTimeout(r, 11000)); // wait 11 seconds per Replicate limit
    }

    return NextResponse.json({ images });
  } catch (error: any) {
    console.error("❌ Replicate API Error:", error);
    return NextResponse.json(
      { error: error?.message || "Internal error" },
      { status: 500 }
    );
  }
}
