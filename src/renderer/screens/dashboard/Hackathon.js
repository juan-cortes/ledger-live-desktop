// @flow
import React from "react";
import styled from "styled-components";
import { getCurrentDevice } from "~/renderer/reducers/devices";
import { cookieSeedNamesSelector } from "~/renderer/reducers/settings";
import { amnesiaCookiesSelector } from "~/renderer/reducers/application";
import { useSelector } from "react-redux";
import { useConditionalDebounce } from "./useConditionalDebounce";
import Tabbable from "~/renderer/components/Box/Tabbable";
import Text from "~/renderer/components/Text";
import Ellipsis from "~/renderer/components/Ellipsis";
import NanoSIcon from "~/renderer/icons/NanoSFold";
import AmensiaIcon from "~/renderer/icons/Amnesia";
import useTheme from "~/renderer/hooks/useTheme";
import { useLocation } from "react-router-dom";

import Hide from "~/renderer/components/MainSideBar/Hide";
import Box from "~/renderer/components/Box";

const Container = styled(Tabbable).attrs(() => ({
  alignItems: "center",
  borderRadius: 1,
  ff: "Inter|SemiBold",
  flow: 3,
  horizontal: true,
  px: 3,
  py: 2,
}))`
  position: relative;
  height: 41px;
  width: 100%;
  cursor: ${p => (!p.isActive ? "default" : "pointer")};
  color: ${p =>
    p.isAmnesia
      ? p.theme.colors.palette.background.paper
      : p.isInManager
      ? p.theme.colors.white
      : p.isActive
      ? p.theme.colors.palette.text.shade100
      : p.theme.colors.palette.text.shade60};
  background: ${p =>
    p.isAmnesia
      ? p.theme.colors.palette.secondary.main
      : p.isInManager
      ? p.theme.colors.wallet
      : p.isActive
      ? p.theme.colors.palette.background.paper
      : p.theme.colors.palette.text.shade5};
  border: 1px solid
    ${p =>
      p.isAmnesia
        ? p.theme.colors.palette.secondary.main
        : p.isInManager || p.isActive
        ? p.theme.colors.wallet
        : p.theme.colors.palette.text.shade5};
  opacity: ${p => (p.disabled ? 0.5 : 1)};

  &:hover {
    opacity: 0.9;
  }
`;

const Hackathon = ({ collapsed, onClick }: { collapsed: boolean, onClick: () => void }) => {
  const rawDevice = useSelector(getCurrentDevice);
  const device = useConditionalDebounce(rawDevice, 3000, key => !key); // NB debounce disconnects in favor of connects

  const location = useLocation();
  const cookieSeedNames = useSelector(cookieSeedNamesSelector);
  const wording = device ? cookieSeedNames[device.cookie] || "Nano S" : "No device detected";
  const amnesiaCookies = useSelector(amnesiaCookiesSelector);
  const isInManager = location.pathname === "/manager";
  const isAmnesia = amnesiaCookies.includes(device?.cookie);

  const shade60 = useTheme("colors.palette.text.shade60");
  const white = useTheme("colors.palette.background.paper");
  const wallet = useTheme("colors.wallet");

  return (
    <Container
      onClick={onClick}
      isActive={!!device}
      isInManager={isInManager}
      isAmnesia={isAmnesia}
    >
      {isAmnesia ? (
        <AmensiaIcon size={16} color={isAmnesia || isInManager ? white : shade60} />
      ) : (
        <NanoSIcon size={16} color={isAmnesia || isInManager ? white : device ? wallet : shade60} />
      )}
      <Box grow shrink>
        <Hide visible={!collapsed}>
          <Box horizontal justifyContent="space-between" alignItems="center">
            <Text ff={device ? "Inter|SemiBold" : "Inter|Medium"} fontSize={3}>
              <Ellipsis>{wording}</Ellipsis>
            </Text>
          </Box>
        </Hide>
      </Box>
      {/* {NotifComponent} */}
    </Container>
  );
};

export default Hackathon;
