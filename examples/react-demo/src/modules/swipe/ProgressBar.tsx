import { useBodyScrollLock } from "../../hooks/useBodyScrollLock";
import { SwipeData } from "./SwipeData";

function ProgressBar() {
  useBodyScrollLock();

  const progress = SwipeData.useState((s) => s.progress);

  return (
    <div
      className="absolute bottom-0 flex w-screen overflow-hidden opacity-75 bg-status-green"
      style={{
        height: `${progress > 5 ? progress : 0}%`,
        touchAction: "none",
        pointerEvents: "none",
      }}
    ></div>
  );
}

export default ProgressBar;
