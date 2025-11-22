import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic"; // needed for Vercel serverless

export async function POST(req: NextRequest) {
  try {
    const { image, style, roomType } = await req.json();

    if (!image || !style || !roomType) {
      return NextResponse.json(
        { error: "Missing required fields (image, style, roomType)" },
        { status: 400 }
      );
    }

    const prompt = A ${roomType.toLowerCase()} designed in ${style.toLowerCase()} style.;

    // ==== Replicate Model Version ====
    const MODEL_VERSION =
      "76604baddc85b1b4616e1c6475eca080da339c8875bd4996705440484a6eac38";

    // === Instead of polling → use Replicate STREAM API ===
    const streamRes = await fetch("https://api.replicate.com/v1/predictions", {
      method: "POST",
      headers: {
        Authorization: Token ${process.env.REPLICATE_API_TOKEN},
        "Content-Type": "application/json",
        Prefer: "wait",
      },
      body: JSON.stringify({
        version: MODEL_VERSION,
        input: {
          image,
          prompt,
          seed: 111, // We will generate 3 images separately
        },
      }),
    });

    const prediction1 = await streamRes.json();

    if (prediction1?.error) {
      return NextResponse.json({ error: prediction1.error }, { status: 500 });
    }

    // FETCH THE OUTPUT DIRECTLY (streaming auto-resolves the final result)
    const output1 = prediction1.output;

    // RUN 2ND + 3RD PREDICTIONS IN PARALLEL (with "Prefer: wait" mode)
    const fetchImage = async (seed: number) => {
      const r = await fetch("https://api.replicate.com/v1/predictions", {
        method: "POST",
        headers: {
          Authorization: Token ${process.env.REPLICATE_API_TOKEN},
          "Content-Type": "application/json",
          Prefer: "wait",
        },
        body: JSON.stringify({
          version: MODEL_VERSION,
          input: { image, prompt, seed },
        }),
      });

      const json = await r.json();
      return json.output?.[0] || null;
    };

    const [img2, img3] = await Promise.all([
      fetchImage(222),
      fetchImage(333),
    ]);

    const finalImages = [
      output1?.[0] || null,
      img2,
      img3,
    ].filter(Boolean);

    if (finalImages.length === 0) {
      return NextResponse.json(
        { error: "Replicate returned no images." },
        { status: 500 }
      );
    }

    return NextResponse.json({ images: finalImages });
  } catch (err: any) {
    console.error("❌ Replicate API Error:", err);
    return NextResponse.json(
      { error: err.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}