import horizontalStraightLine from "./horizontalStraightLine";
import horizontalRayLine from "./horizontalRayLine";
import horizontalSegment from "./horizontalSegment";
import verticalStraightLine from "./verticalStraightLine";
import verticalRayLine from "./verticalRayLine";
import verticalSegment from "./verticalSegment";
import straightLine from "./straightLine";
import rayLine from "./rayLine";
import segment from "./segment";
import arrow from "./arrow";
import priceLine from "./priceLine";
import priceChannelLine from "./priceChannelLine";
import parallelStraightLine from "./parallelStraightLine";
import fibonacciLine from "./fibonacciLine";
import fibonacciSegment from "./fibonacciSegment";
import fibonacciCircle from "./fibonacciCircle";
import fibonacciSpiral from "./fibonacciSpiral";
import fibonacciSpeedResistanceFan from "./fibonacciSpeedResistanceFan";
import fibonacciExtension from "./fibonacciExtension";
import gannBox from "./gannBox";
import circle from "./circle";
import triangle from "./triangle";
import rect from "./rect";
import parallelogram from "./parallelogram";
import threeWaves from "./threeWaves";
import fiveWaves from "./fiveWaves";
import eightWaves from "./eightWaves";
import anyWaves from "./anyWaves";
import abcd from "./abcd";
import xabcd from "./xabcd";

import weakMagnet from "./weakMagnet";
import strongMagnet from "./strongMagnet";

import visible from "./visible";
import invisible from "./invisible";

import lock from "./lock";
import unlock from "./unlock";

import remove from "./remove";

export interface SelectDataSourceItem {
  key: string;
  text: JSX.Element | string;
}

export const mapping = {
  horizontalStraightLine,
  horizontalRayLine,
  horizontalSegment,
  verticalStraightLine,
  verticalRayLine,
  verticalSegment,
  straightLine,
  rayLine,
  segment,
  arrow,
  priceLine,
  priceChannelLine,
  parallelStraightLine,
  fibonacciLine,
  fibonacciSegment,
  fibonacciCircle,
  fibonacciSpiral,
  fibonacciSpeedResistanceFan,
  fibonacciExtension,
  gannBox,
  circle,
  triangle,
  rect,
  parallelogram,
  threeWaves,
  fiveWaves,
  eightWaves,
  anyWaves,
  abcd,
  xabcd,
  weak_magnet: weakMagnet,
  strong_magnet: strongMagnet,
  lock,
  unlock,
  visible,
  invisible,
  remove,
};

export function createSingleLineOptions(): SelectDataSourceItem[] {
  return [
    {
      key: "horizontalStraightLine",
      text: "Horizontal Straight Line",
    },
    { key: "horizontalRayLine", text: "Horizontal Ray Line" },
    { key: "horizontalSegment", text: "Horizontal Segment" },
    {
      key: "verticalStraightLine",
      text: "Vertical Straight Line",
    },
    { key: "verticalRayLine", text: "Vertical Ray Line" },
    { key: "verticalSegment", text: "Vertical Segment" },
    { key: "straightLine", text: "Straight Line" },
    { key: "rayLine", text: "Ray Line" },
    { key: "segment", text: "Segment" },
    { key: "arrow", text: "Arrow" },
    { key: "priceLine", text: "Price Line" },
  ];
}

export function createMoreLineOptions(): SelectDataSourceItem[] {
  return [
    { key: "priceChannelLine", text: "Price Channel Line" },
    {
      key: "parallelStraightLine",
      text: "Parallel Straight Line",
    },
  ];
}

export function createPolygonOptions(): SelectDataSourceItem[] {
  return [
    { key: "circle", text: "Circle" },
    { key: "rect", text: "Rect" },
    { key: "parallelogram", text: "Parallelogram" },
    { key: "triangle", text: "Triangle" },
  ];
}

export function createFibonacciOptions(): SelectDataSourceItem[] {
  return [
    { key: "fibonacciLine", text: "Fibonacci Line" },
    { key: "fibonacciSegment", text: "Fibonacci Segment" },
    { key: "fibonacciCircle", text: "Fibonacci Circle" },
    { key: "fibonacciSpiral", text: "Fibonacci Spiral" },
    {
      key: "fibonacciSpeedResistanceFan",
      text: "Fibonacci Speed Resistance Fan",
    },
    { key: "fibonacciExtension", text: "Fibonacci Extension" },
    { key: "gannBox", text: "GannBox" },
  ];
}

export function createWaveOptions(): SelectDataSourceItem[] {
  return [
    { key: "xabcd", text: "X ABCD" },
    { key: "abcd", text: "ABCD" },
    { key: "threeWaves", text: "Three Waves" },
    { key: "fiveWaves", text: "Five Waves" },
    { key: "eightWaves", text: "Eight Waves" },
    { key: "anyWaves", text: "Any Waves" },
  ];
}

// export function createMagnetOptions(): SelectDataSourceItem[] {
//   return [
//     { key: "weak_magnet", text: "weak_magnet" },
//     { key: "strong_magnet", text: "strong_magnet" },
//   ];
// }

interface IconProps {
  className?: string;
  name: string;
}

export const Icon = (props: IconProps) => {
  return (
    <span className={"w-5 h-5 inline-flex " + props.className}>
      {/* @ts-ignore */}
      {mapping[props.name]()}
    </span>
  );
};
