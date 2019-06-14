// FundedBy icons
import EfgLogo from "img/logos/efg-logo-only-min.png";
import AragonLogo from "img/logos/aragon-min.png";
import GivethLogo from "img/logos/giveth-min.png";
import EcfLogo from "img/logos/ecf-min.png";
// Icons
import Dashboard from "Icons/Dashboard";
import Activity from "Icons/Activity";
import Devices from "Icons/Devices";
import Folder from "Icons/Folder";
import NewFolder from "Icons/NewFolder";
import Settings from "Icons/Settings";
import Build from "Icons/Build";

export const fundedBy = [
  {
    logo: EfgLogo,
    text: "Ethereum Foundation",
    link:
      "https://blog.ethereum.org/2018/08/17/ethereum-foundation-grants-update-wave-3/"
  },
  {
    logo: AragonLogo,
    text: "Aragon Nest",
    link: "https://blog.aragon.org/aragon-nest-second-round-of-grants/#dappnode"
  },
  {
    logo: GivethLogo,
    text: "Giveth",
    link: "https://beta.giveth.io/campaigns/5b44b198647f33526e67c262"
  },
  {
    logo: EcfLogo,
    text: "Ethereum Community Fund"
  }
];

export const sidenavItems = [
  {
    name: "Home Screen",
    href: "/dashboard",
    icon: Dashboard
  },
  {
    name: "DappStore",
    href: "/installer",
    icon: NewFolder
  },

  {
    name: "My DApps",
    href: "/packages",
    icon: Folder
  },
  {
    name: "Connect (VPN)",
    href: "/devices",
    icon: Devices
  },
  {
    name: "Support",
    href: "/troubleshoot",
    icon: Activity
  },

  {
    name: "System",
    href: "/system",
    icon: Settings
  }

  //   {
  //     name: "Activity",
  //     href: "/activity",
  //     icon: Activity
  //   },

  //   {
  //     name: "Sdk",
  //     href: "/sdk",
  //     icon: Build
  //   }
];
