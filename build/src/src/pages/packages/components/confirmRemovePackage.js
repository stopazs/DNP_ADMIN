import { confirm } from "components/ConfirmDialog";
import { shortNameCapitalized } from "utils/format";

export default function confirmPackageRemove(id, cb) {
  confirm({
    title: `Removing '${shortNameCapitalized(id)}'`,
    text: `This action cannot be undone. This will delete the package ${shortNameCapitalized(id)}. To confirm, click the "Remove package" option.`,
    buttons: [
      // { label: "Remove", onClick: () => cb(id, false) },
      { label: "Remove package", onClick: () => cb(id, true) }
    ]
  });
}
