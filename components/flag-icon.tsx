import { US, CN, JP } from "country-flag-icons/react/3x2";
import type { Locale } from "@/i18n.config";

type IconProps = React.ComponentProps<typeof US>;

interface FlagIconProps extends IconProps {
  locale: Locale;
}

export function FlagIcon({ locale, ...props }: FlagIconProps) {
  switch (locale) {
    case "en":
      return <US {...props} />;
    case "zh-CN":
      return <CN {...props} />;
    case "ja":
      return <JP {...props} />;
    default:
      return null;
  }
}
