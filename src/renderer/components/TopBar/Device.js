// @flow

import React from "react";
import { getDeviceModel } from "@ledgerhq/devices";
import { colors } from "~/renderer/styles/theme";
import Tooltip from "~/renderer/components/Tooltip";
import Box from "~/renderer/components/Box";
import Text from "~/renderer/components/Text";
import { getCurrentDevice } from "~/renderer/reducers/devices";
import { useSelector } from "react-redux";

import nanoS from "~/renderer/icons/device/small/nanoS";
import nanoX from "~/renderer/icons/device/small/nanoX";
import blue from "~/renderer/icons/device/small/blue";

import ItemContainer from "./ItemContainer";
import styled from "styled-components";

const Bar = styled.div`
  margin-left: 5px;
  margin-right: 5px;
  height: 15px;
  width: 1px;
  background: ${p => p.theme.colors.palette.divider};
`;

const Device = () => {
  const device = useSelector(getCurrentDevice);
  console.log({ device });
  if (!device) return null;

  const deviceModel = getDeviceModel(device.modelId);
  const icons = {
    nanoS,
    nanoX,
    blue,
  };

  const Icon = icons[deviceModel.id];
  if (!Icon) return null;

  return deviceModel ? (
    <>
      <Tooltip content={deviceModel ? `${deviceModel.productName} ` : ""}>
        <ItemContainer isInteractive onClick={() => undefined}>
          <Icon size={20} color={colors.dark} />
          <Text ff="Inter|SemiBold" style={{ lineHeight: 1.57, flex: 1 }} fontSize={4}>
            {`${deviceModel.productName} on ${device.appAndVersion.name} - ${device.appAndVersion.version}`}
          </Text>
        </ItemContainer>
      </Tooltip>
      <Box justifyContent="center">
        <Bar />
      </Box>
    </>
  ) : (
    "No device"
  );
};

export default Device;
