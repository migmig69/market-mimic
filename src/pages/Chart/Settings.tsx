import { Button, Form, Modal, Select, Toggle } from "react-daisyui";
import { useSettingsStore } from "./store";
import { PriceAxisType } from "./utils";

export const Settings = () => {
  const { settings, setSettings, isModalOpen, setIsModalOpen } =
    useSettingsStore((state) => ({
      settings: state.settings,
      setSettings: state.setSettings,
      isModalOpen: state.isModalOpen,
      setIsModalOpen: state.setIsModalOpen,
    }));
  return (
    <Modal open={isModalOpen}>
      <Button
        size="sm"
        shape="circle"
        className="absolute right-2 top-2"
        onClick={() => setIsModalOpen(false)}
      >
        ✕
      </Button>
      <Modal.Header className="font-semibold">Chart Settings</Modal.Header>
      <Modal.Body>
        <Form>
          <div className="flex flex-wrap bg-primary/20">
            <Form.Label title="Reverse" className="w-1/2   p-2">
              <Toggle
                defaultChecked={settings.reverse}
                onChange={(t) => setSettings({ reverse: t.target.checked })}
                color="success"
              />
            </Form.Label>
            <Form.Label title="Show Grids" className="w-1/2 p-2">
              <Toggle
                defaultChecked={settings.showGrid}
                onChange={(t) => setSettings({ showGrid: t.target.checked })}
                color="success"
              />
            </Form.Label>
            <Form.Label title="Price Axis type" className="w-1/2  p-2">
              <Select
                size="xs"
                defaultValue={settings.priceAxisType}
                onChange={(e) => {
                  setSettings({
                    priceAxisType: e.target.value as PriceAxisType,
                  });
                }}
              >
                <Select.Option value={"normal"}>Normal</Select.Option>
                <Select.Option value={"percentage"}>Percentage</Select.Option>
                <Select.Option value={"log"}>Log</Select.Option>
              </Select>
            </Form.Label>
            <Form.Label title="Show Watermark" className="w-1/2 p-2">
              <Toggle
                defaultChecked={settings.showWatermark}
                onChange={(t) =>
                  setSettings({ showWatermark: t.target.checked })
                }
                color="success"
              />
            </Form.Label>
          </div>
        </Form>
      </Modal.Body>
      <Modal.Actions>
        <Button onClick={() => setIsModalOpen(false)}>Close</Button>
      </Modal.Actions>
    </Modal>
  );
};
