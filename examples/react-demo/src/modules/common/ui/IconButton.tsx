import { ArrowLeft, ChevronLeft, HelpCircle, X } from "react-feather";

type Props = {
  icon: string;
  onClick: any;
  size?: number;
  color?: string;
};

IconButton.defaultProps = {
  size: 35,
  color: "#6B7280",
};

function IconButton(props: Props) {
  let icon;
  switch (props.icon) {
    case "arrow-left":
      icon = <ArrowLeft size={props.size} color={props.color} />;
      break;
    case "chevron-left":
      icon = <ChevronLeft size={props.size} color={props.color} />;
      break;
    case "help-circle":
      icon = <HelpCircle size={props.size} color={props.color} />;
      break;
    case "x":
      icon = <X size={props.size} color={props.color} />;
      break;
    default:
      break;
  }

  return (
    <button
      className="p-2"
      onClick={props.onClick}
      style={{ touchAction: "auto" }}
    >
      {icon}
    </button>
  );
}

export default IconButton;
