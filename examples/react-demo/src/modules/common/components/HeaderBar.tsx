import { ReactNode } from "react";

type Props = {
  children: ReactNode;
};

function HeaderBar(props: Props) {
  return (
    <div className="relative flex items-center w-screen h-12 text-center bg-white border-b-2 border-prismade-blue">{props.children}</div>
  );
}

export default HeaderBar;
