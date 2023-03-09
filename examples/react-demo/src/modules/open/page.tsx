import { useEffect, useState } from "react";
import { getScaleFactor } from "../../helpers/scale";
import { PrismaSDK, UsabilityResponse } from "@prismadelabs/prismaid";
import { Navigate } from "react-router-dom";
import { AppData } from "./AppData";
import { SwipeData } from "../swipe/SwipeData";
import Spinner from "../common/components/Spinner";
import SDKSingleton from "../swipe/SDK";

type Props = {};

function Open(props: Props) {
  const [scaleIsReady, setScaleIsReady] = useState(false);
  const sdk: PrismaSDK = SDKSingleton.getInstance().sdk;

  useEffect(() => {
    AppData.update((s) => {
      s.invocationIsValid = true;
    });

    sdk.getInitialisationSubject().subscribe((response) => {
      if (response.ppi) {
        var scale = getScaleFactor(response.ppi, response.devicePixelRatio);

        if (!Number.isNaN(scale)) {
          SwipeData.update((s) => {
            s.scaleFactor = scale;
          });
          console.log("scaleFactor", scale);
        }
      } else {
        AppData.update((s) => {
          s.deviceIsSupported = false;
        });
        console.log("device_not_supported");
      }

      if (response.deviceSupport?.requirements?.includes("touchsensitivity")) {
        AppData.update((s) => {
          s.needsTouchSensitivity = true;
        });
      }
      if(response.isDisplayZoomEnabled){
        AppData.update((s) => {
          s.displayZoomEnabled = true;
        });
        console.log("device_not_supported");
      }

      // wait a little, to allow for possible (but not neccessary usability subject response)
      setTimeout(() => {
        setScaleIsReady(true);
      }, 10);
    });

    sdk.getUsabilitySubject().subscribe((response: UsabilityResponse) => {
      if (response.event === "device_not_supported") {
        AppData.update((s) => {
          s.deviceIsSupported = false;
        });
        console.log("device_not_supported");
      }

      if (response.event === "browser_not_supported") {
        AppData.update((s) => {
          s.browserIsSupported = false;
        });
        console.log("browser_not_supported");
      }

      if (response.event === "display_too_small_displacement") {
        AppData.update((s) => {
          s.screenIsBigEnough = false;
        });
        console.log("display_too_small_displacement");
      }

      if (response.event === "display_small_should_add_to_home") {
        AppData.update((s) => {
          s.screenIsBigEnough = false;
        });
        console.log("display_small_should_add_to_home");
      }
    });
  }, [sdk]);

  if (scaleIsReady) {
    return <Navigate to="/start" />;
  }

  return (
    <div className="h-full">
      <Spinner />
    </div>
  );
}

export default Open;
