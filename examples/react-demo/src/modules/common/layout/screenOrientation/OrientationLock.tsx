import React, { ReactNode } from "react";
import rotateDevice from "./img/rotate-device.png";

type OrientationLockProps = {
  children: ReactNode;
};

type OrientationLockStates = {
  orientation: string;
};

class OrientationLock extends React.Component<OrientationLockProps, OrientationLockStates> {
  constructor(props: OrientationLockProps) {
    super(props);

    this.state = {
      orientation: "portrait",
    };
  }

  shouldComponentUpdate(nextProps: OrientationLockProps, nextState: OrientationLockStates) {
    if (this.state.orientation === nextState.orientation) {
      return false;
    }
    return true;
  }

  render() {
    return (
      <>
        <div className="w-screen h-full portrait:hidden">
          <div className="flex content-center justify-center w-full h-full">
            <img src={rotateDevice} alt="Please rotate your device." className="m-auto max-h-1/2-screen" />
          </div>
        </div>
        <div className="w-screen h-full landscape:hidden">{this.props.children}</div>
      </>
    );
  }
}

export default OrientationLock;
