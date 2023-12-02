'use client';

import { Dialog, Transition } from '@headlessui/react';
import { ShoppingCartIcon } from '@heroicons/react/24/outline';
import Price from 'components/price';
import { DEFAULT_OPTION } from 'lib-hcl/constants';
import { CartEmpty } from 'lib-hcl/hcl/mock-file';
import type { Cart, CartItem } from 'lib-hcl/hcl/types';
import { ApiRoutes } from 'lib-hcl/url-mapper';
import { createUrl } from 'lib-hcl/utils';
import Image from 'next/image';
import Link from 'next/link';
import { Fragment, useEffect, useRef, useState } from 'react';
import CloseCart from './close-cart';
import DeleteItemButton from './delete-item-button';
import EditItemQuantityButton from './edit-item-quantity-button';
import OpenCart from './open-cart';

type MerchandiseSearchParams = {
  [key: string]: string;
};

export default function CartModal({ cart }: { cart: Cart | undefined }) {
  const [isOpen, setIsOpen] = useState(false);
  const quantityRef = useRef(cart?.totalQuantity);
  const openCart = () => setIsOpen(true);
  const closeCart = () => setIsOpen(false);
  const [reload, setReload] = useState(true);
  const [cartCorrect, setCartCorrect] = useState<Cart>();
  const [wctoken, setWctoken] = useState('');
  const [wctrustedtoken, setWctrustedtoken] = useState('');

  const MOCK = false;

  useEffect(() => {
    setWctoken(window?.localStorage.getItem('WCToken') || '');
    setWctrustedtoken(window?.localStorage.getItem('WCTrustedToken') || '');
  }, []);

  useEffect(() => {
    console.log(cartCorrect);
  }, [cartCorrect]);

  useEffect(() => {
    if (reload) {
      if (MOCK) {
        setCartCorrect(CartEmpty);
      } else {
        // declare the async data fetching function
        const fetchData = async () => {
          // get the data from the api

          if (
            window?.localStorage.getItem('WCToken') === null ||
            window?.localStorage.getItem('WCTrustedToken') === null
          ) {
            await fetch(ApiRoutes.GuestIdentity, {
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
                if (json.WCToken) {
                  window.localStorage.setItem('WCToken', json.WCToken);
                  window.localStorage.setItem('WCTrustedToken', json.WCTrustedToken);
                }
              });
          }
          const cart = await fetch(ApiRoutes.CartProxy, {
            headers: {
              wctoken: window.localStorage.getItem('WCToken') || '',
              wctrustedtoken: window.localStorage.getItem('WCTrustedToken') || ''
            },
            cache: 'no-cache'
          })
            .then((response) => {
              if (response.status === 404) throw '404';
              else return response.json();
            })
            .then((json) => {
              return json;
            })
            .catch(() => console.log('error'));

          const product: CartItem[] = [];

          for (let i = 0; i < cart?.orderItem?.length; i++) {
            const productData = await fetch(
              ApiRoutes.ProductId.replace('##productId##', cart.orderItem[i].productId)
            )
              .then((response) => response.json())
              .then((json) => {
                return json;
              });

            const item = productData?.contents[0];

            const priceDisplay = item.price.find((el: any) => el.usage === 'Display');
            const priceOffer = item.price.find((el: any) => el.usage === 'Offer');

            product.push({
              id: cart?.orderItem[i].orderItemId,
              quantity: cart?.orderItem[i].quantity,
              cost: {
                totalAmount: {
                  amount: cart?.orderItem[i].orderItemPrice,
                  currencyCode: cart?.orderItem[i].currency
                }
              },
              merchandise: {
                id: '1',
                title: '',
                selectedOptions: [],
                product: {
                  id: cart?.orderItem[i].orderItemId,
                  handle: cart?.orderItem[i].productId,
                  availableForSale: true,
                  title: item.name,
                  description: item.shortDescription,
                  descriptionHtml: item.shortDescription,
                  options: [],
                  priceRange: {
                    maxVariantPrice: {
                      amount: priceDisplay.value,
                      currencyCode: priceDisplay.currency
                    },
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
            });
          }

          const cartResp: Cart = {
            lines: product,
            id: '1',
            checkoutUrl: 'cart',
            cost: {
              subtotalAmount: { amount: cart?.grandTotal, currencyCode: cart?.grandTotalCurrency },
              totalAmount: { amount: cart?.grandTotal, currencyCode: cart?.grandTotalCurrency },
              totalTaxAmount: {
                amount: cart?.totalSalesTax,
                currencyCode: cart?.totalSalesTaxCurrency
              }
            },
            totalQuantity: cart?.orderItem?.length
          };

          // set state with the result
          setCartCorrect(cartResp);
        };

        // call the function
        fetchData()
          // make sure to catch any error
          .catch(console.error);

        setReload(false);
      }
    }
  }, [reload, MOCK]);

  useEffect(() => {
    // Open cart modal when quantity changes.
    if (cart?.totalQuantity !== quantityRef.current) {
      // But only if it's not already open (quantity also changes when editing items in cart).
      if (!isOpen) {
        setIsOpen(true);
      }

      // Always update the quantity reference
      quantityRef.current = cart?.totalQuantity;
    }
  }, [isOpen, cart?.totalQuantity, quantityRef]);

  const reloadCart = () => {
    setReload(true);
    setIsOpen(true);
  };

  return (
    <>
      <div id="reload-cart-to-add" style={{ display: 'none' }} onClick={() => reloadCart()} />
      <button aria-label="Open cart" onClick={openCart}>
        <OpenCart quantity={cartCorrect?.totalQuantity} />
      </button>
      <Transition show={isOpen}>
        <Dialog onClose={closeCart} className="relative z-50">
          <Transition.Child
            as={Fragment}
            enter="transition-all ease-in-out duration-300"
            enterFrom="opacity-0 backdrop-blur-none"
            enterTo="opacity-100 backdrop-blur-[.5px]"
            leave="transition-all ease-in-out duration-200"
            leaveFrom="opacity-100 backdrop-blur-[.5px]"
            leaveTo="opacity-0 backdrop-blur-none"
          >
            <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
          </Transition.Child>
          <Transition.Child
            as={Fragment}
            enter="transition-all ease-in-out duration-300"
            enterFrom="translate-x-full"
            enterTo="translate-x-0"
            leave="transition-all ease-in-out duration-200"
            leaveFrom="translate-x-0"
            leaveTo="translate-x-full"
          >
            <Dialog.Panel className="fixed bottom-0 right-0 top-0 flex h-full w-full flex-col border-l border-neutral-200 bg-white/80 p-6 text-black backdrop-blur-xl dark:border-neutral-700 dark:bg-black/80 dark:text-white md:w-[390px]">
              <div className="flex items-center justify-between">
                <p className="text-lg font-semibold">My Cart</p>

                <button aria-label="Close cart" onClick={closeCart}>
                  <CloseCart />
                </button>
              </div>

              {!cartCorrect || cartCorrect.lines.length === 0 ? (
                <div className="mt-20 flex w-full flex-col items-center justify-center overflow-hidden">
                  <ShoppingCartIcon className="h-16" />
                  <p className="mt-6 text-center text-2xl font-bold">Your cart is empty.</p>
                </div>
              ) : (
                <div className="flex h-full flex-col justify-between overflow-hidden p-1">
                  <ul className="flex-grow overflow-auto py-4">
                    {cartCorrect.lines.map((item, i) => {
                      const merchandiseSearchParams = {} as MerchandiseSearchParams;

                      item?.merchandise?.selectedOptions?.forEach(({ name, value }) => {
                        if (value !== DEFAULT_OPTION) {
                          merchandiseSearchParams[name.toLowerCase()] = value;
                        }
                      });

                      const merchandiseUrl = createUrl(
                        `/product/${item?.merchandise?.product?.handle}`,
                        new URLSearchParams(merchandiseSearchParams)
                      );

                      return (
                        <li
                          key={i}
                          className="flex w-full flex-col border-b border-neutral-300 dark:border-neutral-700"
                        >
                          <div className="relative flex w-full flex-row justify-between px-1 py-4">
                            <div className="absolute z-40 -mt-2 ml-[55px]">
                              <DeleteItemButton
                                item={item}
                                Wctoken={wctoken}
                                Wctrustedtoken={wctrustedtoken}
                                setReload={(value: boolean) => setReload(value)}
                              />
                            </div>
                            <Link
                              href={merchandiseUrl}
                              onClick={closeCart}
                              className="z-30 flex flex-row space-x-4"
                            >
                              <div className="relative h-16 w-16 cursor-pointer overflow-hidden rounded-md border border-neutral-300 bg-neutral-300 dark:border-neutral-700 dark:bg-neutral-900 dark:hover:bg-neutral-800">
                                <Image
                                  className="h-full w-full object-cover "
                                  width={64}
                                  height={64}
                                  alt={
                                    item?.merchandise?.product?.featuredImage?.altText ||
                                    item?.merchandise?.product?.title
                                  }
                                  src={item?.merchandise?.product?.featuredImage?.url}
                                />
                              </div>

                              <div className="flex flex-1 flex-col text-base">
                                <span className="leading-tight">
                                  {item?.merchandise?.product?.title}
                                </span>
                                {item?.merchandise?.title !== DEFAULT_OPTION ? (
                                  <p className="text-sm text-neutral-500 dark:text-neutral-400">
                                    {item?.merchandise?.title}
                                  </p>
                                ) : null}
                              </div>
                            </Link>
                            <div className="flex h-16 flex-col justify-between">
                              <Price
                                className="flex justify-end space-y-2 text-right text-sm"
                                amount={item?.cost?.totalAmount?.amount}
                                currencyCode={item?.cost?.totalAmount?.currencyCode}
                              />
                              <div className="ml-auto flex h-9 flex-row items-center rounded-full border border-neutral-200 dark:border-neutral-700">
                                <EditItemQuantityButton
                                  item={item}
                                  type="minus"
                                  Wctoken={wctoken}
                                  Wctrustedtoken={wctrustedtoken}
                                  setReload={(value: boolean) => setReload(value)}
                                />
                                <p className="w-6 text-center ">
                                  <span className="w-full text-sm">{item?.quantity}</span>
                                </p>
                                <EditItemQuantityButton
                                  item={item}
                                  type="plus"
                                  Wctoken={wctoken}
                                  Wctrustedtoken={wctrustedtoken}
                                  setReload={(value: boolean) => setReload(value)}
                                />
                              </div>
                            </div>
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                  <div className="py-4 text-sm text-neutral-500 dark:text-neutral-400">
                    <div className="mb-3 flex items-center justify-between border-b border-neutral-200 pb-1 dark:border-neutral-700">
                      <p>Taxes</p>
                      <Price
                        className="text-right text-base text-black dark:text-white"
                        amount={cartCorrect?.cost?.totalTaxAmount?.amount}
                        currencyCode={cartCorrect?.cost?.totalTaxAmount?.currencyCode}
                      />
                    </div>
                    <div className="mb-3 flex items-center justify-between border-b border-neutral-200 pb-1 pt-1 dark:border-neutral-700">
                      <p>Shipping</p>
                      <p className="text-right">Calculated at checkout</p>
                    </div>
                    <div className="mb-3 flex items-center justify-between border-b border-neutral-200 pb-1 pt-1 dark:border-neutral-700">
                      <p>Total</p>
                      <Price
                        className="text-right text-base text-black dark:text-white"
                        amount={cartCorrect.cost.totalAmount.amount}
                        currencyCode={cartCorrect.cost.totalAmount.currencyCode}
                      />
                    </div>
                  </div>
                  <a
                    href={cartCorrect.checkoutUrl}
                    className="block w-full rounded-full bg-blue-600 p-3 text-center text-sm font-medium text-white opacity-90 hover:opacity-100"
                  >
                    Proceed to Checkout
                  </a>
                </div>
              )}
            </Dialog.Panel>
          </Transition.Child>
        </Dialog>
      </Transition>
    </>
  );
}
