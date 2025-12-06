import { connect } from "@/lib/db";
import PlayerStat from "@/models/Player";
import formidable from "formidable";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const PATCH = async (req: Request, { params }: { params: { id: string } }) => {
  try {
    await connect();
    const form = formidable({ multiples: false });

    const data = await new Promise<any>((resolve, reject) => {
      form.parse(req as any, (err, fields, files) => {
        if (err) reject(err);
        resolve({ fields, files });
      });
    });

    if (!data.files.picture) {
      return new Response(JSON.stringify({ error: "No picture provided" }), { status: 400 });
    }

    const file = data.files.picture as formidable.File;

    const uploadResult = await cloudinary.uploader.upload(file.filepath, {
      folder: "players",
      width: 200,
      height: 200,
      crop: "fill",
      quality: "auto",
    });

    const updatedPlayer = await PlayerStat.findByIdAndUpdate(
      params.id,
      { picture: uploadResult.secure_url },
      { new: true }
    );

    if (!updatedPlayer) {
      return new Response(JSON.stringify({ error: "Player not found" }), { status: 404 });
    }

    return new Response(JSON.stringify(updatedPlayer), { status: 200 });
  } catch (err: any) {
    console.error("Error updating player picture:", err);
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
};
