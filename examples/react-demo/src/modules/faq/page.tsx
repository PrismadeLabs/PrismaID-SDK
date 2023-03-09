import React from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import IconButton from "../common/ui/IconButton";
import HeaderBar from "../common/components/HeaderBar";
import FaqDetails from "./translations/FaqDetail";
import { FaqData } from "./FaqData";
import { useInvocationCheck } from "../../hooks/useInvocationCheck";
import Sound from "../common/sound/Sound";
import click from "../../assets/sounds/click.mp3";
import { useDataReset } from "../../hooks/useDataReset";
import OrientationLock from "../common/layout/screenOrientation/OrientationLock";
import MotionPage from "../common/layout/MotionPage";

type Props = {};

function FAQ(props: Props) {
  let navigate = useNavigate();
  const { t } = useTranslation();

  const clickSound = new Sound(click);

  useInvocationCheck();
  useDataReset();

  const origin = FaqData.useState((s) => s.origin);

  return (
    <MotionPage className="h-full">
      <OrientationLock>
        <div className="w-screen h-full overflow-scroll">
          <HeaderBar>
            <div className="absolute left-0">
              <IconButton
                icon="arrow-left"
                onClick={() => {
                  clickSound.play();
                  navigate(origin, { replace: true });
                }}
              />
            </div>
            <div className="flex items-center justify-center w-full text-lg font-semibold">{t("faq:title")}</div>
          </HeaderBar>

          <div className="w-full p-4 mx-auto mb-4 space-y-4 prose text-left text-gray-900">
            <p>{t("faq:intro")}</p>
            <FaqDetails summary={t("faq:1q")}>
              <p>{t("faq:1a_1")}</p>
              <ul>
                <li>{t("faq:1a_2")}</li>
                <li>{t("faq:1a_3")}</li>
                <li>{t("faq:1a_4")}</li>
                <li>{t("faq:1a_5")}</li>
                <li>{t("faq:1a_6")}</li>
                <li>{t("faq:1a_7")}</li>
              </ul>
            </FaqDetails>

            <FaqDetails summary={t("faq:2q")}>
              <p>{t("faq:2a")}</p>
            </FaqDetails>

            <FaqDetails summary={t("faq:3q")}>
              <p>{t("faq:3a")}</p>
            </FaqDetails>

            <FaqDetails summary={t("faq:4q")}>
              <p>{t("faq:4a")}</p>
            </FaqDetails>

            <FaqDetails summary={t("faq:5q")}>
              <p>{t("faq:5a")}</p>
            </FaqDetails>
          </div>
        </div>
      </OrientationLock>
    </MotionPage>
  );
}

export default FAQ;
