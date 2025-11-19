import { v2 as cloudinary } from "cloudinary";
import { NextRequest, NextResponse } from "next/server";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});

export async function POST(req: NextRequest) {
  try {
    const { base64Image } = await req.json();

    if (!base64Image) {
      return NextResponse.json(
        { error: "Missing image data" },
        { status: 400 }
      );
    }

    const uploadRes = await cloudinary.uploader.upload(base64Image, {
      folder: "interior-ai",
    });

    return NextResponse.json({ url: uploadRes.secure_url });
  } catch (error) {
    console.error("❌ Cloudinary Error:", error);
    return NextResponse.json(
      { error: "Upload failed" },
      { status: 500 }
    );
  }
}
