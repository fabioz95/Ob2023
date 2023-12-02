'use server';

import { addToCart, removeFromCart, updateCart } from 'lib-hcl/hcl';

export const addItem = async (
  variantId: string | undefined,
  Wctoken: string,
  Wctrustedtoken: string
): Promise<Error | undefined> => {
  //let cartId = cookies().get('cartId')?.value;
  /*
  let cartId = '1';
  let cart;


  if (cartId) {
    //cart = await getCart(cartId);
  }


  if (!cartId || !cart) {
    cart = await createCart();
    cartId = cart.id;
    cookies().set('cartId', cartId);
  }
    */

  if (!variantId) {
    return new Error('Missing variantId');
  }
  try {
    console.log(variantId);
    await addToCart('1', variantId, Wctoken, Wctrustedtoken);
  } catch (e) {
    return new Error('Error adding item', { cause: e });
  }
};

export const removeItem = async (
  orderItemId: string,
  Wctoken: string,
  Wctrustedtoken: string
): Promise<Error | undefined> => {
  //const cartId = cookies().get('cartId')?.value;
  const cartId = '1';

  if (!cartId) {
    return new Error('Missing cartId');
  }
  try {
    await removeFromCart(cartId, orderItemId, Wctoken, Wctrustedtoken);
  } catch (e) {
    return new Error('Error removing item', { cause: e });
  }
};

export const updateItemQuantity = async (
  orderItemId: string,
  quantity: number,
  Wctoken: string,
  Wctrustedtoken: string
): Promise<Error | undefined> => {
  //const cartId = cookies().get('cartId')?.value;
  const cartId = '1';

  if (!cartId) {
    return new Error('Missing cartId');
  }
  try {
    await updateCart(cartId, orderItemId, quantity.toString(), Wctoken, Wctrustedtoken);
  } catch (e) {
    return new Error('Error updating item quantity', { cause: e });
  }
};
