import { Button, Dropdown, Modal, Menu, Input, Alert } from "react-daisyui";
import { useAlerts, useChartActionsStore, useChartStore } from "./store";
import { shallow } from "zustand/shallow";
import { useEffect, useState } from "react";
import { EXCHANGES, Exchanges, getSymbols } from "./utils";

export const Symbols = ({
  onSymbolChange,
}: {
  onSymbolChange: (s: string) => void;
}) => {
  const { isSymbolModalOpen, symbols, currentExchange, currentSymbol } =
    useChartStore(
      (state) => ({
        isSymbolModalOpen: state.isSymbolModalOpen,
        symbols: state.symbols,
        currentExchange: state.currentExchange,
        currentSymbol: state.currentSymbol,
      }),
      shallow
    );

  const { addAlert } = useAlerts((state) => ({ addAlert: state.addAlert }));
  const {
    setIsSymbolModalOpen,
    setCurrentExchange,
    setSymbols,
    setTimeFrame,
    setLoading,
  } = useChartActionsStore();

  const [filter, setFilter] = useState("");
  const ShowSymbols = () => {
    // it seems modal component render's the component even when modal state is closed
    if (!isSymbolModalOpen) return null;
    return (
      <div className="max-h-[40vh] overflow-y-auto">
        <Menu className="overflow-hidden font-semibold">
          {symbols
            ?.filter(
              (s) =>
                filter === "" || s.symbol.toLowerCase().indexOf(filter) > -1
            )
            .map((s) => (
              <Menu.Item key={s.symbol}>
                <Button
                  onClick={() => {
                    onSymbolChange(s.symbol);
                    setIsSymbolModalOpen(false);
                  }}
                  className="text-xs rounded-none text-primary-content"
                  color="primary"
                >
                  {s.symbol}
                </Button>
              </Menu.Item>
            ))}
        </Menu>
      </div>
    );
  };

  return (
    <Modal open={isSymbolModalOpen} className="w-8/12 max-w-5xl min-h-[70vh]">
      <Button
        size="sm"
        shape="circle"
        className="absolute right-2 top-2"
        onClick={() => setIsSymbolModalOpen(false)}
      >
        ✕
      </Button>
      <Modal.Header className="font-semibold">
        <span className="inline-flex mr-4">1- Select your API:</span>
        <Dropdown>
          <Dropdown.Toggle>
            <span className="normal-case">{currentExchange}</span>
          </Dropdown.Toggle>
          <Dropdown.Menu className="drop-shadow">
            {Object.keys(EXCHANGES).map((key) => {
              return (
                <Dropdown.Item
                  onClick={async () => {
                    const s = await getSymbols(
                      key as EXCHANGES,
                      setLoading,
                      addAlert
                    );
                    if (!s) {
                      setSymbols([]);
                      return;
                    }
                    setTimeFrame(Exchanges[key as EXCHANGES].defaultTimeFrame);
                    setCurrentExchange(key as EXCHANGES);

                    setSymbols(s);
                  }}
                  title={Exchanges[key as EXCHANGES].desc}
                  key={key}
                >
                  {key}
                </Dropdown.Item>
              );
            })}
          </Dropdown.Menu>
        </Dropdown>
      </Modal.Header>

      <Modal.Body>
        <div className="mt-4 mb-2">
          {!!symbols?.length && (
            <Alert
              status="info"
              className="text-sm p-2 font-semibold rounded-md mb-2"
            >{`Search among ${symbols.length} symbols.`}</Alert>
          )}

          <Input
            className=" w-full"
            placeholder={"2- Type a Symbol: BTCUSDT"}
            onChange={(e) => setFilter(e.target.value || "")}
          />
        </div>
        <ShowSymbols />
      </Modal.Body>
      {/* 
      <Modal.Actions>
        <Button onClick={() => setIsSymbolModalOpen(false)}>Close</Button>
      </Modal.Actions> */}
    </Modal>
  );
};
