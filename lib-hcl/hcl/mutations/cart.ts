import cartFragment from '../fragments/cart';

export const addToCartMutation = /* GraphQL */ `
  mutation addToCart($productId: String!) {
    cartAddOrderItem(
      storeId: "11"
      requestBody: { orderId: ".", orderItem: { productId: $productId, quantity: "1" } }
    ) {
      orderItem {
        orderItemId
      }
    }
  }
`;

export const deleteCartMutation = /* GraphQL */ `
  mutation deleteProdCart($orderItemId: String!) {
    cartUpdateOrderItem(
      storeId: "11"
      requestBody: { orderId: ".", orderItem: { quantity: "0", orderItemId: $orderItemId } }
    ) {
      orderId
    }
  }
`;

export const updateCartMutation = /* GraphQL */ `
  mutation updateProdCart($quantity: String!, $orderItemId: String!) {
    cartUpdateOrderItem(
      storeId: "11"
      requestBody: { orderId: ".", orderItem: { quantity: $quantity, orderItemId: $orderItemId } }
    ) {
      orderId
    }
  }
`;

/*
export const addToCartMutation =
  mutation addToCart($cartId: ID!, $lines: [CartLineInput!]!) {
    cartLinesAdd(cartId: $cartId, lines: $lines) {
      cart {
        ...cart
      }
    }
  }
  ${cartFragment}
`;
*/

export const createCartMutation = /* GraphQL */ `
  mutation createCart($lineItems: [CartLineInput!]) {
    cartCreate(input: { lines: $lineItems }) {
      cart {
        ...cart
      }
    }
  }
  ${cartFragment}
`;

export const editCartItemsMutation = /* GraphQL */ `
  mutation editCartItems($cartId: ID!, $lines: [CartLineUpdateInput!]!) {
    cartLinesUpdate(cartId: $cartId, lines: $lines) {
      cart {
        ...cart
      }
    }
  }
  ${cartFragment}
`;

export const removeFromCartMutation = /* GraphQL */ `
  mutation removeFromCart($cartId: ID!, $lineIds: [ID!]!) {
    cartLinesRemove(cartId: $cartId, lineIds: $lineIds) {
      cart {
        ...cart
      }
    }
  }
  ${cartFragment}
`;
