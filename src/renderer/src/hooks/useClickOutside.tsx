import { MutableRefObject, useEffect, useRef } from "react";

/* The reason this works, is because of how react itself works, let me elaborate on the flow of events.
 * 1. When the hook is called in a component, the Ref is returned.
 * 2. The useEffect, is attached to the dom
 * 3. Now before the component mounts, the ref is attached to the html element
 * 4. On component mount, the useEffect takes place
 * 5. On component dismount the useEffect returns the eventListener cleanup.
 *
 * THIS IS BEAUTIFUL, SO MUCH FUN.
 * */


/* Pass a callbackFn that needs to be triggered when a click is initiated outside the html element to which the ref is attatched.
 * This returns a Ref that needs to be attatched to an html element, in which the above statement applies.
 * */
export const useClickOutside = <T extends HTMLElement>(callbackFn: () => void): MutableRefObject<T | null> => {
  const ref = useRef<T | null>(null)

  useEffect(() => {
    function handleOutsideClick(event: MouseEvent): void {
      if (ref.current && !ref.current.contains(event.target as Node)) callbackFn()
    }

    document.addEventListener("mousedown", handleOutsideClick)

    // In useEffect to pass a cleanup function, we need to pass a function and not call a method
    return () => document.removeEventListener("mousedown", handleOutsideClick)
  }, [])

  return ref
}
