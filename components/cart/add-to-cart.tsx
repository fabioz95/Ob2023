'use client';

import { PlusIcon } from '@heroicons/react/24/outline';
import clsx from 'clsx';
import LoadingDots from 'components/loading-dots';
import { ProductVariant } from 'lib-hcl/hcl/types';
import { useRouter, useSearchParams } from 'next/navigation';
import { useTransition } from 'react';
import { addItem } from './actions';

export function AddToCart({
  variants,
  availableForSale,
  partnumber,
  id
}: {
  variants: ProductVariant[];
  availableForSale: boolean;
  partnumber: string;
  id: string;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const defaultVariantId = variants.length === 1 ? variants[0]?.id : undefined;
  const variant = variants.find((variant: ProductVariant) =>
    variant.selectedOptions.every(
      (option) => option.value === searchParams.get(option.name.toLowerCase())
    )
  );
  const selectedVariantId = variant?.id || defaultVariantId;
  const title = !availableForSale
    ? 'Out of stock'
    : !selectedVariantId
    ? 'Please select options'
    : undefined;

  //const MOCK = true;
  const MOCK = false;

  return (
    <button
      aria-label="Add item to cart"
      //disabled={isPending || !availableForSale || !selectedVariantId}
      title={title}
      onClick={() => {
        let idVariant = '';
        // Safeguard in case someone messes with `disabled` in devtools.
        //if (!availableForSale || !selectedVariantId) return;
        console.log(variants);
        console.log(partnumber);
        console.log(id);
        if (variants[0]) {
          idVariant =
            variants[0].selectedOptions.find(
              (el: any) => variants[0] && el.name === searchParams.get(variants[0].id.toLowerCase())
            )?.value || '';
        }

        if (MOCK) {
          alert('addToCart in Mock');
        } else {
          startTransition(async () => {
            const wct = window.localStorage.getItem('WCToken');
            const wctru = window.localStorage.getItem('WCTrustedToken');
            const error = await addItem(idVariant !== '' ? idVariant : id, wct || '', wctru || '');
            //selectedVariantId
            if (error) {
              alert(error);
              return;
            } else {
              document.getElementById('reload-cart-to-add')?.click();
            }

            router.refresh();
          });
        }
      }}
      className={clsx(
        'relative flex w-full items-center justify-center rounded-full bg-blue-600 p-4 tracking-wide text-white hover:opacity-90',
        {
          /*
          'cursor-not-allowed opacity-60 hover:opacity-60': !availableForSale || !selectedVariantId,
          'cursor-not-allowed': isPending
          */
        }
      )}
    >
      <div className="absolute left-0 ml-4">
        {!isPending ? <PlusIcon className="h-5" /> : <LoadingDots className="mb-3 bg-white" />}
      </div>
      <span>{availableForSale ? 'Add To Cart' : 'Out Of Stock'}</span>
    </button>
  );
}
