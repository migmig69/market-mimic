import {
  Badge,
  Button,
  ButtonGroup,
  Divider,
  Dropdown,
  Input,
  Navbar,
  Select,
  Swap,
} from "react-daisyui";
import {
  EXCHANGES,
  Exchanges,
  Speeds,
  TimeFrame,
  getCandleTypeIcon,
} from "./utils";
import {
  useAlerts,
  useChartActionsStore,
  useChartStore,
  useIndicatorStore,
  usePositionStore,
  useSettingsStore,
} from "./store";
import { shallow } from "zustand/shallow";
import { OnPositionChange } from "./utils/types";
import { Link } from "react-router-dom";
export const Nav = ({
  onTimeFrameChange,
  onPositionStatusChange,
  onFinishBarReplay,
  onScreenShotClick,
}: {
  onTimeFrameChange: (t: TimeFrame) => void;
  onPositionStatusChange: (o: OnPositionChange) => void;
  onFinishBarReplay: () => void;
  onScreenShotClick: () => void;
}) => {
  const { addAlert } = useAlerts((state) => ({ addAlert: state.addAlert }));

  //chart store
  const {
    timeFrame,
    isBarReplayPlaying,
    isBarReplayOn,
    isSelectingCandle,
    speed,
    currentSymbol,
    currentExchange,
  } = useChartStore(
    (state) => ({
      timeFrame: state.timeFrame,
      isBarReplayPlaying: state.isBarReplayPlaying,
      isBarReplayOn: state.isBarReplayOn,
      isSelectingCandle: state.isSelectingCandle,
      speed: state.speed,
      currentSymbol: state.currentSymbol,
      currentExchange: state.currentExchange,
    }),
    shallow
  );

  const {
    setSettings,
    settings,
    setIsModalOpen: setIsSettingsModalOpen,
  } = useSettingsStore((state) => ({
    settings: state.settings,
    setSettings: state.setSettings,
    setIsModalOpen: state.setIsModalOpen,
  }));

  const {
    setIsSelectingCandle,
    setIsBarReplayPlaying,
    setSpeed,
    setIsSymbolModalOpen,
  } = useChartActionsStore();

  const { position } = usePositionStore((state) => ({
    position: state.position,
  }));

  //indicator
  const setIsModalOpen = useIndicatorStore((state) => state.setIsModalOpen);

  return (
    <div className="flex w-full items-center justify-center h-[50px] px-1">
      <Navbar className="gap-2">
        <Link
          to="/"
          className="mr-4 transition-all hover:opacity-60"
          title="Go to Home"
          onClick={() => {
            onFinishBarReplay();
          }}
        >
          <svg
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 512 512"
          >
            <path
              fill="currentColor"
              d="M512 304l-96-96v-144h-64v80l-96-96-256 256v16h64v160h160v-96h64v96h160v-160h64z"
            ></path>
          </svg>
        </Link>
        <div className="w-48">
          <Input
            onFocus={() => setIsSymbolModalOpen(true)}
            size={"sm"}
            bordered
            type="text"
            disabled={isBarReplayPlaying}
            placeholder={currentSymbol}
          />
        </div>
        <div className="flex items-center gap-2">
          <div>
            <Dropdown>
              <Dropdown.Toggle
                size="xs"
                color="info"
                disabled={isBarReplayPlaying}
              >
                <span className="normal-case">{timeFrame.text}</span>
              </Dropdown.Toggle>
              <Dropdown.Menu className="max-h-[90vh] overflow-y-auto flex-row justify-center">
                {Exchanges[currentExchange].timeFrames.map((t: TimeFrame) => (
                  <Dropdown.Item
                    onClick={() => {
                      onTimeFrameChange(t);
                    }}
                    key={t.text}
                  >
                    {t.text}
                  </Dropdown.Item>
                ))}
              </Dropdown.Menu>
            </Dropdown>
          </div>
          <div className="flex items-center">
            <Dropdown>
              <Dropdown.Toggle
                size="xs"
                color="info"
                className="flex items-center"
                disabled={isBarReplayPlaying}
              >
                {getCandleTypeIcon(settings.type)}
              </Dropdown.Toggle>
              <Dropdown.Menu className=" max-h-[90vh] overflow-y-auto flex-row justify-center">
                <Dropdown.Item
                  key={"candle_solid"}
                  onClick={() => {
                    setSettings({ type: "candle_solid" });
                  }}
                >
                  {getCandleTypeIcon("candle_solid")}
                </Dropdown.Item>
                <Dropdown.Item
                  key={"area"}
                  onClick={() => {
                    setSettings({ type: "area" });
                  }}
                >
                  {getCandleTypeIcon("area")}
                </Dropdown.Item>
                <Dropdown.Item
                  key={"ohlc"}
                  onClick={() => {
                    setSettings({ type: "ohlc" });
                  }}
                >
                  {getCandleTypeIcon("ohlc")}
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </div>
          {/* indicator */}
          <Button
            size="xs"
            onClick={() => setIsModalOpen(true)}
            color="info"
            disabled={isBarReplayPlaying}
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M15.873,20L3.65079,20C1.5873,20,0,18.3871,0,16.2903L0,3.70968C-3.78442e-7,1.6129,1.5873,0,3.65079,0L15.873,0C17.9365,0,19.5238,1.6129,19.5238,3.70968C19.5238,4.35484,19.2063,4.51613,18.5714,4.51613C17.9365,4.51613,17.619,4.19355,17.619,3.70968C17.619,2.74194,16.8254,1.93548,15.873,1.93548L3.65079,1.93548C2.69841,1.93548,1.90476,2.74194,1.90476,3.70968L1.90476,16.2903C1.90476,17.2581,2.69841,18.0645,3.65079,18.0645L15.873,18.0645C16.8254,18.0645,17.619,17.2581,17.619,16.2903C17.619,15.8065,18.0952,15.3226,18.5714,15.3226C19.0476,15.3226,19.5238,15.8065,19.5238,16.2903C19.5238,18.2258,17.9365,20,15.873,20ZM14.9206,12.9032C14.7619,12.9032,14.4444,12.9032,14.2857,12.7419L11.2698,9.35484C10.9524,9.03226,10.9524,8.54839,11.2698,8.22581C11.5873,7.90323,12.0635,7.90323,12.381,8.22581L15.3968,11.6129C15.7143,11.9355,15.7143,12.4194,15.3968,12.7419C15.3968,12.9032,15.2381,12.9032,14.9206,12.9032ZM11.4286,13.2258C11.2698,13.2258,11.1111,13.2258,10.9524,13.0645C10.6349,12.7419,10.6349,12.4194,10.9524,12.0968L15.0794,7.74193C15.3968,7.41935,15.7143,7.41935,16.0317,7.74193C16.3492,8.06452,16.3492,8.3871,16.0317,8.70968L11.9048,13.0645C11.746,13.2258,11.5873,13.2258,11.4286,13.2258ZM10.3175,3.70968C10.6349,3.70968,11.4286,3.87097,11.4286,4.67742C11.4286,5.32258,10.4762,5.16129,10.1587,5.16129C8.73016,5.16129,8.25397,5.96774,8.09524,6.6129L7.77778,8.54839L9.36508,8.54839C9.68254,8.54839,10,8.87097,10,9.19355C10,9.51613,9.68254,9.83871,9.36508,9.83871L7.61905,9.83871L6.50794,14.8387Q6.34921,16.2903,5.39683,16.2903Q4.44444,16.2903,4.92064,14.8387L6.03175,10L4.60317,10C4.28571,10,3.96825,9.67742,3.96825,9.35484C3.96825,8.70968,4.28571,8.54839,4.60317,8.54839L6.34921,8.54839L6.8254,6.45161C7.14286,3.70968,9.52381,3.54839,10.3175,3.70968ZM18.4127,6.6129C18.5714,6.12903,18.8889,5.96774,19.3651,5.96774C19.8413,6.12903,20,6.45161,20,6.93548L18.4127,13.3871C18.254,13.871,17.9365,14.0323,17.4603,14.0323C16.9841,13.871,16.8254,13.5484,16.8254,13.0645L18.4127,6.6129Z" />
            </svg>
          </Button>
        </div>
        <Divider vertical>|</Divider>

        {isBarReplayOn && !isSelectingCandle ? (
          <>
            <Button
              className="normal-case"
              color="error"
              size="xs"
              disabled={isBarReplayPlaying}
              onClick={() => {
                onFinishBarReplay();
              }}
            >
              ✕ Stop BarReplay
            </Button>
            <Button
              className="normal-case"
              color="success"
              size="xs"
              disabled={isBarReplayPlaying}
              onClick={() => {
                setIsSelectingCandle(true);
              }}
            >
              {"<< "} New BarReplay
            </Button>
          </>
        ) : (
          <Button
            color="accent"
            size="xs"
            disabled={isBarReplayPlaying}
            onClick={() => {
              if (isSelectingCandle === false) {
                addAlert({
                  id: "SELECT_CANDLE" + Math.random(),
                  status: "info",
                  text: "Select A Candle To Start BarReplay",
                });
              }
              setIsSelectingCandle(!isSelectingCandle);
            }}
            className="normal-case"
          >
            {isSelectingCandle ? (
              "Select a Candle"
            ) : (
              <>
                {"<< "}
                {isBarReplayOn ? "Start Again" : "Start BarReplay"}
              </>
            )}
          </Button>
        )}
        <Divider vertical>|</Divider>
        {isBarReplayOn && !isSelectingCandle ? (
          <>
            <div className="flex gap-2">
              <Button
                size="sm"
                onClick={() => setIsBarReplayPlaying(!isBarReplayPlaying)}
                title={"Play/Pause BarReplay"}
              >
                {isBarReplayPlaying ? "∣∣" : "▷"}
              </Button>
              <Select
                disabled={isBarReplayPlaying}
                value={speed}
                onChange={(e) => setSpeed(+e.target.value)}
                size={"sm"}
                title={"Speed"}
              >
                {Speeds.map((speed) => (
                  <option key={speed.title} value={speed.value}>
                    {speed.title}
                  </option>
                ))}
              </Select>
              <Divider vertical>|</Divider>
            </div>

            <>
              {position.isOpened ? (
                <div className="text-sm inline-flex gap-2 border border-primary rounded p-2">
                  <span>Profit: </span>
                  <Badge color={+position.profit > 0 ? "success" : "warning"}>
                    {position.profit}%
                  </Badge>
                  <Button
                    size="xs"
                    shape="circle"
                    color="error"
                    className="ml-6"
                    disabled={isBarReplayPlaying}
                    onClick={() => onPositionStatusChange({ status: "CLOSED" })}
                  >
                    ✕
                  </Button>
                </div>
              ) : (
                <ButtonGroup title={"Start Position"}>
                  <Button
                    onClick={() =>
                      onPositionStatusChange({ type: "LONG", status: "OPENED" })
                    }
                    disabled={isBarReplayPlaying}
                    size="xs"
                    color="success"
                  >
                    Buy
                  </Button>
                  <Button
                    onClick={() =>
                      onPositionStatusChange({
                        type: "SHORT",
                        status: "OPENED",
                      })
                    }
                    disabled={isBarReplayPlaying}
                    size="xs"
                    color="error"
                  >
                    Sell
                  </Button>
                </ButtonGroup>
              )}
            </>
          </>
        ) : null}

        <div className="ml-auto flex gap-1">
          <Button
            title={"Screenshot"}
            shape="circle"
            size="sm"
            onClick={onScreenShotClick}
          >
            <svg viewBox="0 0 20 20" className="w-4 h-4">
              <path
                fill="currentColor"
                d="M6.50977,1L13.4902,1C13.6406,1,13.7695,1.1104910000000001,13.7969,1.2631700000000001L14.0273,2.52277C14.1387,3.13147,14.6543,3.57143,15.2559,3.57143L17.5,3.57143C18.8809,3.57143,20,4.72254,20,6.14286L20,16.4286C20,17.8489,18.8809,19,17.5,19L2.5,19C1.11914,19,0,17.8489,0,16.4286L0,6.14286C0,4.72254,1.11914,3.57143,2.5,3.57143L4.74414,3.57143C5.3457,3.57143,5.86133,3.13147,5.97266,2.52277L6.20312,1.2631700000000001C6.23047,1.1104910000000001,6.35937,1,6.50977,1ZM15.2559,4.857139999999999C14.0547,4.857139999999999,13.0215,3.97522,12.7988,2.75982L12.7129,2.28571L7.28711,2.28571L7.20117,2.75982C6.98047,3.97522,5.94727,4.857139999999999,4.74414,4.857139999999999L2.5,4.857139999999999C1.81055,4.857139999999999,1.25,5.43371,1.25,6.14286L1.25,16.4286C1.25,17.1377,1.81055,17.7143,2.5,17.7143L17.5,17.7143C18.1895,17.7143,18.75,17.1377,18.75,16.4286L18.75,6.14286C18.75,5.43371,18.1895,4.857139999999999,17.5,4.857139999999999L15.2559,4.857139999999999ZM4.375,6.78571L3.125,6.78571C2.7793,6.78571,2.5,6.49844,2.5,6.14286C2.5,5.78728,2.7793,5.5,3.125,5.5L4.375,5.5C4.7207,5.5,5,5.78728,5,6.14286C5,6.49844,4.7207,6.78571,4.375,6.78571ZM10,6.14286C7.06641,6.14286,4.6875,8.58973,4.6875,11.6071C4.6875,14.6246,7.06641,17.0714,10,17.0714C12.9336,17.0714,15.3125,14.6246,15.3125,11.6071C15.3125,8.58973,12.9336,6.14286,10,6.14286ZM10,7.42857C11.0859,7.42857,12.1055,7.8625,12.873,8.65201C13.6406,9.44152,14.0625,10.49018,14.0625,11.6071C14.0625,12.7241,13.6406,13.7728,12.873,14.5623C12.1055,15.3518,11.0859,15.7857,10,15.7857C8.91406,15.7857,7.89453,15.3518,7.12695,14.5623C6.35937,13.7728,5.9375,12.7241,5.9375,11.6071C5.9375,10.49018,6.35938,9.44152,7.12695,8.65201C7.89453,7.8625,8.91406,7.42857,10,7.42857ZM10,9.67857C8.96484,9.67857,8.125,10.54241,8.125,11.6071C8.125,12.6719,8.96484,13.5357,10,13.5357C11.0352,13.5357,11.875,12.6719,11.875,11.6071C11.875,10.54241,11.0352,9.67857,10,9.67857ZM10,10.96429C10.3438,10.96429,10.625,11.2536,10.625,11.6071C10.625,11.9607,10.3438,12.25,10,12.25C9.65625,12.25,9.375,11.9607,9.375,11.6071C9.375,11.2536,9.65625,10.96429,10,10.96429Z"
              ></path>
            </svg>
          </Button>
          <Button
            title={"Settings"}
            onClick={() => {
              setIsSettingsModalOpen(true);
            }}
            className="font-[icomoon] leading-[0.3] text-lg"
            shape="circle"
            size="sm"
          >
            {"\ue902"}
          </Button>
        </div>
      </Navbar>
    </div>
  );
};
