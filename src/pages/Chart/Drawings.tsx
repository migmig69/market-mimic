import { ReactElement, ReactNode, useMemo, useRef, useState } from "react";
import { shallow } from "zustand/shallow";
import {
  createSingleLineOptions,
  createMoreLineOptions,
  createPolygonOptions,
  createFibonacciOptions,
  createWaveOptions,
  Icon,
  SelectDataSourceItem,
} from "./icons";
import { Button, Divider } from "react-daisyui";
import { useDrawingStore } from "./store";
import { DrawingType } from "./types";
import { OverlayMode } from "klinecharts";
const favoriteDrawings = localStorage.getItem("favoriteDrawings-v1");
const GROUP_ID = "DRAWING";
const CustomButton = ({ children, className, ...props }: any) => (
  <Button
    color={"ghost"}
    size={"xs"}
    className={`rounded-none normal-case	 ${className || ""}`}
    {...props}
  >
    {children}
  </Button>
);

export const Drawings = ({
  onDrawingItemClick,
  onLockChange,
  onRemoveClick,
  onVisibleChange,
  onModeChange,
}: DrawingType) => {
  const { isLocked, mode, isVisible, setIsLocked, setMode, setIsVisible } =
    useDrawingStore(
      (state) => ({
        isLocked: state.isLocked,
        mode: state.mode,
        isVisible: state.isVisible,
        setIsLocked: state.setIsLocked,
        setMode: state.setMode,
        setIsVisible: state.setIsVisible,
      }),
      shallow
    );

  const [isOpen, setIsOpen] = useState(false);
  const [favoriteList, setFavoriteList] = useState<SelectDataSourceItem[]>(
    favoriteDrawings ? JSON.parse(favoriteDrawings) : []
  );

  const overlays = useMemo(() => {
    return [
      {
        key: "singleLine",
        list: createSingleLineOptions(),
      },
      {
        key: "moreLine",
        list: createMoreLineOptions(),
      },
      {
        key: "polygon",
        list: createPolygonOptions(),
      },
      {
        key: "fibonacci",
        list: createFibonacciOptions(),
      },
      { key: "wave", list: createWaveOptions() },
    ];
  }, []);
  return (
    <div
      className={`fixed left-0 bottom-0 h-[calc(100vh-50px)] z-50 bg-base-100 ${
        isOpen ? "w-56" : "w-10"
      }`}
    >
      <div className="flex flex-col items-center w-full h-full">
        <div className="w-full">
          <CustomButton
            onClick={() => setIsOpen((p) => !p)}
            className={"w-full"}
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className={isOpen ? "rotate-180" : ""}
            >
              <path
                d="M10.0355 6.25L13.5711 9.78553L10.0355 13.3211M6.50001 6.25L10.0355 9.78553L6.50001 13.3211"
                stroke="currentColor"
                strokeWidth="1.25"
              ></path>
            </svg>
            {isOpen ? <small className="ml-px">Drawing Tools</small> : null}
          </CustomButton>
        </div>
        <div className="flex flex-col max-h-[75%] overflow-y-auto overflow-x-hidden w-full">
          <div className="bg-base-300 mb-4">
            {favoriteList?.map((data) => {
              return (
                <div key={data.key} className="flex justify-between group">
                  <CustomButton
                    onClick={() =>
                      onDrawingItemClick({
                        groupId: GROUP_ID,
                        name: data.key,
                        lock: isLocked,
                        mode: "normal",
                      })
                    }
                    className={` flex ${
                      isOpen ? "justify-start flex-1" : "justify-center"
                    }`}
                  >
                    <Icon name={data.key} />
                    {isOpen ? (
                      <small className="ml-px">{data.text}</small>
                    ) : null}
                  </CustomButton>
                </div>
              );
            })}
          </div>
          {overlays.map((item) => {
            return (
              <div key={item.key} className="flex flex-col w-full">
                {item.list.map((data) => {
                  const isActive = favoriteList.find((d) => d.key === data.key);
                  return (
                    <div key={data.key} className="flex justify-between group">
                      <CustomButton
                        className={`flex ${
                          isOpen ? "justify-start flex-1" : "justify-center"
                        }`}
                        onClick={() => {
                          onDrawingItemClick({
                            groupId: GROUP_ID,
                            name: data.key,
                            lock: isLocked,
                            mode: "normal",
                          });
                        }}
                      >
                        <Icon name={data.key} />
                        {isOpen ? (
                          <small className="ml-px">{data.text}</small>
                        ) : null}
                      </CustomButton>
                      {isOpen ? (
                        <CustomButton
                          className={`${
                            !isActive ? "invisible group-hover:visible" : ""
                          }`}
                          onClick={() => {
                            setFavoriteList((arr) => {
                              let fl = [];
                              if (isActive) {
                                fl = arr.filter((el) => el.key !== data.key);
                              } else {
                                fl = [...arr, data];
                              }
                              localStorage.setItem(
                                "favoriteDrawings-v1",
                                JSON.stringify(fl)
                              );
                              return fl;
                            });
                          }}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 18 18"
                            width="12"
                            height="12"
                            fill="none"
                            className={isActive ? "text-yellow-400" : ""}
                          >
                            <path
                              fill="currentColor"
                              d="M9 1l2.35 4.76 5.26.77-3.8 3.7.9 5.24L9 13l-4.7 2.47.9-5.23-3.8-3.71 5.25-.77L9 1z"
                            ></path>
                          </svg>
                        </CustomButton>
                      ) : null}
                    </div>
                  );
                })}
                <Divider className="my-1" />
              </div>
            );
          })}
        </div>
        <div className="w-full mt-2 flex flex-col border border-primary/30 border-dashed">
          <CustomButton
            onClick={() => {
              setIsLocked(!isLocked);
              onLockChange(!isLocked);
            }}
            className={isOpen ? "justify-start" : ""}
          >
            {isLocked ? <Icon name="lock" /> : <Icon name="unlock" />}
            {isOpen ? (
              <small>{isLocked ? "Unlock Drawings" : "Lock Drawings"}</small>
            ) : null}
          </CustomButton>
          <CustomButton
            onClick={() => {
              let newMode = OverlayMode.Normal;
              if (mode === OverlayMode.Normal) {
                newMode = OverlayMode.WeakMagnet;
              } else if (mode === OverlayMode.WeakMagnet) {
                newMode = OverlayMode.StrongMagnet;
              }
              setMode(newMode);
              onModeChange(newMode);
            }}
            className={isOpen ? "justify-start" : ""}
          >
            {[OverlayMode.WeakMagnet, OverlayMode.Normal].includes(mode) ? (
              <Icon
                name="weak_magnet"
                className={`${
                  mode === OverlayMode.WeakMagnet ? "text-blue-500" : ""
                }`}
              />
            ) : (
              <Icon name="strong_magnet" className="text-blue-500" />
            )}

            {isOpen ? <small>Mode: {mode}</small> : null}
          </CustomButton>

          <CustomButton
            onClick={() => {
              setIsVisible(!isVisible);
              onVisibleChange(!isVisible);
            }}
            className={isOpen ? "justify-start" : ""}
          >
            {isVisible ? <Icon name="invisible" /> : <Icon name="visible" />}
            {isOpen ? (
              <small>{isVisible ? "Show Drawings" : "Hide Drawings"}</small>
            ) : null}
          </CustomButton>
          <CustomButton
            onClick={() => onRemoveClick(GROUP_ID)}
            className={isOpen ? "justify-start" : ""}
          >
            <Icon name="remove" />
            {isOpen ? <small>Remove Drawings</small> : null}
          </CustomButton>
        </div>
      </div>
    </div>
  );
};
