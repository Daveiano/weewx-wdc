import { Dispatch, SetStateAction, useMemo, useState } from "react";
import { useDebounce } from "use-debounce";
import doesRowMatchSearchString from "../misc/doesRowMatchSearchString";
import { dataItemDataTable } from "../table-base";

/**
 * @param {object[]} rows The table rows.
 * @returns {Array} The memorized version of filtered rows, search string and the setter for the search string.
 */
const useFilteredRows = (
  rows: dataItemDataTable[]
): [dataItemDataTable[], string, Dispatch<SetStateAction<string>>] => {
  const [searchString, setSearchString] = useState("");
  const [debouncedSearchString] = useDebounce(searchString, 500);
  const filteredRows = useMemo(
    () =>
      !debouncedSearchString
        ? rows
        : rows.filter((row) =>
            doesRowMatchSearchString(row, debouncedSearchString)
          ),
    [debouncedSearchString, rows]
  );
  return [filteredRows, searchString, setSearchString];
};

export default useFilteredRows;
