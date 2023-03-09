import { Store } from "pullstate";
import { ErrorCode } from "../../enums/ErrorCode";

type AppDataType = {
  invocationIsValid: boolean;
  deviceIsSupported: boolean;
  browserIsSupported: boolean;
  screenIsBigEnough: boolean;
  needsTouchSensitivity: boolean;
  touchSensitivityIsSet: boolean;
  displayZoomEnabled: boolean;
  errorCode: ErrorCode | null;
};

export const AppData = new Store<AppDataType>({
  invocationIsValid: false,
  deviceIsSupported: true,
  browserIsSupported: true,
  screenIsBigEnough: true,
  needsTouchSensitivity: false,
  touchSensitivityIsSet: false,
  displayZoomEnabled: false,
  errorCode: null,
});
