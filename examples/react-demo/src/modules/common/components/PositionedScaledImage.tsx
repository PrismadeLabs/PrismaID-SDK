import { useEffect, useState } from "react";
import { SwipeData } from "../../swipe/SwipeData";
import ScaledImage from "./ScaledImage";
import classNames from "classnames";

type Props = {
  src: string;
  id: string;
  alt: string;
  className?: string;
  opacity?: number;
  verticalAlign: string;
  horizontalAlign: string;
  verticalOffset?: number;
  horizontalOffset?: number;
};

function PositionedScaledImage({
  src,
  id,
  alt,
  className = "",
  opacity = 1,
  verticalAlign,
  horizontalAlign,
  verticalOffset = 0,
  horizontalOffset = 0,
}: Props) {
  const scaleFactor = SwipeData.useState((s) => s.scaleFactor);
  const [horizontalPositioning, setHorizontalPositioning] = useState({});
  const [verticalPositioning, setVerticalPositioning] = useState({});

  useEffect(() => {
    // horizontal
    switch (horizontalAlign) {
      case "left":
        setHorizontalPositioning({
          left: 0 + horizontalOffset * scaleFactor,
        });
        break;
      case "center":
        setHorizontalPositioning({
          left: `calc(50% + (${horizontalOffset * scaleFactor}px))`,
          transform: "translateX(-50%)",
        });
        break;
      case "right":
        setHorizontalPositioning({
          right: 0 - horizontalOffset * scaleFactor,
        });
        break;
      default:
        console.log("no horizontalAlign defined");
        break;
    }

    switch (verticalAlign) {
      case "top":
        setVerticalPositioning({
          top: 0 + verticalOffset * scaleFactor,
        });
        break;
      case "center":
        setVerticalPositioning({
          top: `calc(50% + (${verticalOffset * scaleFactor}px))`,
          transform: "translateY(-50%)",
        });
        break;
      case "bottom":
        setVerticalPositioning({
          bottom: 0 - verticalOffset * scaleFactor,
        });
        break;
      default:
        console.log("no horizontalAlign defined");
        break;
    }
  }, [
    horizontalAlign,
    verticalAlign,
    horizontalOffset,
    verticalOffset,
    scaleFactor,
  ]);

  return (
    <ScaledImage
      src={src}
      id={id}
      alt={alt}
      className={classNames("absolute", className)}
      style={{
        ...horizontalPositioning,
        ...verticalPositioning,
        opacity: opacity,
      }}
    />
  );
}

export default PositionedScaledImage;
