import classNames from "classnames";
import React from "react";
import PaginationDot from "./PaginationDot";

type Props = {
  dots: number;
  index: number;
  onChangeIndex: any;
  handleOnPaginationClick: any;
  gray?: boolean;
};

Pagination.defaultProps = {
  gray: false,
};

function Pagination(props: Props) {
  const handleOnPaginationClick = (event: any, index: number) => {
    props.handleOnPaginationClick(event, index);
  };

  const children = [];

  for (let i = 0; i < props.dots; i += 1) {
    children.push(
      <PaginationDot
        key={i}
        index={i}
        active={i === props.index}
        handleOnClick={handleOnPaginationClick}
      />
    );
  }

  return (
    <div className="flex justify-center">
      <div
        className={classNames(
          "inline-flex items-center px-2 py-1 bg-opacity-75 rounded-full",
          { "bg-white": !(props.gray === true) },
          { "bg-gray-200": props.gray === true }
        )}
      >
        {children}
      </div>
    </div>
  );
}

export default Pagination;
