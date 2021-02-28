import { confirm } from "components/ConfirmDialog";
import { shortNameCapitalized } from "utils/format";

export default function confirmPackageRestart(id, cb) {
  confirm({
    title: `Restarting ${shortNameCapitalized(id)}`,
    text: `Do you want to restart this package?`,
    buttons: [{ label: "Restart", onClick: () => cb(id) }]
  });
}
