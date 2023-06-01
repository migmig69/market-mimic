import { create } from "zustand";
import {
  ChartStore,
  DrawingStore,
  EXCHANGES,
  IndicatorStore,
  PositionStore,
  SettingsStore,
  AlertStore,
} from "../utils/types";
import { Exchanges, Speeds } from "../utils/Constants";
import { OverlayMode } from "klinecharts";

export const useIndicatorStore = create<IndicatorStore>((set) => ({
  isModalOpen: false,
  setIsModalOpen: (isModalOpen) => set({ isModalOpen }),
  mainIndicators: [],
  setMainIndicators: (mainIndicators) => set({ mainIndicators }),
  subIndicators: {},
  setSubIndicators: (subIndicators) => set({ subIndicators }),
  indicatorSettingModalParams: {
    visible: false,
    indicatorName: "",
    paneId: "",
    calcParams: [],
  },
  setIndicatorSettingsModalParams: (indicatorSettingModalParams) =>
    set({ indicatorSettingModalParams }),
}));

export const useDrawingStore = create<DrawingStore>((set) => ({
  isVisible: false,
  isLocked: false,
  mode: OverlayMode.Normal,
  setIsVisible: (isVisible) => set({ isVisible }),
  setMode: (mode: OverlayMode) => set({ mode }),
  setIsLocked: (isLocked) => set({ isLocked }),
}));

export const useChartStore = create<ChartStore>((set) => ({
  currentExchange: EXCHANGES.ByBitSpot,
  timeFrame: Exchanges.ByBitSpot.defaultTimeFrame,
  loading: false,
  nextCandleIndex: 0,
  speed: Speeds[1].value, // default is normal
  nextData: [],
  isSelectingCandle: false,
  isBarReplayOn: false,
  isBarReplayPlaying: false,
  currentSymbol: "BTCUSDT",
  symbols: [],
  isSymbolModalOpen: false,
  actions: {
    setSpeed: (speed) => set({ speed }),
    setCurrentExchange: (currentExchange) => set({ currentExchange }),
    setNextData: (nextData) => set({ nextData }),
    setNextCandleIndex: (nextCandleIndex) => set({ nextCandleIndex }),
    incrementNextCandleIndex: () =>
      set((state) => ({ nextCandleIndex: state.nextCandleIndex + 1 })),
    setLoading: (loading) => set({ loading }),
    setTimeFrame: (timeFrame) => set({ timeFrame }),
    setIsSelectingCandle: (isSelectingCandle) => set({ isSelectingCandle }),
    setIsBarReplayOn: (isBarReplayOn) => set({ isBarReplayOn }),
    setIsBarReplayPlaying: (isBarReplayPlaying) => set({ isBarReplayPlaying }),
    setCurrentSymbol: (currentSymbol) => set({ currentSymbol }),
    setSymbols: (symbols) => set({ symbols }),
    setIsSymbolModalOpen: (isSymbolModalOpen) => set({ isSymbolModalOpen }),
  },
}));

export const useSettingsStore = create<SettingsStore>((set, get) => ({
  settings: {
    type: "candle_solid",
    showGrid: false,
    reverse: false,
    showCrosshair: true,
    priceAxisType: "normal",
    showWatermark: true,
  },
  isModalOpen: false,
  setSettings: (settings) => {
    set({ settings: { ...get().settings, ...settings } });
  },
  setIsModalOpen: (isModalOpen) => set({ isModalOpen }),
}));

export const usePositionStore = create<PositionStore>((set, get) => ({
  position: {
    isOpened: false,
    direction: "LONG",
    profit: 0,
    openPrice: 0,
  },
  setPosition: (position) => {
    set({ position: { ...get().position, ...position } });
  },
}));

export const useChartActionsStore = () =>
  useChartStore((state) => state.actions);

export const useAlerts = create<AlertStore>((set, get) => ({
  alerts: [],
  removeAlert: (id) => set({ alerts: get().alerts.filter((a) => a.id !== id) }),
  addAlert: (alert) => {
    set({ alerts: [...get().alerts, alert] });
    setTimeout(() => {
      get().removeAlert(alert.id);
    }, 5000);
  },
}));
