import classNames from "classnames";
import { CSSProperties, useEffect, useState } from "react";
import { SwipeData } from "../../swipe/SwipeData";

type Props = {
  src: string;
  id: string;
  alt: string;
  className?: string;
  opacity?: number;
  style?: CSSProperties;
};

function ScaledImage({ src, id, alt, className = "", opacity = 1, style = {} }: Props) {
  const scaleFactor = SwipeData.useState((s) => s.scaleFactor);
  const [width, setWidth] = useState(0);

  useEffect(() => {
    let img = new Image();
    img.src = src;
    img.onload = () => {
      setWidth(img.width);
    };
  }, [src]);

  return (
    <img
      src={src}
      id={id}
      alt={alt}
      className={classNames("select-none max-w-none", className)}
      style={{
        width: width * scaleFactor,
        opacity: opacity,
        ...style,
      }}
    />
  );
}

export default ScaledImage;
