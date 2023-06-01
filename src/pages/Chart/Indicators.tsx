import { Button, Checkbox, Menu, Modal } from "react-daisyui";
import { useIndicatorStore } from "./store";
import { shallow } from "zustand/shallow";
import { IndicatorType } from "./types";
import indicatorNames from "./utils/indicatorNames";

export const Indicators = ({
  onMainIndicatorChange,
  onSubIndicatorChange,
}: IndicatorType) => {
  const { isModalOpen, setIsModalOpen, mainIndicators, subIndicators } =
    useIndicatorStore(
      (state) => ({
        isModalOpen: state.isModalOpen,
        setIsModalOpen: state.setIsModalOpen,
        mainIndicators: state.mainIndicators,
        subIndicators: state.subIndicators,
      }),
      shallow
    );
  return (
    <Modal
      open={isModalOpen}
      onClickBackdrop={() => setIsModalOpen(false)}
      className="w-8/12 max-w-5xl"
    >
      <Button
        size="sm"
        shape="circle"
        className="absolute right-2 top-2"
        onClick={() => setIsModalOpen(false)}
      >
        ✕
      </Button>
      <Modal.Header>Indicators</Modal.Header>
      <Modal.Body>
        <Menu className="rounded-box bg-base-200 flex flex-row overflow-hidden">
          <Menu.Title className="w-full">
            <span>Main Indicators</span>
          </Menu.Title>
          {["MA", "EMA", "SMA", "BOLL", "SAR", "BBI"].map((name) => {
            const checked = mainIndicators.includes(name);
            return (
              <Menu.Item
                key={name}
                className="w-1/4 tooltip tooltip-primary tooltip-bottom"
                //@ts-ignore
                data-tip={indicatorNames[name.toLowerCase()]}
              >
                <a
                  className="justify-between rounded-none"
                  onClick={() => {
                    onMainIndicatorChange({ added: !checked, name });
                  }}
                >
                  {name}
                  <Checkbox
                    color={"primary"}
                    checked={checked}
                    onChange={() => {}}
                  />
                </a>
              </Menu.Item>
            );
          })}
          <Menu.Title className="w-full">
            <span>Sub Indicators</span>
          </Menu.Title>
          {[
            "MA",
            "EMA",
            "VOL",
            "MACD",
            "BOLL",
            "KDJ",
            "RSI",
            "BIAS",
            "BRAR",
            "CCI",
            "DMI",
            "CR",
            "PSY",
            "DMA",
            "TRIX",
            "OBV",
            "VR",
            "WR",
            "MTM",
            "SAR",
            "SMA",
            "ROC",
            "PVT",
            "BBI",
            "AO",
          ].map((name) => {
            const checked = name in subIndicators;
            return (
              <Menu.Item
                key={name}
                className="w-1/4 tooltip tooltip-primary"
                //@ts-ignore
                data-tip={indicatorNames[name.toLowerCase()]}
              >
                <a
                  className="justify-between rounded-none "
                  onClick={() => {
                    onSubIndicatorChange({
                      added: !checked,
                      name,
                      paneId: subIndicators[name] ?? "",
                    });
                  }}
                >
                  {name}
                  <Checkbox
                    color={"primary"}
                    checked={checked}
                    onChange={() => {}}
                  />
                </a>
              </Menu.Item>
            );
          })}
        </Menu>
      </Modal.Body>
    </Modal>
  );
};
