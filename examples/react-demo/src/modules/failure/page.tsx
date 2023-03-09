import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useInvocationCheck } from "../../hooks/useInvocationCheck";
import { useDataReset } from "../../hooks/useDataReset";
import anime from "animejs";
import MessageTitle from "../common/components/MessageTitle";
import Button from "../common/ui/Button";
import IconButton from "../common/ui/IconButton";
import MessageParagraph from "../common/components/MessageParagraph";
import Sound from "../common/sound/Sound";

import click from "../../assets/sounds/click.mp3";

import cross from "./img/cross@2x.png";
import OrientationLock from "../common/layout/screenOrientation/OrientationLock";
import MotionPage from "../common/layout/MotionPage";

type Props = {};

function Failure(props: Props) {
  let navigate = useNavigate();
  const { t } = useTranslation();

  const clickSound = new Sound(click);

  useInvocationCheck();
  useDataReset();

  useEffect(() => {
    anime.set(["#cross_container"], {
      scale: 0.5,
      opacity: 0,
    });

    setTimeout(() => {
      anime({
        targets: ["#cross_container"],
        opacity: 1.0,
        scale: 1.1,
        duration: 1500,
        easing: "easeInOutQuad",
        complete: () => {
          anime({
            targets: ["#cross_container"],
            scale: 1,
            duration: 500,
            easing: "easeInOutQuad",
          });
        },
      });
    }, 1500);
  }, []);

  return (
    <MotionPage className="h-full">
      <OrientationLock>
        <div
          className="flex flex-col items-center justify-between w-screen h-full p-8 bg-white bg-bottom bg-no-repeat bg-cover"
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
            <MessageTitle>{t("failure:title")}</MessageTitle>
          </div>
          <MessageParagraph>{t("failure:p1")}</MessageParagraph>
          <div
            className="flex flex-col items-center justify-center flex-grow w-screen"
          >
            <div id="cross_container">
              <img src={cross} alt="cross" id="cross" className="h-24 mx-auto mt-4" />
              <p className="mt-4 text-2xl font-semibold text-center text-red-500" id="cross_label">
                {t("failure:cardName")}
              </p>
            </div>
          </div>
          <div className="w-full space-y-4">
            <Button
              onClick={() => {
                clickSound.play();
                navigate("/start", { replace: true });
              }}
            >
              {t("failure:button1")}
            </Button>
            <a
              href="https://www.prismade.com"
              className="inline-flex items-center justify-center w-full px-3 py-3 text-lg font-medium text-center bg-gray-200 rounded-md text-prismade-blue"
            >
              {t("failure:button2")}
            </a>
          </div>
        </div>
      </OrientationLock>
    </MotionPage>
  );
}

export default Failure;
