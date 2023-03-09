import { ConnectivityStatus } from "@prismadelabs/prismaid";
import React, { useEffect, useState } from "react";
import { Wifi, WifiOff } from "react-feather";
import { SwipeData } from "./SwipeData";

function NetworkIndicator() {
  const networkStatus = SwipeData.useState((s) => s.networkStatus);
  const [icon, setIcon] = useState(<></>);

  useEffect(() => {
    switch (networkStatus) {
      case ConnectivityStatus.ok:
        setIcon(<></>);
        break;
      case ConnectivityStatus.slow:
        setIcon(
          <div
            className="absolute top-0 flex justify-end w-full p-4 pr-14"
            style={{
              touchAction: "none",
              pointerEvents: "none",
            }}
          >
            <Wifi color="orange" size={40} />
          </div>
        );
        break;
      default:
        // offline
        setIcon(
          <div
            className="absolute top-0 flex justify-end w-full p-4 pr-14"
            style={{
              touchAction: "none",
              pointerEvents: "none",
            }}
          >
            <WifiOff color="red" size={40} />
          </div>
        );
    }
  }, [networkStatus]);

  return <div>{icon}</div>;
}

export default NetworkIndicator;
