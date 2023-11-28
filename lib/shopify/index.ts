import {
  CAROUSEL,
  SHOPIFY_GRAPHQL_API_ENDPOINT,
  THREE_ITEM_GRID,
  WCTOKEN,
  WCTrustedToken
} from 'lib/constants';
import { isShopifyError } from 'lib/type-guards';
import {
  createCartMutation,
  editCartItemsMutation,
  removeFromCartMutation
} from './mutations/cart';
import {} from './queries/collection';
import { getPagesQuery } from './queries/page';
import {} from './queries/product';
import {
  Cart,
  CartItem,
  Collection,
  Connection,
  Menu,
  Page,
  Product,
  ShopifyCart,
  ShopifyCollection,
  ShopifyCreateCartOperation,
  ShopifyPagesOperation,
  ShopifyRemoveFromCartOperation,
  ShopifyUpdateCartOperation
} from './types';

//import { cookies } from 'next/headers';

import { ApiRoutes } from 'lib/url-mapper';

const domain = `https://${process.env.SHOPIFY_STORE_DOMAIN!}`;
const endpoint = `${domain}${SHOPIFY_GRAPHQL_API_ENDPOINT}`;
const key = process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN!;

type ExtractVariables<T> = T extends { variables: object } ? T['variables'] : never;

export async function shopifyFetch<T>({
  cache = 'force-cache',
  headers,
  query,
  tags,
  variables
}: {
  cache?: RequestCache;
  headers?: HeadersInit;
  query: string;
  tags?: string[];
  variables?: ExtractVariables<T>;
}): Promise<{ status: number; body: T } | never> {
  try {
    const result = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Storefront-Access-Token': key,
        ...headers
      },
      body: JSON.stringify({
        ...(query && { query }),
        ...(variables && { variables })
      }),
      cache,
      ...(tags && { next: { tags } })
    });

    const body = await result.json();

    if (body.errors) {
      throw body.errors[0];
    }

    return {
      status: result.status,
      body
    };
  } catch (e) {
    if (isShopifyError(e)) {
      throw {
        status: e.status || 500,
        message: e.message,
        query
      };
    }

    throw {
      error: e,
      query
    };
  }
}

const removeEdgesAndNodes = (array: Connection<any>) => {
  return array.edges.map((edge) => edge?.node);
};

// eslint-disable-next-line no-unused-vars
const guestIdentity = async () => {
  const auth = await fetch(ApiRoutes.GuestIdentity, {
    headers: {
      accept: 'application/json, text/plain, */*',
      'content-type': 'application/json',
      'sec-ch-ua': '"Google Chrome";v="119", "Chromium";v="119", "Not?A_Brand";v="24"',
      'sec-ch-ua-mobile': '?0',
      'sec-ch-ua-platform': '"Windows"'
    },
    referrerPolicy: 'strict-origin-when-cross-origin',
    body: '{}',
    method: 'POST',
    mode: 'cors',
    credentials: 'omit'
  })
    .then((response) => response.json())
    .then((json) => {
      return json;
    });
  return auth;
};

const doApi = async (url: string) => {
  console.log(url);
  const response = await fetch(url)
    .then((response) => response.json())
    .then((json) => {
      return json;
    });

  return response;
};

const doApiHeader = async (url: string) => {
  // SAVE AUTH IN SOME VARIABLES
  const response = await fetch(url, {
    headers: {
      wctoken: WCTOKEN,
      wctrustedtoken: WCTrustedToken
    }
  })
    .then((response) => response.json())
    .then((json) => {
      return json;
    });

  return response;
};

const reshapeCart = (cart: ShopifyCart): Cart => {
  if (!cart.cost?.totalTaxAmount) {
    cart.cost.totalTaxAmount = {
      amount: '0.0',
      currencyCode: 'USD'
    };
  }

  return {
    ...cart,
    lines: removeEdgesAndNodes(cart.lines)
  };
};

const reshapeCollection = (collection: ShopifyCollection): Collection | undefined => {
  if (!collection) {
    return undefined;
  }

  return {
    ...collection,
    path: `/search/${collection.handle}`
  };
};

export async function createCart(): Promise<Cart> {
  const res = await shopifyFetch<ShopifyCreateCartOperation>({
    query: createCartMutation,
    cache: 'no-store'
  });

  return reshapeCart(res.body.data.cartCreate.cart);
}

