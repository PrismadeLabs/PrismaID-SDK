import { Transition } from "@headlessui/react";
import { ConnectivityResponse, ConnectivityStatus, PrismaSDK } from "@prismadelabs/prismaid";
import React, { useEffect, useRef, useState } from "react";
import { Component } from "react";
import PositionedScaledImage from "../common/components/PositionedScaledImage";
import ScaledImage from "../common/components/ScaledImage";
import SDKSingleton from "./SDK";
import { SwipeData, SwipeResult } from "./SwipeData";

import frame from "./img/card@2x.png";
import touchPrint from "./img/touch_fingerabdruck@2x.png";
import pfeilTop from "./img/swipe-top@2x.png";
import pfeilBottom from "./img/swipe-bottom@2x.png";
import pfeilLinie from "./img/swipe-linie_lang@2x.png";
import dot from "./img/swipe-dot@2x.png";
import markerTop from "./img/swipe-marker@2x.png";
import markerBottom from "./img/swipe-marker@2x.png";
import swiper from "./img/swipe-escalator@2x.png";

import success from "../../assets/sounds/success.mp3";
import error from "../../assets/sounds/error.mp3";
import anime from "animejs";
import Sound from "../common/sound/Sound";
import i18n from "../../i18n";
import classNames from "classnames";

type Props = {
  scaleFactor: number;
  navigate: any;
};

type States = {
  showDot: boolean;
  showRedAlert: boolean;
  showGreenAlert: boolean;
  errorCount: number;
};

