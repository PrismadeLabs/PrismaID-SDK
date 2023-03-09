import { Store } from "pullstate";
import { ConnectivityStatus } from "@prismadelabs/prismaid";
import i18next from "../../i18n";

export type SwipeResult = {
  title: string;
  message: string;
  shouldRender?: boolean;
};

type SwipeDataType = {
  scaleFactor: number;
  networkStatus: ConnectivityStatus;
  showDot: boolean;
  progress: number;
  swipeResults: SwipeResult[];
  count: number;
  errorCount: number;
  showRedAlert: boolean;
  showGreenAlert: boolean;
  showWarningBackground: boolean;
  showInteractiveHelp: boolean;
};

export const SwipeData = new Store<SwipeDataType>({
  scaleFactor: 0.5,
  networkStatus: ConnectivityStatus.ok,
  progress: 0,
  showDot: false,
  swipeResults: [
    {
      title: i18next.t("swipe:place.title"),
      message: i18next.t("swipe:place.body"),
      shouldRender: true,
    },
  ],
  count: 0,
  errorCount: 0,
  showRedAlert: false,
  showGreenAlert: false,
  showWarningBackground: false,
  showInteractiveHelp: false,
});
