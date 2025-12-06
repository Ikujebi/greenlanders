import { connect } from "@/lib/db";
import PlayerStat from "@/models/Player";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  try {
    await connect();

    const form = await req.formData();
    const file = form.get("picture") as File | null;

    if (!file) {
      return new Response(JSON.stringify({ error: "No picture provided" }), { status: 400 });
    }

    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Upload to Cloudinary
    const uploadResult = await cloudinary.uploader.upload_stream(
      {
        folder: "players",
        width: 200,
        height: 200,
        crop: "fill",
        quality: "auto",
      },
      async (error, result) => {
        if (error || !result) {
          console.error("Cloudinary upload error:", error);
          return new Response(JSON.stringify({ error: "Upload failed" }), { status: 500 });
        }

        const updatedPlayer = await PlayerStat.findByIdAndUpdate(
          params.id,
          { picture: result.secure_url },
          { new: true }
        );

        return new Response(JSON.stringify(updatedPlayer), { status: 200 });
      }
    );

    uploadResult.end(buffer);
  } catch (err: any) {
    console.error("Error updating player picture:", err);
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}
