import React, { useCallback } from "react";
import { Pagination as CarbonPagination } from "carbon-components-react";

type PaginationProps = {
  count: number;
  start: number;
  pageSize: number;
  onChangePageSize: (a: { pageSize: number }) => void;
  onChangeStart: (a: { start: number }) => void;
  pageSizes: number[];
};

/**
 * Wrapped version of Carbon `<Pagination>`, that uses zero-based starting row
 * index instead of page number.
 */
const Pagination = (props: PaginationProps): React.ReactElement => {
  const handleChangePage = useCallback(
    ({ page: newPage, pageSize: newPageSize }) => {
      if (props.onChangePageSize && props.pageSize !== newPageSize) {
        props.onChangePageSize({ pageSize: newPageSize });
      }
      const page = Math.floor(props.start / props.pageSize) + 1;
      if (page !== newPage) {
        const newStart = Math.min(
          Math.max(props.start + (newPage - page) * props.pageSize, 0),
          props.count
        );
        if (props.onChangeStart && props.start !== newStart) {
          props.onChangeStart({ start: newStart });
        }
      }
    },
    [
      props.start,
      props.count,
      props.pageSize,
      props.onChangeStart,
      props.onChangePageSize,
    ]
  );

  return (
    <CarbonPagination
      page={Math.floor(props.start / props.pageSize) + 1}
      pageSize={props.pageSize}
      pageSizes={props.pageSizes}
      totalItems={props.count}
      onChange={handleChangePage}
    />
  );
};

export default Pagination;