export async function addToCart(
  cartId: string,
  lines: { merchandiseId: string; quantity: number }[]
): Promise<Cart> {
  /*
  const res = await shopifyFetch<ShopifyAddToCartOperation>({
    query: addToCartMutation,
    variables: {
      cartId,
      lines
    },
    cache: 'no-store'
  });
  return reshapeCart(res.body.data.cartLinesAdd.cart);
  */
  console.log(lines);
  const cart: ShopifyCart = {
    id: cartId,
    checkoutUrl: 'checkout',
    cost: {
      subtotalAmount: { amount: '1', currencyCode: 'USD' },
      totalAmount: { amount: '1', currencyCode: 'USD' },
      totalTaxAmount: { amount: '1', currencyCode: 'USD' }
    },
    lines: {
      edges: [
        {
          node: {
            id: '1',
            quantity: 1,
            cost: {
              totalAmount: { amount: '1', currencyCode: 'USD' }
            },
            merchandise: {
              id: '1',
              title: 'Merch 1',
              selectedOptions: [
                {
                  name: 'Opt 1',
                  value: 'Value option 1'
                }
              ],
              product: {
                id: '1',
                handle: '1',
                availableForSale: true,
                title: 'First Product',
                description: 'First Product Description',
                descriptionHtml: 'First Product Description <b>In Bold </b>',
                options: [],
                priceRange: {
                  maxVariantPrice: { amount: '1', currencyCode: 'USD' },
                  minVariantPrice: { amount: '1', currencyCode: 'USD' }
                },
                featuredImage: {
                  url: 'https://cdn.shopify.com/s/files/1/0754/3727/7491/files/t-shirt-1.png',
                  altText: 'immagine alter text',
                  width: 50,
                  height: 50
                },
                seo: {
                  title: 'Seo Product',
                  description: 'Seo Product Description'
                },
                tags: [],
                updatedAt: new Date().toISOString(),
                variants: [
                  {
                    id: '1',
                    title: 'Variants 1',
                    availableForSale: true,
                    selectedOptions: [
                      {
                        name: 'Opt 1',
                        value: 'Value option 1'
                      }
                    ],
                    price: { amount: '1', currencyCode: 'USD' }
                  }
                ],
                images: [
                  {
                    url: 'https://cdn.shopify.com/s/files/1/0754/3727/7491/files/t-shirt-1.png',
                    altText: 'immagine alter text',
                    width: 50,
                    height: 50
                  },
                  {
                    url: 'https://cdn.shopify.com/s/files/1/0754/3727/7491/files/t-shirt-2.png',
                    altText: 'immagine alter text',
                    width: 50,
                    height: 50
                  }
                ]
              }
            }
          }
        }
      ]
    },
    totalQuantity: 1
  };
  return reshapeCart(cart);
}

export async function removeFromCart(cartId: string, lineIds: string[]): Promise<Cart> {
  const res = await shopifyFetch<ShopifyRemoveFromCartOperation>({
    query: removeFromCartMutation,
    variables: {
      cartId,
      lineIds
    },
    cache: 'no-store'
  });

  return reshapeCart(res.body.data.cartLinesRemove.cart);
}

export async function updateCart(
  cartId: string,
  lines: { id: string; merchandiseId: string; quantity: number }[]
): Promise<Cart> {
  const res = await shopifyFetch<ShopifyUpdateCartOperation>({
    query: editCartItemsMutation,
    variables: {
      cartId,
      lines
    },
    cache: 'no-store'
  });

  return reshapeCart(res.body.data.cartLinesUpdate.cart);
}

