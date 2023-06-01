import { useEffect, useRef } from "react";
import {
  init,
  Chart,
  dispose,
  registerOverlay,
  OverlayMode,
  PaneOptions,
  Nullable,
  Indicator,
  KLineData,
  DomPosition,
} from "klinecharts";
import { shallow } from "zustand/shallow";
// import dayjs from "dayjs";
// import utc from "dayjs/plugin/utc";
import { ActionType } from "klinecharts";
import {
  Exchanges,
  defaultOptions,
  TimeFrame,
  transformData,
  getUrlParams,
  getRequest,
  EXCHANGES,
  getLoadMoreCondition,
  OnPositionChange,
  relDiff,
  adjustFromTo,
} from "./utils";
import {
  useAlerts,
  useChartActionsStore,
  useChartStore,
  useIndicatorStore,
  usePositionStore,
  useSettingsStore,
} from "./store";
import "./chart.css";
import "./iconfonts/style.css";
import { GetDataProps } from "./types";
import { Nav } from "./Nav";
import { useThemeStore, useInterval } from "@/utils";
import { Drawings } from "./Drawings";
// dayjs.extend(utc);

import overlays from "./extension";
import { Indicators } from "./Indicators";
import { IndicatorsSettings } from "./IndicatorsSettings";
import { Symbols } from "./Symbols";
import { Loading } from "./Loading";
import { Settings } from "./Settings";
import { Alerts } from "./Alerts";
import { chartDB } from "./utils/db";
overlays.forEach((o) => {
  registerOverlay(o);
});

