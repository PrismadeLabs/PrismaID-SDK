import React from "react";
import { SwipeData } from "./SwipeData";
import MessageParagraph from "../common/components/MessageParagraph";
import MessageTitle from "../common/components/MessageTitle";
import { Transition } from "@headlessui/react";

type Props = {};

function SwipeMessage(props: Props) {
  const swipeResults = SwipeData.useState((s) => s.swipeResults);

  return (
    <div className="relative w-screen no-touch">
      {swipeResults.map((result, index) => (
        <Transition
          show={result.shouldRender === true}
          enter="transition ease-in-out duration-1000"
          enterFrom="translate-x-full"
          enterTo="translate-x-0"
          leave="transition ease-in-out duration-1000"
          leaveFrom="translate-x-0"
          leaveTo="-translate-x-full"
          key={index}
        >
          <div className="absolute top-0 w-screen px-8 mt-4 space-y-2 bg-white no-no-touch">
            <MessageTitle>{result.title}</MessageTitle>
            <MessageParagraph>{result.message}</MessageParagraph>
          </div>
        </Transition>
      ))}
    </div>
  );
}

export default SwipeMessage;
