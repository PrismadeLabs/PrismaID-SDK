import classNames from "classnames";
import { ReactNode } from "react";

type Props = {
  children: ReactNode;
  className?: string;
};

function MessageTitle(props: Props) {
  return (
    <p
      className={classNames(
        "text-xl font-bold text-center whitespace-pre-wrap",
        props.className
      )}
    >
      {props.children}
    </p>
  );
}

export default MessageTitle;
