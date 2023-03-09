import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { ErrorCode } from "../../enums/ErrorCode";
import { AppData } from "../open/AppData";
import StartComponent from "./StartComponent";
import { useInvocationCheck } from "../../hooks/useInvocationCheck";
import { useDataReset } from "../../hooks/useDataReset";
import OrientationLock from "../common/layout/screenOrientation/OrientationLock";
import MotionPage, { MotionPageVariant } from "../common/layout/MotionPage";

function Start() {
  const [redirect, setRedirect] = useState("");

  const invocationIsValid = AppData.useState((s) => s.invocationIsValid);
  const browserIsSupported = AppData.useState((s) => s.browserIsSupported);
  const deviceIsSupported = AppData.useState((s) => s.deviceIsSupported);
  const displayZoomEnabled = AppData.useState((s) => s.displayZoomEnabled);

  useInvocationCheck();
  useDataReset();

  useEffect(() => {
    if (!browserIsSupported) {
      setErrorCodeAndRedirect(ErrorCode.UnsupportedBrowser);
      return;
    }

    if (!deviceIsSupported) {
      setErrorCodeAndRedirect(ErrorCode.UnsupportedDevice);
      return;
    }
    if(displayZoomEnabled) {
      setErrorCodeAndRedirect(ErrorCode.DisplayZoomEnabled);
    }
  }, [invocationIsValid, browserIsSupported, deviceIsSupported, displayZoomEnabled]);

  const setErrorCodeAndRedirect = (code: ErrorCode) => {
    AppData.update((s) => {
      s.errorCode = code;
    });
    setRedirect("/notice");
  };

  if (redirect) {
    return <Navigate to={redirect} replace />;
  }

  return (
    <MotionPage
      className="h-full"
      initial={MotionPageVariant.InitialHidden}
      animate={MotionPageVariant.FadeIn}
      exit={MotionPageVariant.FadeOut}
    >
      <OrientationLock>
        <StartComponent />
      </OrientationLock>
    </MotionPage>
  );
}

export default Start;
