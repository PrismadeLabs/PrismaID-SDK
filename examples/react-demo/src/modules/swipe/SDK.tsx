import { PrismaSDK } from "@prismadelabs/prismaid";

class SDKSingleton {
  private static instance: SDKSingleton;
  sdk: PrismaSDK;

  constructor() {
    if (SDKSingleton.instance) {
      throw new Error("Error - use SDKSingleton.getInstance()");
    }
    this.sdk = new PrismaSDK(
      "SCvL5XDWme6pOy0Cbi6UN4WBGJSkEboM9y0fXo7T",
      "https://api.prismade.net/prismaid"
    );
    this.sdk.setTwoFingerHoldingMode(true);
  }

  static getInstance(): SDKSingleton {
    SDKSingleton.instance = SDKSingleton.instance || new SDKSingleton();
    return SDKSingleton.instance;
  }
}

export default SDKSingleton;
