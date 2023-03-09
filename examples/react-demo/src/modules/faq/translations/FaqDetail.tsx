import { ReactNode } from "react";

type Props = {
  summary: string;
  children: ReactNode;
};

function FaqDetails(props: Props) {
  return (
    <details className="mt-4">
      <summary className="text-lg font-semibold">{props.summary}</summary>
      <div className="mx-4">{props.children}</div>
    </details>
  );
}

export default FaqDetails;
