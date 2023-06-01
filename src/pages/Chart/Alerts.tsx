import { Toast, Alert, Button } from "react-daisyui";
import { useAlerts } from "./store";

export const Alerts = () => {
  const { alerts, removeAlert } = useAlerts((state) => ({
    removeAlert: state.removeAlert,
    alerts: state.alerts,
  }));
  return (
    <Toast
      horizontal="center"
      vertical="bottom"
      className="z-50 text-sm min-w-[30rem]"
    >
      {alerts.map((alert) => {
        return (
          <Alert
            className="p-2 font-semibold"
            key={alert.id}
            status={alert.status}
          >
            <div className="w-full flex-row justify-between gap-2">
              {alert.text}
            </div>
            <Button color="ghost" onClick={() => removeAlert(alert.id)}>
              X
            </Button>
          </Alert>
        );
      })}
    </Toast>
  );
};
