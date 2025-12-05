import { connect } from '@/lib/db';
import Team from '@/models/Team';

export async function GET() {
  try {
    await connect();
    const teams = await Team.find();

    // Transform _id to id for frontend
    const result = teams.map((team) => ({
      id: team._id.toString(),
      name: team.name,
      logo: team.logo,
    }));

    return new Response(JSON.stringify(result), { status: 200 });
  } catch (error) {
    console.error('Error fetching teams:', error);
    return new Response('Failed to fetch teams', { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await connect();
    const data = await req.json();

    if (!data.name || typeof data.name !== 'string') {
      return new Response('Team name is required', { status: 400 });
    }

    const team = await Team.create({
      name: data.name,
      logo: data.logo || '',
    });

    // Transform _id to id for frontend
    const result = {
      id: team._id.toString(),
      name: team.name,
      logo: team.logo,
    };

    return new Response(JSON.stringify(result), { status: 201 });
  } catch (error) {
    console.error('Error creating team:', error);
    return new Response('Failed to create team', { status: 500 });
  }
}

// DELETE /api/teams?id=teamId
export async function DELETE(req: Request) {
  try {
    await connect();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return new Response('Team ID is required', { status: 400 });
    }

    const deleted = await Team.findByIdAndDelete(id);

    if (!deleted) {
      return new Response('Team not found', { status: 404 });
    }

    return new Response(JSON.stringify({ message: 'Team deleted' }), { status: 200 });
  } catch (error) {
    console.error('Error deleting team:', error);
    return new Response('Failed to delete team', { status: 500 });
  }
}
