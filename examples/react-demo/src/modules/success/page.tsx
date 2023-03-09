import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useInvocationCheck } from "../../hooks/useInvocationCheck";
import MessageTitle from "../common/components/MessageTitle";
import IconButton from "../common/ui/IconButton";
import Sound from "../common/sound/Sound";
import click from "../../assets/sounds/click.mp3";

import { useDataReset } from "../../hooks/useDataReset";
import OrientationLock from "../common/layout/screenOrientation/OrientationLock";
import MotionPage from "../common/layout/MotionPage";
import Button from "../common/ui/Button";

type Props = {};

function Verified(props: Props) {
  let navigate = useNavigate();
  const { t } = useTranslation();

  const clickSound = new Sound(click);

  useInvocationCheck();
  useDataReset();
  return (
    <MotionPage className="h-full">
      <OrientationLock>
        <div
          className="flex flex-col items-center justify-between w-screen h-full p-8 bg-white"       
        >
          <div className="relative flex items-center justify-center w-screen text-center">
            <div className="absolute left-0">
              <IconButton
                icon="arrow-left"
                onClick={() => {
                  clickSound.play();
                  navigate("/start", { replace: true });
                }}
              />
            </div>
            <MessageTitle className="text-green-600">{t("success:title")}</MessageTitle>
          </div>
          <div className="mt-8">
            <p className="text-2xl font-semibold text-center text-green-600 ">{t("success:cardName")}</p>
          </div>
          <div className="w-full space-y-4">
            <Button
              onClick={() => {
                clickSound.play();
                navigate("/start", { replace: true });
              }}
            >
              {t("success:button")}
            </Button>
            </div>
        </div>
      </OrientationLock>
    </MotionPage>
  );
}

export default Verified;