export async function getProductCart(element: any) {
  const productData = await doApi(ApiRoutes.ProductId.replace('##productId##', element.productId));

  const item = productData?.contents[0];

  const priceDisplay = item.price.find((el: any) => el.usage === 'Display');
  const priceOffer = item.price.find((el: any) => el.usage === 'Offer');

  return {
    id: element.productId,
    quantity: element.quantity,
    cost: {
      totalAmount: { amount: element.orderItemPrice, currencyCode: element.currency }
    },
    merchandise: {
      id: '1',
      title: '',
      selectedOptions: [],
      product: {
        id: element.productId,
        handle: element.productId,
        availableForSale: true,
        title: item.name,
        description: item.shortDescription,
        descriptionHtml: item.shortDescription,
        options: [],
        priceRange: {
          maxVariantPrice: { amount: priceDisplay.value, currencyCode: priceDisplay.currency },
          minVariantPrice: { amount: priceOffer.value, currencyCode: priceOffer.currency }
        },
        featuredImage: {
          url: ApiRoutes.ForImage + item.thumbnail,
          altText: 'immagine alter text',
          width: 50,
          height: 50
        },
        images: [
          {
            url: ApiRoutes.ForImage + item.thumbnail,
            altText: 'Image alter text',
            width: 50,
            height: 50
          }
        ],
        seo: {
          title: item.name,
          description: item.shortDescription
        },
        tags: [],
        updatedAt: new Date().toISOString(),
        variants: []
      }
    }
  };
}

export async function getCart(cartId: string): Promise<Cart | undefined> {
  console.log('cartId: ' + cartId);
  const cart = await doApiHeader(ApiRoutes.Cart);

  const product: CartItem[] = [];
  //console.log(cart?.orderItem);

  for (let i = 0; i < cart.orderItem.length; i++) {
    const productData = await getProductCart(cart.orderItem[i]);

    product.push(productData);
  }

  const cartResp: Cart = {
    lines: product,
    id: '1',
    checkoutUrl: 'cart',
    cost: {
      subtotalAmount: { amount: cart?.grandTotal, currencyCode: cart?.grandTotalCurrency },
      totalAmount: { amount: cart?.grandTotal, currencyCode: cart?.grandTotalCurrency },
      totalTaxAmount: { amount: cart?.totalSalesTax, currencyCode: cart?.totalSalesTaxCurrency }
    },
    totalQuantity: 1
  };

  return cartResp;

  //return reshapeCart(cartResp);

  /*
  console.log(cartId);
  const cart: ShopifyCart = {
    id: '1',
    checkoutUrl: 'cart',
    cost: {
      subtotalAmount: { amount: '1', currencyCode: 'USD' },
      totalAmount: { amount: '1', currencyCode: 'USD' },
      totalTaxAmount: { amount: '1', currencyCode: 'USD' }
    },
    //lines: {edges: []},
    lines: {
      edges: [
        {
          node: {
            id: '1',
            quantity: 1,
            cost: {
              totalAmount: { amount: '1', currencyCode: 'USD' }
            },
            merchandise: {
              id: '1',
              title: 'Merch 1',
              selectedOptions: [
                {
                  name: 'Opt 1',
                  value: 'Value option 1'
                }
              ],
              product: {
                id: '1',
                handle: '1',
                availableForSale: true,
                title: 'First Product',
                description: 'First Product Description',
                descriptionHtml: 'First Product Description <b>In Bold </b>',
                options: [],
                priceRange: {
                  maxVariantPrice: { amount: '1', currencyCode: 'USD' },
                  minVariantPrice: { amount: '1', currencyCode: 'USD' }
                },
                featuredImage: {
                  url: 'https://cdn.shopify.com/s/files/1/0754/3727/7491/files/t-shirt-1.png',
                  altText: 'immagine alter text',
                  width: 50,
                  height: 50
                },
                seo: {
                  title: 'Seo Product',
                  description: 'Seo Product Description'
                },
                tags: [],
                updatedAt: new Date().toISOString(),
                variants: [
                  {
                    id: '1',
                    title: 'Variants 1',
                    availableForSale: true,
                    selectedOptions: [
                      {
                        name: 'Opt 1',
                        value: 'Value option 1'
                      }
                    ],
                    price: { amount: '1', currencyCode: 'USD' }
                  }
                ],
                images: [
                  {
                    url: 'https://cdn.shopify.com/s/files/1/0754/3727/7491/files/t-shirt-1.png',
                    altText: 'immagine alter text',
                    width: 50,
                    height: 50
                  },
                  {
                    url: 'https://cdn.shopify.com/s/files/1/0754/3727/7491/files/t-shirt-2.png',
                    altText: 'immagine alter text',
                    width: 50,
                    height: 50
                  }
                ]
              }
            }
          }
        }
      ]
    },
    totalQuantity: 1
  };

  return reshapeCart(cart);
  /*
  const res = await shopifyFetch<ShopifyCartOperation>({
    query: getCartQuery,
    variables: { cartId },
    cache: 'no-store'
  });

  // Old carts becomes `null` when you checkout.
  if (!res.body.data.cart) {
    return undefined;
  }

  return reshapeCart(res.body.data.cart);
  */
}

