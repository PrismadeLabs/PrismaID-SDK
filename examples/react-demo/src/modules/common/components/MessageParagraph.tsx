import { ReactNode } from "react";

type Props = {
  children: ReactNode;
};

function MessageParagraph(props: Props) {
  return (
    <p className="text-lg text-center whitespace-pre-wrap">{props.children}</p>
  );
}

export default MessageParagraph;
