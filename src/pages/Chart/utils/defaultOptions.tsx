import { LineType, TooltipIconPosition } from "klinecharts";

type DefaultProps = {
  theme: string;
  type: string;
  showGrid: boolean;
  reverse: boolean;
  priceAxisType: string;
  showCrosshair: boolean;
};
export const defaultOptions = ({
  theme = "dark",
  type = "solid_candle",
  showGrid = true,
  reverse = false,
  priceAxisType = "normal",
  showCrosshair = true,
}: DefaultProps) => ({
  crosshair: {
    show: true,
    horizontal: {
      show: showCrosshair,
    },
  },
  candle: {
    type: type,
    priceMark: {
      show: false,
    },
  },
  yAxis: {
    show: true,
    size: "auto",
    // 'left' | 'right'
    position: "right",
    // 'normal' | 'percentage' | 'log'
    type: priceAxisType,
    inside: false,
    reverse: reverse,
    axisLine: {
      show: true,
      color: "#888888",
      size: 1,
    },
  },
  grid: {
    show: showGrid,
    horizontal: {
      show: true,
      size: 1,
      color: theme === "dark" ? "rgba(255,255,255, .1)" : "rgba(0,0,0, .1)", ///////////////////////////////////// calculate it once
      style: LineType.Dashed,
      dashedValue: [2, 2],
    },
    vertical: {
      show: true,
      size: 1,
      color: theme === "dark" ? "rgba(255,255,255, .1)" : "rgba(0,0,0, .1)",
      style: LineType.Dashed,
      dashedValue: [2, 2],
    },
  },
  indicator: {
    tooltip: {
      icons: [
        {
          id: "visible",
          position: TooltipIconPosition.Middle,
          marginLeft: 8,
          marginTop: 7,
          marginRight: 0,
          marginBottom: 0,
          paddingLeft: 0,
          paddingTop: 0,
          paddingRight: 0,
          paddingBottom: 0,
          icon: "\ue903",
          fontFamily: "icomoon",
          size: 14,
          color: theme === "dark" ? "#929AA5" : "#76808F", ///////////////////////////////////// calculate it once
          activeColor: theme === "dark" ? "#929AA5" : "#76808F", ///////////////////////////////////// calculate it once
          backgroundColor: "transparent",
          activeBackgroundColor: "rgba(22, 119, 255, 0.15)",
        },
        {
          id: "invisible",
          position: TooltipIconPosition.Middle,
          marginLeft: 8,
          marginTop: 7,
          marginRight: 0,
          marginBottom: 0,
          paddingLeft: 0,
          paddingTop: 0,
          paddingRight: 0,
          paddingBottom: 0,
          icon: "\ue901",
          fontFamily: "icomoon",
          size: 14,
          color: theme === "dark" ? "#929AA5" : "#76808F",
          activeColor: theme === "dark" ? "#929AA5" : "#76808F",
          backgroundColor: "transparent",
          activeBackgroundColor: "rgba(22, 119, 255, 0.15)",
        },
        {
          id: "setting",
          position: TooltipIconPosition.Middle,
          marginLeft: 6,
          marginTop: 7,
          marginBottom: 0,
          marginRight: 0,
          paddingLeft: 0,
          paddingTop: 0,
          paddingRight: 0,
          paddingBottom: 0,
          icon: "\ue902",
          fontFamily: "icomoon",
          size: 14,
          color: theme === "dark" ? "#929AA5" : "#76808F",
          activeColor: theme === "dark" ? "#929AA5" : "#76808F",
          backgroundColor: "transparent",
          activeBackgroundColor: "rgba(22, 119, 255, 0.15)",
        },
        {
          id: "close",
          position: TooltipIconPosition.Middle,
          marginLeft: 6,
          marginTop: 7,
          marginRight: 0,
          marginBottom: 0,
          paddingLeft: 0,
          paddingTop: 0,
          paddingRight: 0,
          paddingBottom: 0,
          icon: "\ue900",
          fontFamily: "icomoon",
          size: 14,
          color: theme === "dark" ? "#929AA5" : "#76808F",
          activeColor: theme === "dark" ? "#929AA5" : "#76808F",
          backgroundColor: "transparent",
          activeBackgroundColor: "rgba(22, 119, 255, 0.15)",
        },
      ],
    },
  },
});
