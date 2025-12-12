import { NextResponse } from "next/server";
import { connect } from "@/lib/db";
import PlayerStat from "@/models/Player";
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
    return NextResponse.json(players, { status: 200 });
  } catch (err: any) {
    console.error("Failed to fetch players:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// POST: create a new player (NO FORMIDABLE)
export async function POST(req: Request) {
  try {
    await connect();

    const formData = await req.formData();

    const name = formData.get("name") as string;
    const teamId = formData.get("teamId") as string;
    const picture = formData.get("picture") as File | null;

    if (!name || !teamId) {
      return NextResponse.json(
        { error: "Name and teamId are required" },
        { status: 400 }
      );
    }

    let pictureUrl = "";

    // Handle file upload
    if (picture) {
      const arrayBuffer = await picture.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      const uploadResult = await new Promise<any>((resolve, reject) => {
        cloudinary.uploader
          .upload_stream(
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
          )
          .end(buffer);
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

    return NextResponse.json(player, { status: 201 });
  } catch (err: any) {
    console.error("Error creating player:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
