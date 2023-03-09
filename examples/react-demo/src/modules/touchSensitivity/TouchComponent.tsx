import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import CardOverlay from "../common/layout/CardOverlay";
import Button from "../common/ui/Button";
import ToggleSwitch from "../common/ui/ToggleSwitch";
import { AppData } from "../open/AppData";
import Sound from "../common/sound/Sound";
import click from "../../assets/sounds/click.mp3";
import { useNavigate } from "react-router-dom";

type Props = {};

function TouchComponent(props: Props) {
  let navigate = useNavigate();
  const { t } = useTranslation();

  const [checked, setChecked] = useState(AppData.useState((s) => s.touchSensitivityIsSet));

  const onToggle = (checked: boolean) => {
    AppData.update((s) => {
      s.touchSensitivityIsSet = checked;
    });
    setChecked(checked);
  };
  const clickSound = new Sound(click);

  return (
    <CardOverlay>
      <h1 className="text-lg font-bold">{t("touchSensitivity:title")}</h1>
      <p className="mt-4">{t("touchSensitivity:body")}</p>
      <div className="flex items-center justify-center w-full mt-4 space-x-4 text-center">
        <p>{t("touchSensitivity:label")}</p>
        <ToggleSwitch onToggle={onToggle} checked={checked} />
      </div>
      <div></div>
      <div className="w-full mt-4">
        <Button
          onClick={() => {
            clickSound.play();
            navigate("/swipe", { replace: true });
          }}
          disabled={!checked}
        >
          {t("touchSensitivity:button")}
        </Button>
      </div>
    </CardOverlay>
  );
}

export default TouchComponent;
