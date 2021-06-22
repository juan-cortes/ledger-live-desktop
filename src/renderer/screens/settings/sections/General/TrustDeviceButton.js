// @flow

import React, { useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";

import { trustedCookieSeedsSelector } from "~/renderer/reducers/settings";
import { getCurrentDevice } from "~/renderer/reducers/devices";
import { setCookieSeedTrust } from "~/renderer/actions/settings";
import Switch from "~/renderer/components/Switch";

const TrustDeviceButton = () => {
  const trustedSeeds = useSelector(trustedCookieSeedsSelector);
  const dispatch = useDispatch();
  const device = useSelector(getCurrentDevice);

  const onChangeDeviceTrust = useCallback(
    (value: boolean) => {
      dispatch(setCookieSeedTrust({ value, cookieSeed: device?.cookie }));
    },
    [device, dispatch],
  );

  return (
    <Switch isChecked={trustedSeeds.includes(device?.cookie)} onChange={onChangeDeviceTrust} />
  );
};

export default TrustDeviceButton;
