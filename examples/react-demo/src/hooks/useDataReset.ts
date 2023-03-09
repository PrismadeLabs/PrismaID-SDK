import { ConnectivityStatus } from "@prismadelabs/prismaid";
import i18next from "../i18n";
import { useEffect } from "react";
import { SwipeData } from "../modules/swipe/SwipeData";

export function useDataReset() {
  useEffect(() => {
    SwipeData.update((s) => {
      s.networkStatus = ConnectivityStatus.ok;
      s.progress = 0;
      s.showDot = false;
      s.swipeResults = [
        {
          title: i18next.t("swipe:place.title"),
          message: i18next.t("swipe:place.body"),
          shouldRender: true,
        },
      ];
      s.count = 0;
      s.errorCount = 0;
      s.showRedAlert = false;
      s.showGreenAlert = false;
      s.showWarningBackground = false;
      s.showInteractiveHelp = false;
    });
  }, []);
}
