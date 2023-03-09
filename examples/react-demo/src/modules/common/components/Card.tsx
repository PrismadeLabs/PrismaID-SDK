import classNames from "classnames";
import { ReactNode } from "react";

type Props = {
  children: ReactNode;
  className?: string;
  small?: boolean;
};

Card.defaultProps = {
  small: false,
};

function Card(props: Props) {
  return (
    <div
      className={classNames(
        "overflow-hidden text-center bg-white rounded-lg shadow-lg whitespace-pre-wrap",
        { "px-4 py-5 sm:p-6": !props.small },
        { "px-3 py-3 sm:p-6": props.small },
        props.className
      )}
    >
      {props.children}
    </div>
  );
}

export default Card;
