import { Button, Input, Modal } from "react-daisyui";
import { IndicatorSettingsType } from "./types";
import { useIndicatorStore } from "./store";
import indicators from "./utils/indicators";
import { Fragment, useEffect, useState } from "react";
import { utils } from "klinecharts";

export const IndicatorsSettings = ({
  onClose,
  onConfirm,
  indicatorSettingModalParams,
}: IndicatorSettingsType) => {
  const getConfig: (name: string) => any[] = (name: string) => {
    //@ts-ignore
    return indicators[name] || [];
  };

  const [calcParams, setCalcParams] = useState<number[]>();
  useEffect(() => {
    setCalcParams(utils.clone(indicatorSettingModalParams.calcParams));
  }, []);

  return (
    <Modal open={indicatorSettingModalParams.visible}>
      <Button
        size="sm"
        shape="circle"
        className="absolute right-2 top-2"
        onClick={() => onClose()}
      >
        ✕
      </Button>
      <Modal.Header>
        <span className="text-red-400">
          {indicatorSettingModalParams.indicatorName}
        </span>{" "}
        Settings
      </Modal.Header>
      <Modal.Body>
        <div className="form-control w-full max-w-xs mx-auto ">
          {getConfig(indicatorSettingModalParams.indicatorName).map((d, i) => {
            return (
              <div key={i} className="flex flex-col justify-center">
                <label className="label text-info">{d.paramNameKey}</label>
                <Input
                  defaultValue={indicatorSettingModalParams.calcParams[i]}
                  size="sm"
                  // precision={d.precision}
                  type={"number"}
                  min={d.min}
                  onChange={(e) => {
                    const params = utils.clone(
                      indicatorSettingModalParams.calcParams
                    );
                    params[i] = e.target.value;
                    setCalcParams(params);
                  }}
                />
              </div>
            );
          })}
        </div>
        <Modal.Actions>
          <Button
            color="success"
            className="px-8"
            onClick={() => {
              const config = getConfig(
                indicatorSettingModalParams.indicatorName
              );
              const params: any[] = [];
              utils.clone(calcParams).forEach((param: any, i: number) => {
                if (!utils.isValid(param) || param === "") {
                  if ("default" in config[i]) {
                    params.push(config[i]["default"]);
                  }
                } else {
                  params.push(param);
                }
              });
              onConfirm(params);
              onClose();
            }}
          >
            Ok
          </Button>
        </Modal.Actions>
      </Modal.Body>
    </Modal>
  );
};
