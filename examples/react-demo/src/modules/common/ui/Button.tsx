import classNames from "classnames";
import { ReactNode } from "react";

type Props = {
  onClick: any;
  className?: string;
  disabled?: boolean;
  primary?: boolean;
  children: ReactNode;
};

Button.defaultProps = {
  primary: true,
};

function Button(props: Props) {
  return (
    <button
      type="button"
      className={classNames(
        "inline-flex items-center px-3 py-3 text-lg font-medium rounded-md w-full text-center justify-center",
        { "cursor-not-allowed": props.disabled },
        { "": !props.disabled },
        // primary, enabled
        {
          "text-white bg-prismade-blue border-2 border-prismade-blue":
            props.primary && !props.disabled,
        },
        // primary, disabled
        {
          "text-prismade-blue bg-white border-2 border-prismade-blue":
            props.primary && props.disabled,
        },
        // secondary, enabled
        {
          "text-prismade-blue bg-gray-200": !props.primary && !props.disabled,
        },
        props.className
      )}
      onClick={props.onClick}
      disabled={props.disabled}
    >
      {props.children}
    </button>
  );
}

export default Button;
