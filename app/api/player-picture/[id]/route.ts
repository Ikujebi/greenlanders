import { NextRequest, NextResponse } from "next/server";
import { connect } from "@/lib/db";
import PlayerStat from "@/models/Player";
import { v2 as cloudinary } from "cloudinary";
import streamifier from "streamifier";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> } // <- params is a Promise
) {
  try {
    await connect();

    // Unwrap the promise to get the actual ID
    const { id: playerId } = await params;

    const form = await request.formData();
    const file = form.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No picture provided" }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    // Upload to Cloudinary using a stream
    const uploadResult: any = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
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
      streamifier.createReadStream(buffer).pipe(stream);
    });

    // Update player picture in DB
    const updatedPlayer = await PlayerStat.findByIdAndUpdate(
      playerId, // <- use unwrapped ID
      { picture: uploadResult.secure_url },
      { new: true }
    );

    if (!updatedPlayer) {
      return NextResponse.json({ error: "Player not found" }, { status: 404 });
    }

    return NextResponse.json(updatedPlayer, { status: 200 });
  } catch (err: any) {
    console.error("Error updating player picture:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
