import React, { ReactNode } from "react";
import { useBodyScrollLock } from "../../../hooks/useBodyScrollLock";
import Card from "../components/Card";

type Props = {
  children: ReactNode;
};

function CardOverlay(props: Props) {
  useBodyScrollLock();

  return (
    <div className="absolute top-0 flex items-center w-screen h-full bg-gray-200/60 backdrop-blur-md">
      <div className="w-full m-8">
        <Card>{props.children}</Card>
      </div>
    </div>
  );
}

export default CardOverlay;
