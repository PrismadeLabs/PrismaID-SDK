import { useInvocationCheck } from "../../hooks/useInvocationCheck";
import { useBodyScrollLock } from "../../hooks/useBodyScrollLock";
import { useNavigate } from "react-router-dom";
import React, { useEffect, useRef } from "react";
import IconButton from "../common/ui/IconButton";
import { FaqData } from "../faq/FaqData";
import ProgressBar from "./ProgressBar";
import NetworkIndicator from "./NetworkIndicator";
import SwipeField from "./SwipeField";
import SwipeMessage from "./SwipeMessage";
import { SwipeData } from "./SwipeData";
import OrientationLock from "../common/layout/screenOrientation/OrientationLock";
import Sound from "../common/sound/Sound";
import click from "../../assets/sounds/click.mp3";
import MotionPage, { MotionPageVariant } from "../common/layout/MotionPage";

type Props = {};

function Swipe(props: Props) {
  let navigate = useNavigate();

  const scaleFactor = SwipeData.useState((s) => s.scaleFactor);

  const clickSound = new Sound(click);

  useInvocationCheck();
  useBodyScrollLock();

  const mounted = useRef();
  useEffect(() => {
    if (!mounted.current) {
      // do componentDidMount logic
    } else {
      // do componentDidUpdate logic
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  });

  return (
    <MotionPage
      className="h-full"
      initial={MotionPageVariant.InitialOnBottom}
      animate={MotionPageVariant.SlideInVertical}
      exit={MotionPageVariant.FadeOut}
    >
      <OrientationLock>
        <div className="flex flex-col w-screen h-full bg-white">
          <div className="h-full">
            <SwipeMessage />
            <SwipeField scaleFactor={scaleFactor} navigate={navigate} />
            <ProgressBar />
            <NetworkIndicator />
          </div>
          <div className="absolute top-0 flex items-center justify-center w-screen h-16 text-center">
            <div className="absolute left-0">
              <IconButton
                icon="x"
                onClick={() => {
                  clickSound.play();
                  navigate("/start", { replace: true });
                }}
              />
            </div>
            <div className="absolute right-0">
              <IconButton
                icon="help-circle"
                onClick={() => {
                  clickSound.play();
                  FaqData.update((s) => {
                    s.origin = "/swipe";
                  });
                  navigate("/faq", { replace: true });
                }}
              />
            </div>
          </div>
        </div>
      </OrientationLock>
    </MotionPage>
  );
}

export default Swipe;
