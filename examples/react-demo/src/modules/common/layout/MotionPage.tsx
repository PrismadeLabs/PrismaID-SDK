import { motion } from "framer-motion";
import { ReactNode } from "react";

export enum MotionPageVariant {
  InitialVisible = "initialVisible",
  InitialHidden = "initialHidden",
  InitialOnLeft = "initialOnLeft",
  InitialOnRight = "initialOnRight",
  InitialOnTop = "initialOnTop",
  InitialOnBottom = "initialOnBottom",

  FadeIn = "fadeIn",
  FadeOut = "fadeOut",

  SlideInHorizontal = "slideInHorizontal",
  SlideInVertical = "slideInVertical",

  SlideOutToLeft = "slideOutToLeft",
  SlideOutToRight = "slideOutToRight",
  SlideOutToTop = "slideOutToTop",
  SlideOutToBottom = "slideOutToBottom",
}

interface Props {
  children?: ReactNode;
  initial?: MotionPageVariant;
  animate?: MotionPageVariant;
  exit?: MotionPageVariant;
  className?: any;
  style?: any;
}

const MotionPage = (props: Props) => {
  const variants = {
    // initial
    initialVisible: {
      opacity: 1,
      x: "0%",
      y: "0%",
    },
    initialHidden: {
      opacity: 0,
    },
    initialOnLeft: {
      x: "-100%",
    },
    initialOnRight: {
      x: "100%",
    },
    initialOnTop: {
      y: "-100%",
    },
    initialOnBottom: {
      y: "100%",
    },
    // fade
    fadeIn: {
      opacity: 1,
      transition: {
        duration: 0.5,
      },
    },
    fadeOut: {
      opacity: 0,
      transition: {
        duration: 0.5,
      },
    },
    // slideIn
    slideInHorizontal: {
      x: "0%",
      transition: {
        duration: 0.5,
      },
    },
    slideInVertical: {
      y: "0%",
      transition: {
        duration: 0.5,
      },
    },
    // slideOut
    slideOutToLeft: {
      x: "-100%",
      transition: {
        duration: 0.5,
      },
    },
    slideOutToRight: {
      x: "100%",
      transition: {
        duration: 0.5,
      },
    },
    slideOutToTop: {
      y: "-100%",
      transition: {
        duration: 0.5,
      },
    },
    slideOutToBottom: {
      y: "100%",
      transition: {
        duration: 0.5,
      },
    },
  };

  return (
    <motion.div
      variants={variants}
      initial={props.initial || MotionPageVariant.InitialOnRight}
      animate={props.animate || MotionPageVariant.SlideInHorizontal}
      exit={props.exit || MotionPageVariant.SlideOutToLeft}
      className={props.className}
      style={props.style}
    >
      {props.children}
    </motion.div>
  );
};

export default MotionPage;
