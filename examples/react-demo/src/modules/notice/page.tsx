import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { ErrorCode } from "../../enums/ErrorCode";
import { AppData } from "../open/AppData";
import { FaqData } from "../faq/FaqData";
import CardOverlay from "../common/layout/CardOverlay";
import StartComponent from "../start/StartComponent";
import Button from "../common/ui/Button";
import ErrorTitle from "../common/components/ErrorTitle";
import ErrorParagraph from "../common/components/ErrorParagraph";
import { useNavigate } from "react-router-dom";
import Sound from "../common/sound/Sound";
import click from "../../assets/sounds/click.mp3";
import OrientationLock from "../common/layout/screenOrientation/OrientationLock";
import MotionPage from "../common/layout/MotionPage";

type Props = {};

type ErrorMessage = {
  title: string;
  body: string;
  button?: ErrorButton;
};

type ErrorButton = {
  title: string;
  action: any;
};

function Notice(props: Props) {
  const { t } = useTranslation();
  let navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState<ErrorMessage>({
    title: "",
    body: "",
  });

  const errorCode = AppData.useState((s) => s.errorCode);

  const clickSound = new Sound(click);

  useEffect(() => {
    const redirectToFaq = () => {
      FaqData.update((s) => {
        clickSound.play();
        s.origin = "/notice";
      });
      navigate("/faq", { replace: true });
    };

    const redirectToApp = () => {
      clickSound.play();
      navigate("/swipe", { replace: true });
    };

    switch (errorCode) {
      case ErrorCode.UnsupportedDevice:
        setErrorMessage({
          title: t("notice:invalidDevice.title"),
          body: t("notice:invalidDevice.body"),
          button: {
            title: t("notice:faq"),
            action: redirectToFaq,
          },
        });
        break;

      case ErrorCode.UnsupportedBrowser:
        setErrorMessage({
          title: t("notice:invalidBrowser.title"),
          body: t("notice:invalidBrowser.body"),
          button: {
            title: t("notice:faq"),
            action: redirectToFaq,
          },
        });
        break;

      case ErrorCode.ScreenTooSmall:
        setErrorMessage({
          title: t("notice:screenTooSmall.title"),
          body: t("notice:screenTooSmall.body"),
          button: {
            title: t("notice:proceedAnyway"),
            action: redirectToApp,
          },
        });
        break;

      case ErrorCode.InvalidInvocation:
        setErrorMessage({
          title: t("notice:invalidLink.title"),
          body: t("notice:invalidLink.body"),
        });
        break;
      
      case ErrorCode.DisplayZoomEnabled:
        setErrorMessage({
          title: t("notice:zoomedDisplay.title"),
          body: t("notice:zoomedDisplay.body"),
        });
        break;

      default:
        setErrorMessage({
          title: t("notice:error.title"),
          body: t("notice:error.body"),
        });
        break;
    }
  }, [errorCode, t]);

  const button = errorMessage.button?.title ? (
    <Button onClick={errorMessage.button?.action} className="w-full mt-6">
      {errorMessage.button.title}
    </Button>
  ) : (
    ""
  );

  if (errorMessage.body) {
    return (
      <MotionPage className="h-full">
        <OrientationLock>
          <div>
            <StartComponent />
            <CardOverlay>
              <ErrorTitle>{errorMessage!.title}</ErrorTitle>
              <ErrorParagraph>{errorMessage!.body}</ErrorParagraph>
              {button}
            </CardOverlay>
          </div>
        </OrientationLock>
      </MotionPage>
    );
  } else {
    return null;
  }
}

export default Notice;
