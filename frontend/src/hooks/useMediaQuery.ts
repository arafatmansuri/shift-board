import { useEffect, useRef, useState } from "react";

export const useMediaQuery = (query:string):boolean => {
  const [matches, setMatches] = useState(false);
  const ref = useRef(false);
  useEffect(() => {
    const media = window.matchMedia(query);
    if (media.matches !== matches) {
      ref.current = media.matches
      setMatches(ref.current)
    }
    const listener = () => setMatches(media.matches);
    media.addListener(listener);
    return () => media.removeListener(listener);
  }, [matches, query]);

  return matches;
};