export async function getCollection(handle: string): Promise<Collection | undefined> {
  /*
  const res = await shopifyFetch<ShopifyCollectionOperation>({
    query: getCollectionQuery,
    tags: [TAGS.collections],
    variables: {
      handle
    }
  });

  return reshapeCollection(res.body.data.collection);
  */
  const res: ShopifyCollection = {
    handle: handle,
    title: 'All',
    description: 'All product',
    seo: {
      title: 'Seo Collection',
      description: 'Seo Collection Description'
    },
    updatedAt: new Date().toISOString()
  };
  return reshapeCollection(res);
}

const mapSort = (sortKey: string, reverse: boolean) => {
  const orderBy = '&orderBy=';
  switch (sortKey) {
    case 'BRANDS':
      return orderBy + 1;
    case 'NAME':
      return orderBy + 2;
    case 'PRICE':
      return reverse ? orderBy + 4 : orderBy + 3;
    default:
      return '';
  }
};

export async function getCarouselProduct(): Promise<Product[]> {
  let partNumber = '';
  CAROUSEL.map((el: string) => {
    partNumber += '&partNumber=' + el;
  });
  const productsData = await doApi(ApiRoutes.ProductCarousel + partNumber);
  const products: Product[] = [];

  if (productsData.contents) {
    productsData.contents.map((item: any) => {
      const priceDisplay = item.price.find((el: any) => el.usage === 'Display');
      const priceOffer = item.price.find((el: any) => el.usage === 'Offer');

      products.push({
        id: item.id,
        handle: item.partNumber,
        availableForSale: item.buyable,
        title: item.name,
        description: item.shortDescription,
        descriptionHtml: item.shortDescription,
        options: [],
        priceRange: {
          maxVariantPrice: { amount: priceDisplay.value, currencyCode: priceDisplay.currency },
          minVariantPrice: { amount: priceOffer.value, currencyCode: priceOffer.currency }
        },
        variants: [],
        featuredImage: {
          url: ApiRoutes.ForImage + item.thumbnail,
          altText: 'immagine alter text',
          width: 50,
          height: 50
        },
        images: [
          {
            url: ApiRoutes.ForImage + item.thumbnail,
            altText: 'Image alter text',
            width: 50,
            height: 50
          }
        ],
        seo: {
          title: item.name,
          description: item.shortDescription
        },
        tags: [],
        updatedAt: new Date().toISOString()
      });
    });
  }

  return products;
}

export async function getThreeItemProducts(): Promise<Product[]> {
  const productsData = await doApi(
    ApiRoutes.ProductThree.replace('##partNumber1##', THREE_ITEM_GRID[0] || '')
      .replace('##partNumber2##', THREE_ITEM_GRID[1] || '')
      .replace('##partNumber3##', THREE_ITEM_GRID[2] || '')
  );
  const products: Product[] = [];

  if (productsData.contents) {
    productsData.contents.map((item: any) => {
      const priceDisplay = item.price.find((el: any) => el.usage === 'Display');
      const priceOffer = item.price.find((el: any) => el.usage === 'Offer');

      products.push({
        id: item.id,
        handle: item.partNumber,
        availableForSale: item.buyable,
        title: item.name,
        description: item.shortDescription,
        descriptionHtml: item.shortDescription,
        options: [],
        priceRange: {
          maxVariantPrice: { amount: priceDisplay.value, currencyCode: priceDisplay.currency },
          minVariantPrice: { amount: priceOffer.value, currencyCode: priceOffer.currency }
        },
        variants: [],
        featuredImage: {
          url: ApiRoutes.ForImage + item.thumbnail,
          altText: 'immagine alter text',
          width: 50,
          height: 50
        },
        images: [
          {
            url: ApiRoutes.ForImage + item.thumbnail,
            altText: 'Image alter text',
            width: 50,
            height: 50
          }
        ],
        seo: {
          title: item.name,
          description: item.shortDescription
        },
        tags: [],
        updatedAt: new Date().toISOString()
      });
    });
  }

  return products;
}

