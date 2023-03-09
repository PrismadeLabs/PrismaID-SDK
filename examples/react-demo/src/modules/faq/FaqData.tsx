import { Store } from "pullstate";

type FaqDataType = {
  origin: string;
};

export const FaqData = new Store<FaqDataType>({
  origin: "",
});
