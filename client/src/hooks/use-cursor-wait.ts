import { useEffect } from 'react';

/**
 * Sets the cursor to "wait" when the provided `isPending` flag is true,
 * and removes the "cursor-wait" class when it is false.
 *
 * @param {boolean} isPending - Flag indicating whether the cursor should be in the "wait" state.
 * @return {void} This function does not return anything.
 */
export function useCursorWait(isPending: boolean) {
  useEffect(() => {
    const body = document.body;

    if (isPending) {
      body.classList.add('cursor-wait');
    } else {
      body.classList.remove('cursor-wait');
    }

    return () => {
      body.classList.remove('cursor-wait');
    };
  }, [isPending]);
}
