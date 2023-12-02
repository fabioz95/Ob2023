import { useRouter } from 'next/navigation';
import { useTransition } from 'react';

import { MinusIcon, PlusIcon } from '@heroicons/react/24/outline';
import clsx from 'clsx';
import { removeItem, updateItemQuantity } from 'components/cart/actions';
import LoadingDots from 'components/loading-dots';
import type { CartItem } from 'lib-hcl/hcl/types';

export default function EditItemQuantityButton({
  item,
  type,
  Wctoken,
  Wctrustedtoken,
  setReload
}: {
  item: CartItem;
  type: 'plus' | 'minus';
  Wctoken: string;
  Wctrustedtoken: string;
  // eslint-disable-next-line no-unused-vars
  setReload: (value: boolean) => void;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  //const MOCK = true;
  const MOCK = false;

  return (
    <button
      aria-label={type === 'plus' ? 'Increase item quantity' : 'Reduce item quantity'}
      onClick={() => {
        if (MOCK) {
          alert('updateFromCart mock');
        } else {
          startTransition(async () => {
            const quantity = type === 'plus' ? item.quantity * 1 + 1 : item.quantity * 1 - 1;
            const error =
              type === 'minus' && item.quantity - 1 === 0
                ? await removeItem(item.id, Wctoken, Wctrustedtoken)
                : await updateItemQuantity(item.id, quantity, Wctoken, Wctrustedtoken);

            if (error) {
              alert(error);
              return;
            } else {
              setReload(true);
            }

            router.refresh();
          });
        }
      }}
      disabled={isPending}
      className={clsx(
        'ease flex h-full min-w-[36px] max-w-[36px] flex-none items-center justify-center rounded-full px-2 transition-all duration-200 hover:border-neutral-800 hover:opacity-80',
        {
          'cursor-not-allowed': isPending,
          'ml-auto': type === 'minus'
        }
      )}
    >
      {isPending ? (
        <LoadingDots className="bg-black dark:bg-white" />
      ) : type === 'plus' ? (
        <PlusIcon className="h-4 w-4 dark:text-neutral-500" />
      ) : (
        <MinusIcon className="h-4 w-4 dark:text-neutral-500" />
      )}
    </button>
  );
}
