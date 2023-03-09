import { Navigate } from "react-router-dom";
import { useInvocationCheck } from "../../hooks/useInvocationCheck";
import { AppData } from "../open/AppData";

type Props = {};

function ScreenSize(props: Props) {
  useInvocationCheck();

  const screenIsBigEnough = AppData.useState((s) => s.screenIsBigEnough);

  if (screenIsBigEnough) {
    return <Navigate to="/swipe" replace />;
  }

  return <Navigate to="/notice" replace />;
}

export default ScreenSize;
