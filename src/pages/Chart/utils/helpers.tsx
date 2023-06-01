import { Exchanges } from "./Constants";
import { ChartType, EXCHANGES, MyAlert, TimeFrame } from "./types";

export const getSymbols = async (
  exchange: EXCHANGES,
  setLoading: (loading: boolean) => void,
  addAlert: (alert: MyAlert) => void
) => {
  const res = await getRequest({
    url: Exchanges[exchange].symbolUrl,
    setLoading,
    addAlert,
    currentExchange: exchange,
  });
  if (!res) return false;
  if (isBinance(exchange)) {
    if (res.symbols) {
      return res.symbols;
    }
    return false;
  } else if (isByBit(exchange)) {
    return res.result.list;
  } else {
    throw Error("Invalid Exchange at getSymbols()");
  }
};

export const getUrlParams = ({
  currentExchange,
  data,
}: {
  currentExchange: EXCHANGES;
  data: any;
}) => {
  let url = Exchanges[currentExchange].baseUrl;

  if (isBinance(currentExchange)) {
    if (data.symbol) url += `?symbol=${data.symbol}`;
    if (data.interval) url += `&interval=${data.interval}`;
    if (data.endTime) url += `&endTime=${data.endTime}`;
    if (data.startTime) url += `&startTime=${data.startTime}`;
    url += `&limit=${Exchanges[currentExchange].limit}${Exchanges[currentExchange].extraQuery}`;
    return url;
  } else if (isByBit(currentExchange)) {
    if (data.symbol) url += `&symbol=${data.symbol}`;
    if (data.interval) url += `&interval=${data.interval}`;
    if (data.endTime) url += `&end=${data.endTime}`;
    if (data.startTime) url += `&start=${data.startTime}`;
    url += `&limit=${Exchanges[currentExchange].limit}${Exchanges[currentExchange].extraQuery}`;
    return url;
  } else {
    throw Error("Invalid Exchange at getUrlParams()");
  }
};

export const transformData = (exchange: EXCHANGES, klines: any) => {
  if (isBinance(exchange)) {
    return klines.map((kline: any) => ({
      timestamp: kline[0],
      open: +kline[1],
      high: +kline[2],
      low: +kline[3],
      close: +kline[4],
      volume: +kline[5],
    }));
  } else if (isByBit(exchange)) {
    return klines?.result.list
      ?.map((kline: any) => ({
        timestamp: +kline[0],
        open: +kline[1],
        high: +kline[2],
        low: +kline[3],
        close: +kline[4],
        volume: +kline[5],
      }))
      .reverse();
  } else {
    throw Error("Invalid Exchange at transformData()");
  }
};

export const getRequest = async ({
  url,
  setLoading,
  addAlert,
  currentExchange,
}: {
  url: string;
  setLoading: (loading: boolean) => void;
  addAlert: (alert: MyAlert) => void;
  currentExchange: EXCHANGES;
}) => {
  try {
    setLoading(true);
    //@ts-ignore
    const res = await window.http.get(url);
    console.log(res, url);
    setLoading(false);
    if (isBinance(currentExchange) && res?.msg) {
      addAlert({
        id: "FETCH_ERROR" + Math.random(),
        text: res?.msg || "Network Error",
        status: "error",
      });
      return false;
    } else if (isByBit(currentExchange) && res?.retMsg !== "OK") {
      addAlert({
        id: "FETCH_ERROR" + Math.random(),
        text: res?.retMsg || "Network Error",
        status: "error",
      });
      return false;
    }
    return res;
  } catch (err) {
    console.log(err);
    setLoading(false);
    addAlert({
      id: "FETCH_ERROR" + Math.random(),
      text: "Fetch Error. Check Your Internet Connection",
      status: "error",
    });
    return false;
  }
};

export const getLoadMoreCondition = (exchange: EXCHANGES, data: any) => {
  if (isBinance(exchange)) {
    return data.length > 0;
  } else if (isByBit(exchange)) {
    return data?.result?.list?.length > 0;
  } else {
    throw Error("Invalid Exchange at getLoadMoreCondition()");
  }
};

