'use server';

import { addToCart, createCart, getCart, removeFromCart, updateCart } from 'lib/shopify';
import { cookies } from 'next/headers';

export const addItem = async (variantId: string | undefined): Promise<Error | undefined> => {
  //let cartId = cookies().get('cartId')?.value;
  let cartId = '1';
  let cart;

  if (cartId) {
    cart = await getCart(cartId);
  }

  if (!cartId || !cart) {
    cart = await createCart();
    cartId = cart.id;
    cookies().set('cartId', cartId);
  }

  if (!variantId) {
    return new Error('Missing variantId');
  }
  try {
    console.log(variantId);
    await addToCart(cartId, variantId);
  } catch (e) {
    return new Error('Error adding item', { cause: e });
  }
};

export const removeItem = async (orderItemId: string): Promise<Error | undefined> => {
  //const cartId = cookies().get('cartId')?.value;
  const cartId = '1';

  if (!cartId) {
    return new Error('Missing cartId');
  }
  try {
    await removeFromCart(cartId, orderItemId);
  } catch (e) {
    return new Error('Error removing item', { cause: e });
  }
};

export const updateItemQuantity = async (
  orderItemId: string,
  quantity: number
): Promise<Error | undefined> => {
  //const cartId = cookies().get('cartId')?.value;
  const cartId = '1';

  if (!cartId) {
    return new Error('Missing cartId');
  }
  try {
    await updateCart(cartId, orderItemId, quantity.toString());
  } catch (e) {
    return new Error('Error updating item quantity', { cause: e });
  }
};
