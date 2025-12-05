import { connect } from '@/lib/db';
import Fixture from '@/models/Fixture';

export async function GET() {
  await connect();
  try {
    const fixtures = await Fixture.find({});
    return new Response(JSON.stringify(fixtures), { status: 200 });
  } catch (err) {
    console.error('Error fetching fixtures:', err);
    return new Response(JSON.stringify({ error: 'Failed to fetch fixtures' }), { status: 500 });
  }
}

export async function POST(req: Request) {
  await connect();
  try {
    const data = await req.json();

    if (!Array.isArray(data)) {
      return new Response(JSON.stringify({ error: 'Expected an array of fixtures' }), { status: 400 });
    }

    // Insert all fixtures at once
    const createdFixtures = await Fixture.insertMany(data, { ordered: true });
    console.log('Fixtures inserted:', createdFixtures);

    // Return created fixtures
    return new Response(JSON.stringify(createdFixtures), { status: 201 });
  } catch (err) {
    console.error('Error creating fixtures:', err);
    return new Response(JSON.stringify({ error: 'Failed to create fixtures' }), { status: 500 });
  }
}

export async function DELETE(req: Request) {
  await connect();
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) return new Response(JSON.stringify({ error: 'ID is required' }), { status: 400 });

    await Fixture.findByIdAndDelete(id);
    return new Response(JSON.stringify({ message: 'Fixture deleted' }), { status: 200 });
  } catch (err) {
    console.error('Error deleting fixture:', err);
    return new Response(JSON.stringify({ error: 'Failed to delete fixture' }), { status: 500 });
  }
}