export async function getCollectionProducts({
  collection,
  reverse,
  sortKey
}: {
  collection: string;
  reverse?: boolean;
  sortKey?: string;
}): Promise<Product[]> {
  const orderBy = mapSort(sortKey || '', reverse || false);

  const productsData = await doApi(
    ApiRoutes.Products.replace('##categoryId##', collection) + orderBy
  );
  const products: Product[] = [];

  if (productsData.contents) {
    productsData.contents.map((item: any) => {
      const priceDisplay = item.price.find((el: any) => el.usage === 'Display');
      const priceOffer = item.price.find((el: any) => el.usage === 'Offer');

      products.push({
        id: item.id,
        handle: item.partNumber,
        availableForSale: item.buyable,
        title: item.name,
        description: item.shortDescription,
        descriptionHtml: item.shortDescription,
        options: [],
        priceRange: {
          maxVariantPrice: { amount: priceDisplay.value, currencyCode: priceDisplay.currency },
          minVariantPrice: { amount: priceOffer.value, currencyCode: priceOffer.currency }
        },
        variants: [],
        featuredImage: {
          url: ApiRoutes.ForImage + item.thumbnail,
          altText: 'immagine alter text',
          width: 50,
          height: 50
        },
        images: [
          {
            url: ApiRoutes.ForImage + item.thumbnail,
            altText: 'Image alter text',
            width: 50,
            height: 50
          }
        ],
        seo: {
          title: item.name,
          description: item.shortDescription
        },
        tags: [],
        updatedAt: new Date().toISOString()
      });
    });
  }

  return products;
}

export async function getCollections(): Promise<Collection[]> {
  const menuData = await doApi(ApiRoutes.Categories);

  const collection: Collection[] = [];
  if (menuData && menuData.contents && menuData.contents.length > 0) {
    menuData.contents.map((element: any) => {
      element.children
        .filter((el: any, i: number) => i === 0)
        .map((category: any) => {
          collection.push({
            handle: '',
            title: category.name,
            description: category.description,
            path: '/search/' + category.uniqueID,
            seo: {
              title: category.name,
              description: category.description
            },
            updatedAt: new Date().toISOString()
          });
        });
    });
  }

  return collection;
}

export async function getMenu(): Promise<Menu[]> {
  const menuData = await doApi(ApiRoutes.Categories);

  const menu: Menu[] = [];
  if (menuData && menuData.contents && menuData.contents.length > 0) {
    menuData.contents.map((element: any) => {
      element.children
        .filter((el: any, i: number) => i === 0)
        .map((category: any) => {
          menu.push({
            title: category.name,
            path: '/search/' + category.uniqueID
          });
        });
    });
  }

  return menu.splice(0, 3);
}

