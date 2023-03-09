import classNames from "classnames";
import { useState } from "react";

type Props = {
  onToggle: any;
  checked?: boolean;
};

ToggleSwitch.defaultProps = {
  checked: false,
};

function ToggleSwitch(props: Props) {
  const [checked, setChecked] = useState(props.checked);

  return (
    <button
      type="button"
      aria-pressed={checked}
      onClick={() => {
        console.log("checked: ", !checked);
        setChecked(!checked);
        props.onToggle(!checked);
      }}
      className={classNames(
        "relative inline-flex flex-shrink-0 h-6 transition-colors duration-200 ease-in-out border-2 border-prismade-blue rounded-full cursor-pointer w-11 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500",
        { "bg-prismade-blue": checked },
        { "bg-white": !checked }
      )}
    >
      <span className="sr-only">Use setting</span>
      <span
        aria-hidden="true"
        className={classNames(
          "inline-block w-5 h-5 transition duration-200 ease-in-out translate-x-0 rounded-full ring-0 border border-white",
          { "translate-x-5 bg-white": checked },
          { "translate-x-0 bg-prismade-blue": !checked }
        )}
      ></span>
    </button>
  );
}

export default ToggleSwitch;
