// -------------------------
// useMediaQuery

import { useState, useEffect, useLayoutEffect } from "react";

export function useMediaQuery(query: string) {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(query);

    if (media.matches !== matches) {
      setMatches(media.matches);
    }

    const listener = () => setMatches(media.matches);
    media.addEventListener("change", listener);
    return () => window.removeEventListener("change", listener);
  }, [matches, query]);

  return matches;
}

// -------------------------
// useBreakpoints

export function useBreakpoints() {
  const [isClient, setIsClient] = useState(false);

  const breakpoints = {
    isXs: useMediaQuery("(max-width: 640px)"),
    isSm: useMediaQuery("(min-width: 641px) and (max-width: 768px)"),
    isMd: useMediaQuery("(min-width: 769px) and (max-width: 1024px)"),
    isLg: useMediaQuery("(min-width: 1025px)"),
    active: "SSR",
  };

  useLayoutEffect(() => {
    if (typeof window !== "undefined") setIsClient(true);
  }, []);

  if (isClient && breakpoints.isXs) breakpoints.active = "xs";
  if (isClient && breakpoints.isSm) breakpoints.active = "sm";
  if (isClient && breakpoints.isMd) breakpoints.active = "md";
  if (isClient && breakpoints.isLg) breakpoints.active = "lg";

  return breakpoints;
}

// // -------------------------
// // useBreakpoints usage

// const Test = () => {
//   const { isXs, isSm, isMd, isLg, active } = useBreakpoints();
//   return (
//     <div style={{ backgroundColor: "red" }}>
//       <span>active: {active}</span>
//       <div>{isXs && <div>xs</div>}</div>
//       <div>{isSm && <div>sm</div>}</div>
//       <div>{isMd && <div>md</div>}</div>
//       <div>{isLg && <div>lg</div>}</div>
//     </div>
//   );
// };

// // -------------------------
// // useMediaQuery usage

// const Test = () => {
//   let isPageWide = useMediaQuery("(min-width: 800px)");
//   return (
//     <div style={{ backgroundColor: "red" }}>
//       {isPageWide ? "page wide" : "not wide"}
//     </div>
//   );
// };