import { useEffect, useState } from "react";
import { Badge, Button, Divider, Swap, Table } from "react-daisyui";
import { Link } from "react-router-dom";
import { chartDB } from "../Chart/utils/db";
import { PositionModel } from "../Chart/utils";
import { useThemeStore } from "@/utils";

export const HomePage = () => {
  const [positions, setPosition] = useState<PositionModel[]>([]);
  const get = async () => {
    const pos = await chartDB.getPositions();
    setPosition(pos);
  };
  useEffect(() => {
    get();
  }, []);
  //theme
  const { theme, setTheme } = useThemeStore((state) => ({
    theme: state.theme,
    setTheme: state.setTheme,
  }));

  return (
    <div className="px-6">
      <div className="flex justify-center items-center my-10 relative">
        <Button
          shape="circle"
          size="sm"
          title={"Theme"}
          className="absolute top-0 right-6"
        >
          <Swap
            rotate
            onChange={() => setTheme(theme === "dark" ? "light" : "dark")}
            active={theme === "light"}
            onElement={
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                className="fill-yellow-400"
              >
                <path d="M5.64,17l-.71.71a1,1,0,0,0,0,1.41,1,1,0,0,0,1.41,0l.71-.71A1,1,0,0,0,5.64,17ZM5,12a1,1,0,0,0-1-1H3a1,1,0,0,0,0,2H4A1,1,0,0,0,5,12Zm7-7a1,1,0,0,0,1-1V3a1,1,0,0,0-2,0V4A1,1,0,0,0,12,5ZM5.64,7.05a1,1,0,0,0,.7.29,1,1,0,0,0,.71-.29,1,1,0,0,0,0-1.41l-.71-.71A1,1,0,0,0,4.93,6.34Zm12,.29a1,1,0,0,0,.7-.29l.71-.71a1,1,0,1,0-1.41-1.41L17,5.64a1,1,0,0,0,0,1.41A1,1,0,0,0,17.66,7.34ZM21,11H20a1,1,0,0,0,0,2h1a1,1,0,0,0,0-2Zm-9,8a1,1,0,0,0-1,1v1a1,1,0,0,0,2,0V20A1,1,0,0,0,12,19ZM18.36,17A1,1,0,0,0,17,18.36l.71.71a1,1,0,0,0,1.41,0,1,1,0,0,0,0-1.41ZM12,6.5A5.5,5.5,0,1,0,17.5,12,5.51,5.51,0,0,0,12,6.5Zm0,9A3.5,3.5,0,1,1,15.5,12,3.5,3.5,0,0,1,12,15.5Z" />
              </svg>
            }
            offElement={
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                className="fill-slate-200"
              >
                <path d="M21.64,13a1,1,0,0,0-1.05-.14,8.05,8.05,0,0,1-3.37.73A8.15,8.15,0,0,1,9.08,5.49a8.59,8.59,0,0,1,.25-2A1,1,0,0,0,8,2.36,10.14,10.14,0,1,0,22,14.05,1,1,0,0,0,21.64,13Zm-9.5,6.69A8.14,8.14,0,0,1,7.08,5.22v.27A10.15,10.15,0,0,0,17.22,15.63a9.79,9.79,0,0,0,2.1-.22A8.11,8.11,0,0,1,12.14,19.73Z" />
              </svg>
            }
          />
        </Button>
        <Link
          to="/chart"
          className="inline-flex text-lg text-primary-content rounded-3xl bg-primary font-semibold py-4 px-8 transition-all shadow-[0_10px_rgba(0,0,0,0.2)] hover:shadow-[0_10px_rgba(0,0,0,0.3)] active:shadow-[0_3px_rgba(0,0,0,0.3)] active:translate-y-[7px]"
        >
          Go to chart
        </Link>
      </div>
      <div className=" max-w-4xl mx-auto">
        <h3 className="text-warning">Before You start:</h3>
        <ul className="list-disc pl-5">
          <li>Right Click on Drawings to remove them.</li>
          <li>
            Binance Servers Do not respond if your connection is from a
            restricted location, such as the United States (Some states),
            Malaysia, Ontario (Canada), Cuba, Iran, Syria, North Korea, Crimea,
            European Union and other locations as designated by Binance
            Operators from time to time as a Restricted Location.
          </li>
        </ul>
      </div>
      <Divider />
      <div className="max-w-4xl mx-auto flex items-center flex-col gap-2 overflow-x-auto">
        <div className="flex items-center w-full justify-between">
          <Badge color="primary">Trade History </Badge>
          {!!positions?.length && (
            <Button
              color="error"
              size="xs"
              className="rounded-xl"
              onClick={async () => {
                await chartDB.clearPositions();
                get();
              }}
            >
              Clear History ✕
            </Button>
          )}
        </div>
        <Table zebra className="w-full">
          <Table.Head>
            <span />
            <span>Symbol</span>
            <span>Exchange</span>
            <span>Open Price</span>
            <span>Close Price</span>
            <span>Direction</span>
            <span>Profit</span>
          </Table.Head>
          <Table.Body>
            {positions.map((pos, i) => {
              return (
                <Table.Row key={pos.id}>
                  <span>{i + 1}</span>
                  <span>{pos.symbol}</span>
                  <span>{pos.exchange}</span>
                  <span>{pos.openPrice}</span>
                  <span>{pos.closePrice}</span>
                  <span
                    className={`${
                      pos.direction === "SHORT"
                        ? "text-red-500"
                        : "text-green-500"
                    }`}
                  >
                    {pos.direction}
                  </span>
                  <span>
                    {+pos.profit > 0 ? (
                      <Badge color="success">{pos.profit}%</Badge>
                    ) : (
                      <Badge color="error">{pos.profit}%</Badge>
                    )}
                  </span>
                </Table.Row>
              );
            })}
          </Table.Body>
        </Table>
      </div>
    </div>
  );
};
