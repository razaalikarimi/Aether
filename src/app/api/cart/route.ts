import { NextRequest, NextResponse } from 'next/server';
import {
  createCart,
  addToCart,
  updateCartLines,
  removeFromCart,
  getCart,
} from '@/lib/shopify';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const cartId = searchParams.get('cartId');

  if (!cartId) {
    const newCart = await createCart();
    return NextResponse.json(newCart);
  }

  const cart = await getCart(cartId);
  if (!cart) {
    const newCart = await createCart();
    return NextResponse.json(newCart);
  }

  return NextResponse.json(cart);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, cartId, variantId, quantity = 1 } = body;

    if (action === 'create') {
      const cart = await createCart(variantId, quantity);
      return NextResponse.json(cart);
    }

    if (action === 'add') {
      if (!cartId || !variantId) {
        return NextResponse.json(
          { error: 'cartId and variantId are required' },
          { status: 400 }
        );
      }
      const cart = await addToCart(cartId, variantId, quantity);
      return NextResponse.json(cart);
    }

    return NextResponse.json({ error: 'Unsupported POST action' }, { status: 400 });
  } catch (error) {
    console.error('[API /api/cart POST Error]:', error);
    return NextResponse.json({ error: 'Failed to process cart operation' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { cartId, lines } = body;

    if (!cartId || !Array.isArray(lines)) {
      return NextResponse.json(
        { error: 'cartId and lines array are required' },
        { status: 400 }
      );
    }

    const cart = await updateCartLines(cartId, lines);
    return NextResponse.json(cart);
  } catch (error) {
    console.error('[API /api/cart PUT Error]:', error);
    return NextResponse.json({ error: 'Failed to update cart' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json();
    const { cartId, lineIds } = body;

    if (!cartId || !Array.isArray(lineIds)) {
      return NextResponse.json(
        { error: 'cartId and lineIds array are required' },
        { status: 400 }
      );
    }

    const cart = await removeFromCart(cartId, lineIds);
    return NextResponse.json(cart);
  } catch (error) {
    console.error('[API /api/cart DELETE Error]:', error);
    return NextResponse.json({ error: 'Failed to delete cart lines' }, { status: 500 });
  }
}