export const getCandleTypeIcon = (type: ChartType) => {
  switch (type) {
    case "candle_solid":
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 28 28"
          width="23"
          height="23"
          fill="currentColor"
        >
          <path d="M17 11v6h3v-6h-3zm-.5-1h4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-.5.5h-4a.5.5 0 0 1-.5-.5v-7a.5.5 0 0 1 .5-.5z"></path>
          <path d="M18 7h1v3.5h-1zm0 10.5h1V21h-1z"></path>
          <path d="M9 8v12h3V8H9zm-.5-1h4a.5.5 0 0 1 .5.5v13a.5.5 0 0 1-.5.5h-4a.5.5 0 0 1-.5-.5v-13a.5.5 0 0 1 .5-.5z"></path>
          <path d="M10 4h1v3.5h-1zm0 16.5h1V24h-1z"></path>
        </svg>
      );
    case "area":
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 28 28"
          width="23"
          height="23"
          fill="currentColor"
        >
          <path d="M12.5 17.207L18.707 11h2l3.647-3.646-.708-.708L20.293 10h-2L12.5 15.793l-3-3-4.854 4.853.708.708L9.5 14.207z"></path>
          <path d="M9 16h1v1H9zm1 1h1v1h-1zm-1 1h1v1H9zm2 0h1v1h-1zm-1 1h1v1h-1zm-1 1h1v1H9zm2 0h1v1h-1zm-3-3h1v1H8zm-1 1h1v1H7zm-1 1h1v1H6zm2 0h1v1H8zm-1 1h1v1H7zm-2 0h1v1H5zm17-9h1v1h-1zm1-1h1v1h-1zm0 2h1v1h-1zm-1 1h1v1h-1zm-1 1h1v1h-1zm2 0h1v1h-1zm-1 1h1v1h-1zm-1 1h1v1h-1zm2 0h1v1h-1zm-1 1h1v1h-1zm-1 1h1v1h-1zm2 0h1v1h-1zm-1 1h1v1h-1zm-1 1h1v1h-1zm2 0h1v1h-1zm-5-7h1v1h-1zm2 0h1v1h-1zm1-1h1v1h-1zm-2 2h1v1h-1zm-1 1h1v1h-1zm2 0h1v1h-1zm-1 1h1v1h-1zm-1 1h1v1h-1zm2 0h1v1h-1zm-1 1h1v1h-1zm-1 1h1v1h-1zm2 0h1v1h-1zm-1 1h1v1h-1zm-2-6h1v1h-1zm-1 1h1v1h-1zm-1 1h1v1h-1zm2 0h1v1h-1zm-1 1h1v1h-1zm-1 1h1v1h-1zm2 0h1v1h-1zm-1 1h1v1h-1zm-1 1h1v1h-1zm2 0h1v1h-1zm-3-3h1v1h-1zm-1 1h1v1h-1zm-1 1h1v1h-1zm2 0h1v1h-1zm-1 1h1v1h-1z"></path>
        </svg>
      );
    default:
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 28 28"
          width="23"
          height="23"
        >
          <g fill="none" stroke="currentColor" strokeLinecap="square">
            <path d="M10.5 7.5v15M7.5 20.5H10M13.5 11.5H11M19.5 6.5v15M16.5 9.5H19M22.5 16.5H20"></path>
          </g>
        </svg>
      );
  }
};

export const relDiff = (a: number, b: number) => {
  return (100 * (a - b)) / b;
};

export const isBinance = (exchange: EXCHANGES) => {
  return [
    EXCHANGES.BinancePerpetual,
    EXCHANGES.BinanceSpot,
    EXCHANGES.BinancePerpetualCoin,
  ].includes(exchange);
};

export const isByBit = (exchange: EXCHANGES) => {
  return [
    EXCHANGES.ByBitSpot,
    EXCHANGES.ByBitInverse,
    EXCHANGES.ByBitPerpetual,
  ].includes(exchange);
};

export const adjustFromTo = (
  timeFrame: Required<TimeFrame>,
  timestamp: number,
  count: number
) => {
  let to = timestamp;
  let from = to;
  switch (timeFrame.timespan) {
    case "m": {
      to = to - (to % (60 * 1000));
      from = to - count * timeFrame.multiplier * 60 * 1000;
      break;
    }
    case "h": {
      to = to - (to % (60 * 60 * 1000));
      from = to - count * timeFrame.multiplier * 60 * 60 * 1000;
      break;
    }
    case "d": {
      to = to - (to % (60 * 60 * 1000));
      from = to - count * timeFrame.multiplier * 24 * 60 * 60 * 1000;
      break;
    }
    case "w": {
      const date = new Date(to);
      const week = date.getDay();
      const dif = week === 0 ? 6 : week - 1;
      to = to - dif * 60 * 60 * 24;
      const newDate = new Date(to);
      to = new Date(
        `${newDate.getFullYear()}-${
          newDate.getMonth() + 1
        }-${newDate.getDate()}`
      ).getTime();
      from = count * timeFrame.multiplier * 7 * 24 * 60 * 60 * 1000;
      break;
    }
    case "M": {
      const date = new Date(to);
      const year = date.getFullYear();
      const month = date.getMonth() + 1;
      to = new Date(`${year}-${month}-01`).getTime();
      from = count * timeFrame.multiplier * 30 * 24 * 60 * 60 * 1000;
      const fromDate = new Date(from);
      from = new Date(
        `${fromDate.getFullYear()}-${fromDate.getMonth() + 1}-01`
      ).getTime();
      break;
    }
    case "year": {
      const date = new Date(to);
      const year = date.getFullYear();
      to = new Date(`${year}-01-01`).getTime();
      from = count * timeFrame.multiplier * 365 * 24 * 60 * 60 * 1000;
      const fromDate = new Date(from);
      from = new Date(`${fromDate.getFullYear()}-01-01`).getTime();
      break;
    }
  }
  return [from, to];
};