export const ChartPage = () => {
  const theme = useThemeStore((state) => state.theme);
  const watermark = useRef<HTMLDivElement>();
  const {
    settings: {
      type,
      reverse,
      showGrid,
      priceAxisType,
      showWatermark,
      showCrosshair,
    },
    setSettings,
  } = useSettingsStore((state) => ({
    settings: state.settings,
    setSettings: state.setSettings,
  }));
  const chartRef = useRef<Chart | null>(null);

  const {
    mainIndicators,
    subIndicators,
    setMainIndicators,
    setSubIndicators,
    setIndicatorSettingsModalParams,
    indicatorSettingModalParams,
  } = useIndicatorStore((state) => ({
    mainIndicators: state.mainIndicators,
    subIndicators: state.subIndicators,
    setMainIndicators: state.setMainIndicators,
    setSubIndicators: state.setSubIndicators,
    indicatorSettingModalParams: state.indicatorSettingModalParams,
    setIndicatorSettingsModalParams: state.setIndicatorSettingsModalParams,
  }));

  const createIndicator = (
    indicatorName: string,
    isStack?: boolean,
    paneOptions?: PaneOptions
  ): Nullable<string> => {
    if (indicatorName === "VOL") {
      paneOptions = { gap: { bottom: 2 }, ...paneOptions };
    }
    return (
      chartRef.current?.createIndicator(
        {
          name: indicatorName,
          // @ts-expect-error
          createTooltipDataSource: ({ indicator, defaultStyles }) => {
            const icons = [];
            if (indicator.visible) {
              icons.push(defaultStyles.tooltip.icons[1]);
              icons.push(defaultStyles.tooltip.icons[2]);
              icons.push(defaultStyles.tooltip.icons[3]);
            } else {
              icons.push(defaultStyles.tooltip.icons[0]);
              icons.push(defaultStyles.tooltip.icons[2]);
              icons.push(defaultStyles.tooltip.icons[3]);
            }
            return { icons };
          },
        },
        isStack,
        paneOptions
      ) ?? null
    );
  };

  const {
    timeFrame,
    loading,
    speed,
    nextData,
    isSelectingCandle,
    isBarReplayPlaying,
    nextCandleIndex,
    currentExchange,
    currentSymbol,
    isBarReplayOn,
  } = useChartStore(
    (state) => ({
      timeFrame: state.timeFrame,
      loading: state.loading,
      nextCandleIndex: state.nextCandleIndex,
      speed: state.speed,
      nextData: state.nextData,
      isSelectingCandle: state.isSelectingCandle,
      isBarReplayOn: state.isBarReplayOn,
      isBarReplayPlaying: state.isBarReplayPlaying,
      currentExchange: state.currentExchange,
      currentSymbol: state.currentSymbol,
    }),
    shallow
  );

  const {
    setTimeFrame,
    setLoading,
    setNextCandleIndex,
    setNextData,
    setIsSelectingCandle,
    setIsBarReplayOn,
    setIsBarReplayPlaying,
    incrementNextCandleIndex,
    setCurrentSymbol,
  } = useChartActionsStore();

  const { setPosition, position } = usePositionStore();
  useInterval(
    async () => {
      if (loading === true) return;
      if (nextData === null) return;
      const current = nextData[nextCandleIndex];
      // we only have one candle to print
      if (nextData.length === 1 && nextCandleIndex === 0) {
        chartRef.current?.updateData(current);
        finishBarReplay();

        return;
      }
      const dataList = chartRef?.current?.getDataList() as KLineData[];
      // we need to fetch
      if (nextData.length - 1 <= nextCandleIndex) {
        // if we did not fetch anything yet
        if (!current) {
          if (!dataList) return;
          return await getNextData(
            dataList[dataList?.length - 1].timestamp,
            timeFrame
          );
        } else {
          return await getNextData(current.timestamp, timeFrame);
        }
      }

      chartRef.current?.updateData(current);
      // calculate profit
      if (position.isOpened) {
        let profit = 0;
        if (position.direction === "LONG") {
          profit = relDiff(
            dataList[dataList?.length - 1].close,
            position.openPrice
          );
        } else {
          profit = relDiff(
            position.openPrice,
            dataList[dataList?.length - 1].close
          );
        }
        setPosition({ profit: profit.toFixed(2) });
      }
      incrementNextCandleIndex();
    },
    isBarReplayPlaying && loading === false ? speed : null
  );

  const getNextData = async (timestamp: number, timeFrame: TimeFrame) => {
    let res = await getRequest({
      url: getUrlParams({
        currentExchange,
        data: {
          symbol: currentSymbol,
          interval: timeFrame.req,
          // startTime: nextData!.length <= 2 ? timestamp : timestamp - 1,
          startTime: adjustFromTo(timeFrame as any, timestamp, 1)[0],
        },
      }),
      setLoading,
      addAlert,
      currentExchange,
    });

    if (res) {
      res = transformData(currentExchange, res);

      if (res?.length) {
        setNextData(res);
        setNextCandleIndex(0);
      } else {
        finishBarReplay();
      }
    } else {
      setIsBarReplayPlaying(false);
    }
  };

  const finishBarReplay = () => {
    setNextData(null);
    setIsBarReplayPlaying(false);
    setIsBarReplayOn(false);
    setNextCandleIndex(0);
    if (position.isOpened) {
      onPositionStatusChange({ status: "CLOSED" });
    }
  };

  const crosshairPosition = useRef<number>();

  useEffect(() => {
    let container: Nullable<HTMLElement> | undefined;
    const onClick = () => {
      const dataList = chartRef?.current?.getDataList() as KLineData[];
      if (
        !crosshairPosition.current ||
        crosshairPosition.current >= dataList[dataList.length - 1].timestamp ||
        crosshairPosition.current <= dataList[0].timestamp
      ) {
        addAlert({
          id: "INVALID_CANDLE" + Math.random(),
          status: "error",
          text: "Invalid Candle",
        });
        setIsSelectingCandle(false);
        return;
      }
      setIsBarReplayPlaying(false);
      setIsBarReplayOn(true);
      getData({ endTime: crosshairPosition.current });
      setNextData([]);
      setIsSelectingCandle(false);
    };
    if (isSelectingCandle) {
      setSettings({ showCrosshair: false });
      container = chartRef.current?.getDom("candle_pane", DomPosition.Main);
      if (!container) return;
      container.addEventListener("click", onClick);
    } else {
      setSettings({ showCrosshair: true });
    }

    return () => {
      container?.removeEventListener("click", onClick);
    };
  }, [isSelectingCandle]);

  const onCrosshairChange = async ({ kLineData }: any) => {
    if (isSelectingCandle && kLineData?.timestamp) {
      crosshairPosition.current = kLineData.timestamp;
    }
  };

  const documentResize = () => {
    chartRef.current?.resize();
  };

  useEffect(() => {
    if (isSelectingCandle) {
      chartRef.current?.subscribeAction(
        ActionType.OnCrosshairChange,
        onCrosshairChange
      );
    } else {
      chartRef.current?.unsubscribeAction(ActionType.OnCrosshairChange);
    }
  }, [isSelectingCandle]);

  const getData = async ({
    exchange = currentExchange,
    symbol = currentSymbol,
    interval = timeFrame.req,
    endTime = null,
    startTime = null,
  }: GetDataProps) => {
    loadMore(exchange, {
      symbol,
      interval,
    });
    const klines = await getRequest({
      url: getUrlParams({
        currentExchange: exchange,
        data: {
          symbol,
          interval,
          endTime,
          startTime,
        },
      }),
      setLoading,
      addAlert,
      currentExchange: exchange,
    });

    if (klines) {
      const newKlines = transformData(exchange, klines);

      // Custom Precision for very low values like 0.00003
      const decimalPlaces =
        +newKlines[0].high > 1
          ? 2
          : newKlines[0].high.toString().split(".")[1].length;

      chartRef.current?.setPriceVolumePrecision(decimalPlaces, decimalPlaces);

      //
      chartRef.current?.applyNewData(
        newKlines,
        getLoadMoreCondition(exchange, klines)
      );
    }
  };

  const loadMore = (exchange: EXCHANGES, data: any) => {
    chartRef.current?.loadMore(async (timestamp) => {
      const klines = await getRequest({
        url: getUrlParams({
          currentExchange: exchange as EXCHANGES,
          data: {
            ...data,
            endTime: (timestamp as number) - 1,
          },
        }),
        setLoading,
        addAlert,
        currentExchange: exchange,
      });

      if (klines) {
        chartRef.current?.applyMoreData(
          transformData(exchange as EXCHANGES, klines),
          getLoadMoreCondition(exchange as EXCHANGES, klines)
        );
      }
    });
  };

  useEffect(() => {
    chartRef.current?.setStyles(
      defaultOptions({
        theme,
        type,
        showGrid,
        reverse,
        priceAxisType,
        showCrosshair,
      }) as any
    );
  }, [theme, type, showGrid, reverse, priceAxisType, showCrosshair]);

  useEffect(() => {
    if (showWatermark) {
      watermark.current?.classList.remove("hidden");
    } else {
      watermark.current?.classList.add("hidden");
    }
  }, [showWatermark]);

  useEffect(() => {
    if (watermark.current) {
      watermark.current.innerHTML = currentExchange + " | " + currentSymbol;
    }
  }, [currentExchange, currentSymbol]);

  useEffect(() => {
    window.addEventListener("resize", documentResize);

    //
    if (chartRef.current) return;
    chartRef.current = init("chart-container", {
      timezone: "UTC",
    });

    chartRef.current?.subscribeAction(ActionType.OnTooltipIconClick, (data) => {
      if (data.indicatorName) {
        switch (data.iconId) {
          case "visible": {
            chartRef.current?.overrideIndicator(
              { name: data.indicatorName, visible: true },
              data.paneId
            );
            break;
          }
          case "invisible": {
            chartRef.current?.overrideIndicator(
              { name: data.indicatorName, visible: false },
              data.paneId
            );
            break;
          }
          case "setting": {
            const indicator = chartRef.current?.getIndicatorByPaneId(
              data.paneId,
              data.indicatorName
            ) as Indicator;
            setIndicatorSettingsModalParams({
              visible: true,
              indicatorName: data.indicatorName,
              paneId: data.paneId,
              calcParams: indicator.calcParams,
            });
            break;
          }
          case "close": {
            if (data.paneId === "candle_pane") {
              const newMainIndicators = [...mainIndicators];
              chartRef.current?.removeIndicator(
                "candle_pane",
                data.indicatorName
              );
              newMainIndicators.splice(
                newMainIndicators.indexOf(data.indicatorName),
                1
              );
              setMainIndicators(newMainIndicators);
            } else {
              const newIndicators = { ...subIndicators };
              chartRef.current?.removeIndicator(
                data.paneId,
                data.indicatorName
              );
              delete newIndicators[data.indicatorName];
              setSubIndicators(newIndicators);
            }
          }
        }
      }
    });

    chartRef.current?.setStyles(
      defaultOptions({
        theme,
        type,
        showGrid,
        reverse,
        priceAxisType,
        showCrosshair,
      }) as any
    );

    getData({});

    //watermark
    const container = chartRef.current?.getDom("candle_pane", DomPosition.Main);
    if (container) {
      watermark.current = document.createElement("div");
      watermark.current.className = "watermark";

      watermark.current.innerHTML = currentExchange + " | " + currentSymbol;

      container.appendChild(watermark.current);
    }

    return () => {
      dispose("chart-container");
      window.removeEventListener("resize", documentResize);
    };
  }, []);

  const onTimeFrameChange = async (t: TimeFrame) => {
    if (t.text === timeFrame.text) return;
    const dataList = chartRef.current?.getDataList();

    getData({
      interval: t.req,
      endTime:
        isBarReplayOn && dataList
          ? dataList[dataList.length - 1].timestamp
          : null,
    });
    setNextData([]);
    setTimeFrame(t);
  };

  const onSymbolChange = async (s: string) => {
    setCurrentSymbol(s);
    finishBarReplay();
    getData({
      symbol: s,
      interval: Exchanges[currentExchange].defaultTimeFrame.req,
    });
  };

  const { addAlert } = useAlerts((state) => ({ addAlert: state.addAlert }));

  const onPositionStatusChange = ({
    type = "LONG",
    status = "OPENED",
  }: OnPositionChange) => {
    //
    const dataList = chartRef.current?.getDataList();
    if (!dataList) return;
    const lastCandle = chartRef.current?.getDataList()[
      dataList?.length - 1
    ] as KLineData;

    //
    if (type && status === "OPENED") {
      const color = type === "LONG" ? "#66ff05" : "#F87272";

      chartRef.current?.createOverlay(
        {
          name: "simpleTag",
          id: "current_position",
          lock: true,
          extendData: type,
          styles: { line: { color } },
          points: [
            { timestamp: lastCandle?.timestamp, value: lastCandle?.high },
          ],
        },
        "candle_pane"
      );
      setPosition({
        direction: type,
        isOpened: true,
        profit: 0,
        openPrice: lastCandle.close,
      });
      addAlert({
        status: type === "LONG" ? "success" : "error",
        id: `${lastCandle.close}`,
        text: `Order Executed at ${lastCandle.close}`,
      });
    } else if (status === "CLOSED") {
      chartRef.current?.removeOverlay("current_position");
      addAlert({
        status: "info",
        id: `Position-Closed-${Math.random()}`,
        text: `Position Closed With ${position.profit}% Profit.`,
      });
      chartDB.createPosition({
        closePrice: lastCandle.close,
        direction: position.direction,
        openPrice: position.openPrice,
        profit: position.profit,
        exchange: currentExchange,
        symbol: currentSymbol,
      });
      setPosition({ isOpened: false, profit: 0 });
    }
  };

  const onScreenShotClick = () => {
    const url = chartRef.current?.getConvertPictureUrl(
      true,
      "jpeg",
      theme === "dark" ? "#010118" : "#f3f3f3"
    );
    const a = document.createElement("a");
    a.download = currentExchange + " | " + currentSymbol;
    a.href = url as string;
    document.body.appendChild(a);
    a.click();
    a.remove();
  };

  return (
    <>
      <Nav
        onTimeFrameChange={onTimeFrameChange}
        onPositionStatusChange={onPositionStatusChange}
        onFinishBarReplay={() => {
          finishBarReplay();
          getData({});
        }}
        onScreenShotClick={onScreenShotClick}
      />
      <Symbols onSymbolChange={onSymbolChange} />
      <Indicators
        onMainIndicatorChange={(data) => {
          const newMainIndicators = [...mainIndicators];
          if (data.added) {
            createIndicator(data.name, true, { id: "candle_pane" });
            newMainIndicators.push(data.name);
          } else {
            chartRef.current?.removeIndicator("candle_pane", data.name);
            newMainIndicators.splice(newMainIndicators.indexOf(data.name), 1);
          }
          setMainIndicators(newMainIndicators);
        }}
        onSubIndicatorChange={(data) => {
          const newSubIndicators = { ...subIndicators };
          if (data.added) {
            const paneId = createIndicator(data.name);
            if (paneId) {
              newSubIndicators[data.name] = paneId;
            }
          } else {
            if (data.paneId) {
              chartRef.current?.removeIndicator(data.paneId, data.name);
              delete newSubIndicators[data.name];
            }
          }
          setSubIndicators(newSubIndicators);
        }}
      />
      <IndicatorsSettings
        indicatorSettingModalParams={indicatorSettingModalParams}
        onClose={() => {
          setIndicatorSettingsModalParams({
            visible: false,
            indicatorName: "",
            paneId: "",
            calcParams: [],
          });
        }}
        onConfirm={(params) => {
          const { indicatorName, paneId } = indicatorSettingModalParams;
          chartRef.current?.overrideIndicator(
            { name: indicatorName, calcParams: params },
            paneId
          );
        }}
      />
      <Settings />
      <div className="flex">
        <Drawings
          onDrawingItemClick={(overlay: any) => {
            chartRef.current?.createOverlay(overlay);
          }}
          onModeChange={(mode: OverlayMode) => {
            chartRef.current?.overrideOverlay({ mode });
          }}
          onLockChange={(lock: boolean) => {
            chartRef.current?.overrideOverlay({ lock });
          }}
          onVisibleChange={(visible: boolean) => {
            chartRef.current?.overrideOverlay({ visible });
          }}
          onRemoveClick={(groupId: string) => {
            chartRef.current?.removeOverlay({ groupId });
          }}
        />
        <Loading isLoading={loading} />
        <Alerts />
        <div
          id="chart-container"
          data-theme={theme}
          className={`ml-auto ${isSelectingCandle ? "isSelectingCandle" : ""} `}
        />
      </div>
    </>
  );
};
