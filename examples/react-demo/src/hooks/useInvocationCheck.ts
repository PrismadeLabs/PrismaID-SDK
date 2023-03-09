import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ErrorCode } from "../enums/ErrorCode";
import { AppData } from "../modules/open/AppData";

export function useInvocationCheck() {
  let navigate = useNavigate();
  const invocationIsValid = AppData.useState((s) => s.invocationIsValid);

  useEffect(() => {
    if (!invocationIsValid) {
      AppData.update((s) => {
        s.errorCode = ErrorCode.InvalidInvocation;
      });
      navigate("/");
    }
  }, []);
}
