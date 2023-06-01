import { OverlayMode } from "klinecharts";
import { EXCHANGES, IndicatorSettingsModalParams } from "./utils";

export type DrawingType = {
  onDrawingItemClick: (overlay: any) => void;
  onModeChange: (mode: OverlayMode) => void;
  onLockChange: (lock: boolean) => void;
  onVisibleChange: (visible: boolean) => void;
  onRemoveClick: (groupId: string) => void;
};

export type IndicatorType = {
  onMainIndicatorChange: (data: { name: string; added: boolean }) => void;
  onSubIndicatorChange: (data: {
    name: string;
    added: boolean;
    paneId: string;
  }) => void;
};

export type IndicatorSettingsType = {
  onConfirm: (data: any[]) => void;
  indicatorSettingModalParams: IndicatorSettingsModalParams;
  onClose: () => void;
};

export type GetDataProps = {
  symbol?: string;
  interval?: string;
  endTime?: number | null;
  startTime?: number | null;
  exchange?: EXCHANGES;
};
