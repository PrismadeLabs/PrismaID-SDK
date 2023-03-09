import { ReactNode } from "react";

type Props = {
  children: ReactNode;
};

function ErrorParagraph(props: Props) {
  return <p className="mt-2 whitespace-pre-wrap">{props.children}</p>;
}

export default ErrorParagraph;
