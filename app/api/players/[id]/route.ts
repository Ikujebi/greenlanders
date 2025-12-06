import { NextRequest, NextResponse } from "next/server";
import { connect } from "@/lib/db";
import PlayerStat from "@/models/Player";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connect();

    const form = await request.formData();
    const file = form.get("picture") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No picture provided" }, { status: 400 });
    }

    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Cloudinary upload using stream
    const uploadResult = await new Promise((resolve, reject) => {
      const upload = cloudinary.uploader.upload_stream(
        {
          folder: "players",
          width: 200,
          height: 200,
          crop: "fill",
          quality: "auto",
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );

      upload.end(buffer);
    });

    // Update player picture in DB
    const updatedPlayer = await PlayerStat.findByIdAndUpdate(
      params.id,
      { picture: (uploadResult as any).secure_url },
      { new: true }
    );

    return NextResponse.json(updatedPlayer, { status: 200 });
  } catch (err: any) {
    console.error("Error updating player picture:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
