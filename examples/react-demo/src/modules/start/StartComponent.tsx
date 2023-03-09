import React from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import Button from "../common/ui/Button";
import Sound from "../common/sound/Sound";
import click from "../../assets/sounds/click.mp3";
import prismade from "../../assets/img/logos/prismade.svg";
import card from "./img/id-card.png";
import bg from "../../assets/img/bg/bg1.png";

// Please, only visuals here, as this component is also used as background.
// Checks and Google Analytics calls are to be set in /start/page.tsx

function StartComponent() {
  let navigate = useNavigate();
  const [t] = useTranslation();
  const clickSound = new Sound(click);

  return (
    <div
      className="flex flex-col items-center justify-between w-screen h-full pt-8 text-center"
    >
      <img src={prismade} alt="Logo Prismade" className="h-12 px-8 mb-4" />

      <div className="w-full px-6">
        <Button
          onClick={() => {
            clickSound.play();
            navigate("/screenSize", { replace: true });
          }}
        >
          {t("start:button")}
        </Button>
        </div>
        <a
          href="https://prismade.com/contact/"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center w-full px-3 py-3 mt-2 text-lg font-medium text-center rounded-md text-prismade-blue"
        >
          {t("start:button2")}
        </a>
    </div>
  );
}

export default StartComponent;
