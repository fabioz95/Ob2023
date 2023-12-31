import { XMarkIcon } from '@heroicons/react/24/outline';
import LoadingDots from 'components/loading-dots';
import { useRouter } from 'next/navigation';

import clsx from 'clsx';
import type { CartItem } from 'lib-hcl/hcl/types';
import { useTransition } from 'react';
import { removeItem } from './actions';

export default function DeleteItemButton({
  item,
  Wctoken,
  Wctrustedtoken,
  setReload
}: {
  item: CartItem;
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
      aria-label="Remove cart item"
      onClick={() => {
        if (MOCK) {
          alert('deleteFromCart Mock');
        } else {
          startTransition(async () => {
            const error = await removeItem(item.id, Wctoken, Wctrustedtoken);

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
        'ease flex h-[17px] w-[17px] items-center justify-center rounded-full bg-neutral-500 transition-all duration-200',
        {
          'cursor-not-allowed px-0': isPending
        }
      )}
    >
      {isPending ? (
        <LoadingDots className="bg-white" />
      ) : (
        <XMarkIcon className="hover:text-accent-3 mx-[1px] h-4 w-4 text-white dark:text-black" />
      )}
    </button>
  );
}
