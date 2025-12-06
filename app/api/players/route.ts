import { connect } from "@/lib/db";
import PlayerStat from "@/models/Player";
import formidable from "formidable";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// GET: fetch all players
export async function GET() {
  try {
    await connect();
    const players = await PlayerStat.find().populate("teamId");
    return new Response(JSON.stringify(players), { status: 200 });
  } catch (err: any) {
    console.error("Failed to fetch players:", err);
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}

// POST: create a new player
export async function POST(req: Request) {
  try {
    await connect();

    const form = formidable({ multiples: false });

    const data = await new Promise<any>((resolve, reject) => {
      form.parse(req as any, (err, fields, files) => {
        if (err) reject(err);
        resolve({ fields, files });
      });
    });

    const { name, teamId } = data.fields;
    if (!name || !teamId)
      return new Response(JSON.stringify({ error: "Name and teamId are required" }), { status: 400 });

    let pictureUrl: string | undefined;

    if (data.files.picture) {
      const file = data.files.picture as formidable.File;
      const uploadResult = await cloudinary.uploader.upload(file.filepath, {
        folder: "players",
        width: 200,
        height: 200,
        crop: "fill",
        quality: "auto",
      });
      pictureUrl = uploadResult.secure_url;
    }

    const player = await PlayerStat.create({
      name,
      teamId,
      goals: 0,
      assists: 0,
      yellowCards: 0,
      redCards: 0,
      picture: pictureUrl,
    });

    return new Response(JSON.stringify(player), { status: 201 });
  } catch (err: any) {
    console.error("Error creating player:", err);
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}
