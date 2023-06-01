import { OverlayMode } from "klinecharts";

export type SpeedType = { title: string; value: number }[];

export type TimeFrame = {
  multiplier?: number;
  timespan?: string;
  text?: string;
  req?: string;
};

export type IndicatorSettingsModalParams = {
  visible: boolean;
  indicatorName: string;
  paneId: string;
  calcParams: Array<any>;
};

export type IndicatorStore = {
  isModalOpen: boolean;
  mainIndicators: string[];
  subIndicators: { [painId: string]: string };
  indicatorSettingModalParams: IndicatorSettingsModalParams;

  setIsModalOpen: (isModalOpen: boolean) => void;
  setMainIndicators: (mainIndicators: string[]) => void;
  setSubIndicators: (subIndicators: { [painId: string]: string }) => void;
  setIndicatorSettingsModalParams: (
    indicatorSettingModalParams: IndicatorSettingsModalParams
  ) => void;
};

export type DrawingStore = {
  isVisible: boolean;
  isLocked: boolean;
  mode: OverlayMode;
  setIsVisible: (isVisible: boolean) => void;
  setMode: (mode: OverlayMode) => void;
  setIsLocked: (isLocked: boolean) => void;
};

export enum EXCHANGES {
  BinanceSpot = "BinanceSpot",
  BinancePerpetual = "BinancePerpetual",
  BinancePerpetualCoin = "BinancePerpetualCoin",
  ByBitSpot = "ByBitSpot",
  ByBitPerpetual = "ByBitPerpetual",
  ByBitInverse = "ByBitInverse",
}

export type ChartStore = {
  timeFrame: TimeFrame;
  currentExchange: EXCHANGES;
  loading: boolean;
  nextCandleIndex: number;
  speed: number;
  nextData: any[] | null;
  isSelectingCandle: boolean;
  isBarReplayOn: boolean;
  isBarReplayPlaying: boolean;
  currentSymbol: string;
  symbols: any[];
  isSymbolModalOpen: boolean;
  actions: {
    setNextData: (nextData: any[] | null) => void;
    setCurrentExchange: (currentExchange: EXCHANGES) => void;
    setSpeed: (speed: number) => void;
    setNextCandleIndex: (nextCandleIndex: number) => void;
    setLoading: (loading: boolean) => void;
    setTimeFrame: (t: TimeFrame) => void;
    setIsSelectingCandle: (isSelectingCandle: boolean) => void;
    setIsBarReplayOn: (isBarReplayOn: boolean) => void;
    setIsBarReplayPlaying: (isBarReplayPlaying: boolean) => void;
    incrementNextCandleIndex: () => void;
    setCurrentSymbol: (currentSymbol: string) => void;
    setSymbols: (symbols: any[]) => void;
    setIsSymbolModalOpen: (isSymbolModalOpen: boolean) => void;
  };
};

export type ChartType = "candle_solid" | "ohlc" | "area";
export type PriceAxisType = "normal" | "percentage" | "log";
export type SettingsType = {
  showWatermark: boolean;
  type: ChartType;
  showGrid: boolean;
  reverse: boolean;
  priceAxisType: PriceAxisType;
  showCrosshair: boolean;
};
export type SettingsStore = {
  settings: SettingsType;
  setSettings: (setting: Partial<SettingsType>) => void;
  isModalOpen: boolean;
  setIsModalOpen: (isModalOpen: boolean) => void;
};

type PositionType = {
  isOpened: boolean;
  direction: "LONG" | "SHORT";
  profit: string | number;
  openPrice: number;
};
export type PositionStore = {
  position: PositionType;
  setPosition: (position: Partial<PositionType>) => void;
};

export type OnPositionChange = {
  type?: "LONG" | "SHORT";
  status: "OPENED" | "CLOSED";
};

export type MyAlert = {
  text: string;
  id: string;
  status: "info" | "success" | "warning" | "error";
};

export type AlertStore = {
  alerts: MyAlert[] | [];
  removeAlert: (id: string) => void;
  addAlert: (alert: MyAlert) => void;
};

export type PositionModel = {
  id?: number;
  direction: "LONG" | "SHORT";
  profit: string | number;
  openPrice: number;
  closePrice: number;
  symbol: string;
  exchange: string;
};
