// @flow
import { useSelector } from "react-redux";
import { getCurrentDevice } from "~/renderer/reducers/devices";
import { amnesiaCookiesSelector } from "~/renderer/reducers/application";
import { useConditionalDebounce } from "./useConditionalDebounce";

export default useIsAmnesia => {
  const rawDevice = useSelector(getCurrentDevice);
  const device = useConditionalDebounce(rawDevice, 1200, key => !key); // NB debounce disconnects in favor of connects
  const amnesiaCookies = useSelector(amnesiaCookiesSelector);
  const isAmnesia = amnesiaCookies.includes(device?.cookie);

  return isAmnesia;
};
