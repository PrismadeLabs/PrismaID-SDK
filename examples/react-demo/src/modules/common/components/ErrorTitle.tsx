import { ReactNode } from "react";

type Props = {
  children: ReactNode;
};

function ErrorTitle(props: Props) {
  return (
    <h1 className="text-lg font-extrabold whitespace-pre-wrap">
      {props.children}
    </h1>
  );
}

export default ErrorTitle;