export async function getPage(handle: string): Promise<Page> {
  /*const res = await shopifyFetch<ShopifyPageOperation>({
    query: getPageQuery,
    variables: { handle }
  });

  return res.body.data.pageByHandle;
  */
  const page: Page = {
    id: '1',
    title: 'page',
    handle: handle,
    body: 'body',
    bodySummary: 'bodySummary',
    seo: {
      title: 'Seo Page 1',
      description: 'Seo Page 1 Description'
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  return page;
}

export async function getPages(): Promise<Page[]> {
  const res = await shopifyFetch<ShopifyPagesOperation>({
    query: getPagesQuery
  });

  return removeEdgesAndNodes(res.body.data.pages);
}

export async function getProduct(handle: string): Promise<Product | undefined> {
  const productData = await doApi(ApiRoutes.Product.replace('##partNumber##', handle));

  const item = productData?.contents[0];
  const attributesOption: string[] = [];
  const attributesVariant: any[] = [];

  const priceDisplay = item.price.find((el: any) => el.usage === 'Display');
  const priceOffer = item.price.find((el: any) => el.usage === 'Offer');
  const attributes = item.attributes.find((el: any) => el);
  attributes?.values.map((attr: any) => {
    attributesOption.push(attr.value);
  });
  attributes?.values.map((attr: any) => {
    attributesVariant.push({ name: attr.value, value: attr.value });
  });

  const product: Product = {
    id: item.id,
    handle: item.partNumber,
    availableForSale: item.buyable,
    title: item.name,
    description: item.shortDescription,
    descriptionHtml: item.shortDescription,
    priceRange: {
      maxVariantPrice: { amount: priceDisplay.value, currencyCode: priceDisplay.currency },
      minVariantPrice: { amount: priceOffer.value, currencyCode: priceOffer.currency }
    },
    options: attributes
      ? [
          {
            id: attributes?.identifier,
            name: attributes?.name,
            values: attributesOption
          }
        ]
      : [],
    variants: attributes
      ? [
          {
            id: attributes?.identifier,
            title: attributes?.identifier,
            availableForSale: true,
            selectedOptions: attributesVariant,
            price: { amount: priceDisplay.value, currencyCode: priceDisplay.currency }
          }
        ]
      : [],
    featuredImage: {
      url: ApiRoutes.ForImage + item.thumbnail,
      altText: 'immagine alter text',
      width: 50,
      height: 50
    },
    images: [
      {
        url: ApiRoutes.ForImage + item.thumbnail,
        altText: 'Image alter text',
        width: 50,
        height: 50
      }
    ],
    seo: {
      title: item.name,
      description: item.shortDescription
    },
    tags: [],
    updatedAt: new Date().toISOString()
  };

  return product;
}

export async function getProductRecommendations(productId: string): Promise<Product[]> {
  const productData = await doApi(ApiRoutes.Product.replace('##partNumber##', productId));

  const products: Product[] = [];
  const item = productData?.contents[0];

  item?.merchandisingAssociations?.map((element: any) => {
    const priceDisplay = element.price.find((el: any) => el.usage === 'Display');
    const priceOffer = element.price.find((el: any) => el.usage === 'Offer');

    products.push({
      id: element.id,
      handle: element.partNumber,
      availableForSale: element.buyable,
      title: element.name,
      description: element.shortDescription,
      descriptionHtml: element.shortDescription,
      priceRange: {
        maxVariantPrice: { amount: priceDisplay.value, currencyCode: priceDisplay.currency },
        minVariantPrice: { amount: priceOffer.value, currencyCode: priceOffer.currency }
      },
      options: [],
      variants: [],
      featuredImage: {
        url: ApiRoutes.ForImage + element.thumbnail,
        altText: 'immagine alter text',
        width: 50,
        height: 50
      },
      images: [
        {
          url: ApiRoutes.ForImage + element.thumbnail,
          altText: 'Image alter text',
          width: 50,
          height: 50
        }
      ],
      seo: {
        title: element.name,
        description: element.shortDescription
      },
      tags: [],
      updatedAt: new Date().toISOString()
    });
  });

  return products;
}

export async function getProducts({
  query,
  reverse,
  sortKey
}: {
  query?: string;
  reverse?: boolean;
  sortKey?: string;
}): Promise<Product[]> {
  const orderBy = mapSort(sortKey || '', reverse || false);

  const productsData = await doApi(
    ApiRoutes.ProductSearch.replace('##SEARCHTERM##', query || '') + orderBy
  );
  const products: Product[] = [];

  if (productsData.contents) {
    productsData.contents.map((item: any) => {
      const priceDisplay = item.price.find((el: any) => el.usage === 'Display');
      const priceOffer = item.price.find((el: any) => el.usage === 'Offer');

      products.push({
        id: item.id,
        handle: item.partNumber,
        availableForSale: item.buyable,
        title: item.name,
        description: item.shortDescription,
        descriptionHtml: item.shortDescription,
        options: [],
        priceRange: {
          maxVariantPrice: { amount: priceDisplay.value, currencyCode: priceDisplay.currency },
          minVariantPrice: { amount: priceOffer.value, currencyCode: priceOffer.currency }
        },
        variants: [],
        featuredImage: {
          url: ApiRoutes.ForImage + item.thumbnail,
          altText: 'immagine alter text',
          width: 50,
          height: 50
        },
        images: [
          {
            url: ApiRoutes.ForImage + item.thumbnail,
            altText: 'Image alter text',
            width: 50,
            height: 50
          }
        ],
        seo: {
          title: item.name,
          description: item.shortDescription
        },
        tags: [],
        updatedAt: new Date().toISOString()
      });
    });
  }

  return products;
}
