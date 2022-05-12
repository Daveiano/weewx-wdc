import { useCallback } from "react";

/**
 * @param {Intl.Collator} collator The ECMA402 collator.
 * @returns {(a: any, b: any) => boolean} The comparator.
 */
const useCollator = (
  collator: Intl.Collator
): ((a: number | string, b: number | string) => number) =>
  useCallback(
    (lhs, rhs) => {
      if (typeof lhs === "number" && typeof rhs === "number") {
        return lhs - rhs;
      }
      return collator.compare(lhs.toString(), rhs.toString());
    },
    [collator]
  );

export default useCollator;