function SwipeField(props: Props) {
  const [errorCount, setErrorCount] = useState(0);
  const [showRedAlert, setShowRedAlert] = useState(false);
  const [showGreenAlert, setShowGreenAlert] = useState(false);
  const [showDot, setShowDot] = useState(false);
  const successSound = useRef(new Sound(success));
  const errorSound = useRef(new Sound(error));



  const [sdk] = useState(SDKSingleton.getInstance().sdk);

  // configure sdk
  useEffect(() => {
    sdk.resume();
    SwipeData.update((s) => {
      s.networkStatus = ConnectivityStatus.ok;
    });
    sdk.getProgressSubject().subscribe((response) => {
      console.log("*) progress:", response.progress);

      SwipeData.update((s) => {
        s.progress = response.progress;
      });
    });

    sdk.getConnectivitySubject().subscribe((response: ConnectivityResponse) => {
      console.log("*) connectivity response:", response.status);

      if (response.status === null) return;

      SwipeData.update((s) => {
        s.networkStatus = response.status;
      });
    });

    sdk.getDetectionSuccessSubject().subscribe((response) => {
      console.log("*) nextScreen:", response.rawData);
      flashGreenAlert()
      successSound.current.play();

      setTimeout(() => {
        setErrorCount(0)
        props.navigate("/success", { state: {}, replace: true });
      }, 500);
    });

    sdk.getDetectionErrorSubject().subscribe((response) => {
      console.log("*) detection error:", response.description());
      response.hints.forEach((hint) => {
        console.log("*) hint:", hint.description());
      });

      if (errorCount >= 4) {
        flashRedAlert();
        errorSound.current.play();
        setErrorCount(0);
        props.navigate("/failure", { state: {}, replace: true });
      } else {
        flashRedAlert();
        if (response.hints[0]) {
          updateMessages({
            title: i18n.t("swipe:swipe.title"),
            message: i18n.t("swipe:" + response.hints[0].code),
          });
        }
        setErrorCount(errorCount + 1)
        }
      });

    sdk.getInteractionSubject().subscribe((response) => {
      console.log("*) interaction event:", response.event, response.activeSignals);

      switch (response.event) {
        case "started":
          setShowDot(true);

          SwipeData.update((s) => {
            if (s.count === 0) {
              updateMessages({
                title: i18n.t("swipe:swipe.title"),
                message: i18n.t("swipe:swipe.body"),
              });
            }
          });

          break;
        case "changed":
          SwipeData.update((s) => {
            if (s.showWarningBackground) {
              s.showWarningBackground = false;
            }
          });
          break;
        case "complete":
          setShowDot(false);

          SwipeData.update((s) => {
            s.progress = 0;

            if (s.showWarningBackground) {
              s.showWarningBackground = false;
              s.showInteractiveHelp = true;

              updateMessages({
                title: i18n.t("swipe:swipe.title"),
                message: i18n.t("swipe:swipe.body"),
              });
            }
          });
          break;

        default:
          break;
      }
    });

    const screen = document.querySelector("#swipeScreen");
    if (screen) {
      console.log("attaching sdk...");
      sdk.attachToElement(screen);
    }

    setTimeout(() => {
      startDemoAnimation();
    }, 1000);
  })

  const updateMessages = (result: SwipeResult) => {
    SwipeData.update((s) => {
      let tmp = s.swipeResults;
      tmp.push({ ...result });
      s.swipeResults = tmp;
      s.count++;
    });

    // set visibility here to allow for transitions
    SwipeData.update((s) => {
      let tmp = s.swipeResults;
      // show last message
      if (tmp.length > 0) {
        tmp[tmp.length - 1].shouldRender = true;
      }
      // hide secondToLast message
      if (tmp.length > 1) {
        tmp[tmp.length - 2].shouldRender = false;
      }
      s.swipeResults = tmp;
    });
  };

  const flashRedAlert = () => {
    setShowRedAlert(true);

    setTimeout(() => {
      setShowRedAlert(false);
    }, 155);
  };

  const flashGreenAlert = () => {
    setShowGreenAlert(true);

    setTimeout(() => {
      setShowGreenAlert(false);
    }, 155);
  };

  const startDemoAnimation = () => {
    anime({
      targets: "#hologram",
      opacity: 1.0,
      duration: 500,
      easing: "linear",
    });
    anime({
      targets: "#hologram",
      scale: 1.8,
      duration: 1000,
      direction: "alternate",
      easing: "easeInOutQuad",
    });
    anime({
      targets: "#edge",
      opacity: 1.0,
      duration: 500,
      easing: "linear",
    });
    anime({
      targets: "#edge",
      scale: 1.2,
      duration: 1000,
      direction: "alternate",
      easing: "easeInOutQuad",
    });
    setTimeout(() => {
      anime({
        targets: "#edge",
        opacity: 0.5,
        duration: 1000,
        easing: "linear",
        complete: function () {
          anime({
            targets: "#edge",
            opacity: 1.0,
            duration: 1000,
            loop: true,
            direction: "alternate",
            easing: "linear",
          });
        },
      });
    }, 2000);

    setTimeout(() => {
      anime({
        targets: "#touchPrint",
        opacity: 0.6,
        duration: 1000,
        easing: "linear",
        complete: function () {
          anime({
            targets: "#touchPrint",
            opacity: 0.4,
            duration: 1000,
            loop: true,
            direction: "alternate",
            easing: "linear",
          });
        },
      });
    }, 1000);

    setTimeout(() => {
      anime({
        targets: ["#pfeilBottom", "#pfeilTop", "#pfeilLinie"],
        opacity: 1.0,
        duration: 1000,
        easing: "linear",
      });
    }, 3000);

    setTimeout(() => {
      anime({
        targets: "#pfeilLinie",
        translateY: -(780 * props.scaleFactor),
        duration: 7000,
        loop: true,
        easing: "linear",
      });
    }, 4000);

    setTimeout(() => {
      anime({
        targets: "#swiper",
        translateY: 0 - (window.innerHeight + 800 * props.scaleFactor),
        duration: 4000,
        loop: true,
        easing: "linear",
      });
    }, 6000);
  };
  const cardOffset = "mb-[clamp(1rem,7%,4rem)]";
  return (
      <div id="swipeScreen" className="absolute top-0 left-0 w-screen h-full">
        <PositionedScaledImage
          src={frame}
          id="frame"
          alt="plasticFrame"
          horizontalAlign="left"
          verticalAlign="bottom"
          horizontalOffset={17}
          className={cardOffset}
        />
        <PositionedScaledImage
          src={touchPrint}
          id="touchPrint"
          alt=""
          horizontalAlign="left"
          verticalAlign="bottom"
          horizontalOffset={-100}
          verticalOffset={-400}
          className={cardOffset}
          opacity={0}
        />

        <Transition
          show={showDot}
          enter="transition-opacity duration-100"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="transition-opacity duration-150"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <PositionedScaledImage
            src={markerTop}
            id="markerTop"
            alt=""
            horizontalAlign="left"
            verticalAlign="bottom"
            horizontalOffset={475}
            verticalOffset={-1096}
            className={cardOffset}
          />

          <PositionedScaledImage
            src={markerBottom}
            id="markerBottom"
            alt=""
            horizontalAlign="left"
            verticalAlign="bottom"
            horizontalOffset={475}
            verticalOffset={22}
            className={cardOffset}
          />

          <PositionedScaledImage
            src={dot}
            id="dot"
            alt=""
            horizontalAlign="left"
            verticalAlign="bottom"
            horizontalOffset={472}
            verticalOffset={-1130}
            className={cardOffset}
          />
        </Transition>

        <PositionedScaledImage
          src={pfeilTop}
          id="pfeilTop"
          alt=""
          horizontalAlign="left"
          verticalAlign="bottom"
          horizontalOffset={475}
          verticalOffset={-925}
          className={cardOffset}
          opacity={0}
        />

        <div
          className={classNames("absolute overflow-hidden", cardOffset)}
          style={{
            width: props.scaleFactor * 90 + "px",
            height: props.scaleFactor * 770 + "px",
            left: props.scaleFactor * 476 + "px",
            bottom: props.scaleFactor * 145 + "px",
          }}
        >
          <ScaledImage src={pfeilLinie} id="pfeilLinie" alt="" className="top-0 " opacity={0} />
        </div>

        <PositionedScaledImage
          src={pfeilBottom}
          id="pfeilBottom"
          alt=""
          horizontalAlign="left"
          verticalAlign="bottom"
          horizontalOffset={476}
          verticalOffset={-55}
          className={cardOffset}
          opacity={0}
        />

        <PositionedScaledImage
          src={swiper}
          id="swiper"
          alt=""
          horizontalAlign="left"
          verticalAlign="bottom"
          horizontalOffset={426}
          className={cardOffset}
          verticalOffset={870}
        />

        <Transition
          show={showRedAlert}
          enter="transition-opacity duration-150"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="transition-opacity duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
          className="h-full"
        >
          <div id="redAlert" className="h-full bg-opacity-75 bg-status-red" />
        </Transition>

        <Transition
          show={showGreenAlert}
          enter="transition-opacity duration-150"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="transition-opacity duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
          className="h-full"
        >
          <div id="greenAlert" className="h-full bg-opacity-75 bg-status-green" />
        </Transition>
      </div>
    );
  }

export default SwipeField as any;
