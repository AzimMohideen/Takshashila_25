import { NextResponse } from 'next/server';
import { MongoClient, ServerApiVersion } from 'mongodb';

const uri = process.env.NEXT_MONGODB_URI;
if (!uri) throw new Error('MONGODB_URI is not defined');

async function connect() {
  const client = new MongoClient(uri as string, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    }
  });
  await client.connect();
  return client;
}

export async function GET(request: Request) {
  const email = new URL(request.url).searchParams.get('email');
  if (!email) {
    return NextResponse.json([], { status: 200 });
  }
  const client = await connect();
  try {
    const db = client.db('TK25');
    const collection = db.collection('cart');
    const userData = await collection.findOne({ email });
    return NextResponse.json(userData ? userData.events : []);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch events' }, { status: 500 });
  } finally {
    await client.close();
  }
}

export async function POST(request: Request) {
  const { email, events } = await request.json();
  if (!email) {
    return NextResponse.json({ error: 'Email is required' }, { status: 400 });
  }
  const client = await connect();
  try {
    const db = client.db('TK25');
    const collection = db.collection('cart');
    await collection.updateOne(
      { email },
      { $set: { events } },
      { upsert: true }
    );
    return NextResponse.json({ message: 'Cart updated successfully' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update cart' }, { status: 500 });
  } finally {
    await client.close();
  }
}

export async function DELETE(request: Request) {
  const email = new URL(request.url).searchParams.get('email');
  if (!email) {
    return NextResponse.json({ error: 'Email is required' }, { status: 400 });
  }
  const client = await connect();
  try {
    const db = client.db('TK25');
    const collection = db.collection('cart');
    await collection.deleteOne({ email });
    return NextResponse.json({ message: 'Cart cleared successfully' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to clear cart' }, { status: 500 });
  } finally {
    await client.close();
  }
}