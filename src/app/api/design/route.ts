// import { NextRequest, NextResponse } from "next/server";

// export async function POST(req: NextRequest) {
//   const { input } = await req.json();

//   try {
//     const response = await fetch("https://api.replicate.com/v1/predictions", {
//       method: "POST",
//       headers: {
//         "Authorization": `Bearer ${process.env.REPLICATE_API_TOKEN}`,
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({ input }),
//     });

//     const data = await response.json();
//     return NextResponse.json(data);
//   } catch (error) {
//     return NextResponse.json({ message: "Internal Server Error", error }, { status: 500 });
//   }
// }

import { v2 as cloudinary } from "cloudinary";
import { NextRequest, NextResponse } from "next/server";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(req: NextRequest) {
  const { base64Image } = await req.json();

  try {
    const uploadRes = await cloudinary.uploader.upload(base64Image, {
      folder: "interior-ai",
    });

    console.log("✅ Upload Response:", uploadRes); // Add this for debugging

    return NextResponse.json({ url: uploadRes.secure_url }); // ✅ Ensure this is "secure_url"
  } catch (error) {
    console.error("❌ Cloudinary upload failed:", error);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
