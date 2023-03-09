import { useLayoutEffect } from "react";

export function useBodyScrollLock() {
  useLayoutEffect(() => {
    // Get original body overflow
    const originalStyle = window.getComputedStyle(document.body).overflow;
    // Prevent scrolling on mount
    document.body.style.overflow = "hidden";

    // Re-enable scrolling when component unmounts
    return () => {
      document.body.style.overflow = "visible";
    };
  }, []); // Empty array ensures effect is only run on mount and unmount
}
