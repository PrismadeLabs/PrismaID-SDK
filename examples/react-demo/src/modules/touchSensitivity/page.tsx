import React from "react";
import { useInvocationCheck } from "../../hooks/useInvocationCheck";
import MotionPage, { MotionPageVariant } from "../common/layout/MotionPage";
import OrientationLock from "../common/layout/screenOrientation/OrientationLock";
import TouchComponent from "./TouchComponent";

type Props = {};

function TouchSensitivity(props: Props) {
  useInvocationCheck();

  return (
    <MotionPage
      className="h-full"
      initial={MotionPageVariant.InitialHidden}
      animate={MotionPageVariant.FadeIn}
      exit={MotionPageVariant.FadeOut}
    >
      <OrientationLock>
        <TouchComponent />
      </OrientationLock>
    </MotionPage>
  );
}

export default TouchSensitivity;
