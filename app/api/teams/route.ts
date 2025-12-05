import { connect } from '@/lib/db';
import Team from '@/models/Team';

function jsonResponse(data: any, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

// GET /api/teams
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

    return jsonResponse(result);
  } catch (error: any) {
    console.error('Error fetching teams:', error);
    return jsonResponse({ error: error.message || 'Failed to fetch teams' }, 500);
  }
}

// POST /api/teams
export async function POST(req: Request) {
  try {
    await connect();
    const data = await req.json();

    if (!data.name || typeof data.name !== 'string') {
      return jsonResponse({ error: 'Team name is required' }, 400);
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

    return jsonResponse(result, 201);
  } catch (error: any) {
    console.error('Error creating team:', error);
    return jsonResponse({ error: error.message || 'Failed to create team' }, 500);
  }
}

// DELETE /api/teams?id=teamId
export async function DELETE(req: Request) {
  try {
    await connect();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return jsonResponse({ error: 'Team ID is required' }, 400);
    }

    const deleted = await Team.findByIdAndDelete(id);

    if (!deleted) {
      return jsonResponse({ error: 'Team not found' }, 404);
    }

    return jsonResponse({ message: 'Team deleted successfully' });
  } catch (error: any) {
    console.error('Error deleting team:', error);
    return jsonResponse({ error: error.message || 'Failed to delete team' }, 500);
  }
}
