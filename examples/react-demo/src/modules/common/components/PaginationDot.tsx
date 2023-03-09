import classNames from "classnames";

type Props = {
  active: boolean;
  index: number;
  handleOnClick: any;
};

function PaginationDot(props: Props) {
  const handleOnClick = (event: any) => {
    props.handleOnClick(event, props.index);
  };

  return (
    <button type="button" onClick={handleOnClick}>
      <div
        className={classNames(
          "h-2 w-2 m-1 rounded-full",
          {
            "bg-gray-400": !props.active,
          },
          {
            "bg-prismade-blue": props.active,
          }
        )}
      />
    </button>
  );
}

export default PaginationDot;
