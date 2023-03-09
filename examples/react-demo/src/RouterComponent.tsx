import { Route, Routes, useLocation } from "react-router-dom";
import Start from "./modules/start/page";
import Success from "./modules/success/page";
import Failure from "./modules/failure/page";
import Open from "./modules/open/page";
import TouchSensitivity from "./modules/touchSensitivity/page";
import ScreenSize from "./modules/screenSize/page";
import Swipe from "./modules/swipe/page";
import Notice from "./modules/notice/page";
import FAQ from "./modules/faq/page";
import { AnimatePresence } from "framer-motion";

// pages

const RouterComponent = () => {
  const location = useLocation();

  return (
    <div className="h-full">
      <AnimatePresence exitBeforeEnter>
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<Open />} />
          <Route path="/screenSize" element={<ScreenSize />} />
          <Route path="/start" element={<Start />} />
          <Route path="/touchSensitivity" element={<TouchSensitivity />} />
          <Route path="/swipe" element={<Swipe />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/success" element={<Success />} />
          <Route path="/failure" element={<Failure />} />
          <Route path="/notice" element={<Notice />} />
        </Routes>
      </AnimatePresence>
    </div>
  );
};

export default RouterComponent;
