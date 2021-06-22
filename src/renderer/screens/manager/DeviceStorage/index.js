// @flow

import React, { useCallback, memo, useState, useEffect } from "react";
import styled, { css, keyframes } from "styled-components";
import useTheme from "~/renderer/hooks/useTheme";
import { Trans } from "react-i18next";
import { Transition, TransitionGroup } from "react-transition-group";
import { fontSize, color } from "styled-system";
import fontFamily from "~/renderer/styles/styled/fontFamily";
import manager from "@ledgerhq/live-common/lib/manager";
import type { DeviceInfo, FirmwareUpdateContext } from "@ledgerhq/live-common/lib/types/manager";
import type { CryptoCurrency } from "@ledgerhq/live-common/lib/types";
import type { AppsDistribution } from "@ledgerhq/live-common/lib/apps";
import type { DeviceModel } from "@ledgerhq/devices";
import type { ThemedComponent } from "~/renderer/styles/StyleProvider";
import { openModal } from "~/renderer/actions/modals";

import ByteSize from "~/renderer/components/ByteSize";
import { rgba } from "~/renderer/styles/helpers";
import Text from "~/renderer/components/Text";
import Tooltip from "~/renderer/components/Tooltip";
import Button from "~/renderer/components/Button";
import Card from "~/renderer/components/Box/Card";
import Box, { Tabbable } from "~/renderer/components/Box";

import IconTriangleWarning from "~/renderer/icons/TriangleWarning";
import IconCheckFull from "~/renderer/icons/CheckFull";

import nanoS from "./images/nanoS.png";
import nanoX from "./images/nanoX.png";
import blue from "./images/blue.png";
import IconPen from "~/renderer/icons/Pen";
import IconAmnesia from "~/renderer/icons/Amnesia";
import IconCross from "~/renderer/icons/Cross";
import IconCheck from "~/renderer/icons/Check";

import { getCurrentDevice } from "~/renderer/reducers/devices";
import { cookieSeedNamesSelector } from "~/renderer/reducers/settings";
import { setNameForCookieSeed } from "~/renderer/actions/settings";
import { toggleAmnesiaForCookieSeed } from "~/renderer/actions/application";
import { useDispatch, useSelector } from "react-redux";
import useIsAmnesia from "~/renderer/hooks/useIsAmnesia";

const illustrations = {
  nanoS,
  nanoX,
  blue,
};

export const DeviceIllustration: ThemedComponent<{}> = styled.img.attrs(p => ({
  src: illustrations[p.deviceModel.id],
}))`
  position: absolute;
  top: 0;
  left: 50%;
  max-height: 100%;
  filter: drop-shadow(0px 5px 7px ${p => p.theme.colors.palette.text.shade10});
  transform: translateX(-50%);
  user-select: none;
  pointer-events: none;
`;

const Separator = styled.div`
  height: 1px;
  margin: 20px 0px;
  background: ${p => p.theme.colors.palette.background.default};
  width: 100%;
`;

const HighlightVersion = styled.span`
  padding: 4px 6px;
  color: ${p => p.theme.colors.wallet};
  background: ${p => p.theme.colors.blueTransparentBackground};
  border-radius: 4px;
`;

const Info = styled.div`
  font-family: Inter;
  display: flex;
  margin-bottom: 20px;
  font-size: 13px;
  line-height: 16px;

  & > div {
    display: flex;
    flex-direction: row;
    & > :nth-child(2) {
      margin-left: 10px;
    }
    margin-right: 30px;
  }
`;

const blinkOpacity = keyframes`
	0% {
		opacity: 0.6;
  }
  50% {
		opacity: 1;
	}
	100% {
		opacity: 0.6;
	}
`;

const StorageBarWrapper: ThemedComponent<{ installing: boolean }> = styled.div`
  width: 100%;
  border-radius: 3px;
  height: 23px;
  background: ${p => p.theme.colors.palette.text.shade10};
  overflow: hidden;
  position: relative;
`;

const StorageBarGraph = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  height: 100%;
  position: relative;
  transform-origin: left;
  animation: ${p => p.theme.animations.fadeInGrowX};
`;

const transitionStyles = {
  entering: () => ({ opacity: 0, flexBasis: 0, flexGrow: 0 }),
  entered: flexBasis => ({ opacity: 1, flexBasis }),
  exiting: () => ({ opacity: 0, flexBasis: 0, flexGrow: 0 }),
  exited: () => ({ opacity: 0, flexBasis: 0, flexGrow: 0 }),
};

/** each device storage bar will grow of 0.5% if the space is available or just fill its given percent basis if the bar is filled */
const StorageBarItem: ThemedComponent<{ ratio: number }> = styled.div.attrs(props => ({
  style: {
    backgroundColor: props.installing ? props.theme.colors.palette.text.shade30 : props.color,
    ...transitionStyles[props.state](`${(props.ratio * 1e2).toFixed(3)}%`),
  },
}))`
  display: flex;
  flex: 0.005 0 0;
  background-color: black;
  position: relative;
  border-right: 1px solid ${p => p.theme.colors.palette.background.paper};
  box-sizing: border-box;
  transform-origin: left;
  opacity: 1;
  transition: all 0.33s ease-in-out;
  position: relative;
  overflow: hidden;
  ${p =>
    p.installing
      ? css`
          animation: ${blinkOpacity} 2s ease infinite;
        `
      : ""};
  & > * {
    width: 100%;
  }
`;

const FreeInfo = styled.div`
  padding: 10px 0 0 0;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-end;
  color: ${p => (p.danger ? p.theme.colors.warning : p.theme.colors.palette.text.shade100)};
`;

const TooltipContentWrapper: ThemedComponent<{}> = styled.div`
  & > :nth-child(1) {
    color: ${p => rgba(p.theme.colors.palette.background.paper, 0.7)};
    text-align: center;
    display: block;
  }
  & > :nth-child(2) {
    color: ${p => p.theme.colors.palette.background.paper};
    text-align: center;
  }
`;

const DeviceNameBox = styled(Box)`
  position: relative;
  left: -11px;
`;

const DeviceName = styled.input`
  ${fontFamily}
  ${fontSize}
  ${color}

  border: 1px solid;
  border-color: transparent;
  border-radius: 4px;
  padding: 1px 9px 2px;
  max-width: 250px !important;
  width: 100%;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  display: inline-block;
  background-color: transparent;
  pointer-events: ${p => (p.disabled ? "none" : "auto")};
  + svg {
    display: none;
  }

  :hover {
    border-color: ${p => (!p.disabled ? p.theme.colors.palette.text.shade30 : "transparent")};
    cursor: text;

    + svg {
      display: ${p => (!p.disabled ? "inline" : "none")};
    }
  }

  :focus {
    max-width: 190px !important;
    border-color: ${p => p.theme.colors.wallet};
    background: ${p => (p.theme.colors.palette.type === "light" ? "#fff" : "none")};

    + svg {
      display: none;
    }
  }
`;

const IconButton: ThemedComponent<{ disabled?: boolean }> = styled(Tabbable).attrs(() => ({
  alignItems: "center",
  justifyContent: "center",
}))`
  width: 34px;
  height: 34px;
  border: 1px solid ${p => p.theme.colors.palette.text.shade60};
  border-radius: 4px;
  &:hover {
    color: ${p => (p.disabled ? "" : p.theme.colors.palette.text.shade100)};
    background: ${p => (p.disabled ? "" : rgba(p.theme.colors.palette.divider, 0.2))};
    border-color: ${p => p.theme.colors.palette.text.shade100};
  }

  &:active {
    background: ${p => (p.disabled ? "" : rgba(p.theme.colors.palette.divider, 0.3))};
  }
`;

const TooltipContent = ({
  name,
  bytes,
  deviceModel,
  deviceInfo,
}: {
  name: string,
  bytes: number,
  deviceModel: DeviceModel,
  deviceInfo: DeviceInfo,
}) => (
  <TooltipContentWrapper>
    <Text>{name}</Text>
    <Text>
      <ByteSize value={bytes} deviceModel={deviceModel} firmwareVersion={deviceInfo.version} />
    </Text>
  </TooltipContentWrapper>
);

// FIXME move to live-common
const appDataColors = {
  Exchange: "#39D2F3",
};

const getAppStorageBarColor = ({ name, currency }: { currency: ?CryptoCurrency, name: string }) =>
  name in appDataColors ? appDataColors[name] : currency?.color;

export const StorageBar = ({
  deviceInfo,
  distribution,
  deviceModel,
  isIncomplete,
  installQueue,
  uninstallQueue,
  jobInProgress,
}: {
  deviceInfo: DeviceInfo,
  distribution: AppsDistribution,
  deviceModel: DeviceModel,
  isIncomplete: boolean,
  installQueue: string[],
  uninstallQueue: string[],
  jobInProgress: boolean,
}) => (
  <StorageBarWrapper installing={jobInProgress}>
    {!isIncomplete && (
      <TransitionGroup component={StorageBarGraph}>
        {distribution.apps.map(({ name, currency, bytes, blocks }, index) => (
          <Transition timeout={{ appear: 333, enter: 333, exit: 1200 }} key={`${name}`}>
            {state => (
              <StorageBarItem
                state={state}
                installing={installQueue.includes(name) || uninstallQueue.includes(name)}
                color={getAppStorageBarColor({ name, currency })}
                ratio={blocks / (distribution.totalBlocks - distribution.osBlocks)}
              >
                <Tooltip
                  hideOnClick={false}
                  content={
                    <TooltipContent
                      name={name}
                      bytes={bytes}
                      deviceModel={deviceModel}
                      deviceInfo={deviceInfo}
                    />
                  }
                />
              </StorageBarItem>
            )}
          </Transition>
        ))}
      </TransitionGroup>
    )}
  </StorageBarWrapper>
);

type Props = {
  deviceModel: DeviceModel,
  deviceInfo: DeviceInfo,
  distribution: AppsDistribution,
  isIncomplete: boolean,
  installQueue: string[],
  uninstallQueue: string[],
  jobInProgress: boolean,
  firmware: ?FirmwareUpdateContext,
};

const DeviceStorage = ({
  deviceModel,
  deviceInfo,
  distribution,
  isIncomplete,
  installQueue,
  uninstallQueue,
  jobInProgress,
  firmware,
}: Props) => {
  const shouldWarn = distribution.shouldWarnMemory || isIncomplete;

  const firmwareOutdated = manager.firmwareUnsupported(deviceModel.id, deviceInfo) || firmware;

  // HACKATHON notes, not really renaming anything but rather adding a name to a cookie and
  // storing a mapping of them. This way we can show a human readable name on the left instead of
  // a long ugly hash. (!)
  const cookieSeedNames = useSelector(cookieSeedNamesSelector);
  const device = useSelector(getCurrentDevice);
  const maybeCookie = device?.cookie;

  const isAmnesia = useIsAmnesia();
  const dispatch = useDispatch();
  const [name, setName] = useState(
    cookieSeedNames[maybeCookie] || isAmnesia ? "Amnesia wallet" : "Nano S",
  );
  const [editingName, setEditingName] = useState(false);

  const submitNameChange = () => {
    dispatch(setNameForCookieSeed({ cookieSeed: maybeCookie, name }));
  };

  const submitNameChangeOnEnter = e => {
    if (e.key === "Enter") {
      e.target.blur();
      submitNameChange();
    }
  };

  const toggleAmnesia = useCallback(() => {
    if (global.localStorage.getItem("amnesiaModeAcked") === "true") {
      dispatch(toggleAmnesiaForCookieSeed({ cookieSeed: device?.cookie }));
      dispatch(setNameForCookieSeed({ cookieSeed: device?.cookie, name: "" }));
    } else {
      dispatch(openModal("MODAL_AMNESIA"));
    }
  }, [device, dispatch]);

  useEffect(() => {
    if (!editingName) {
      setName(cookieSeedNames[maybeCookie]);
    }
  }, [cookieSeedNames, device, editingName, maybeCookie]);

  const color1 = useTheme("colors.palette.text.shade100");
  const color2 = useTheme("colors.palette.background.paper");

  return (
    <Card p={20} mb={4} horizontal>
      <Box position="relative" flex="0 0 140px" mr={20}>
        <DeviceIllustration deviceModel={deviceModel} />
      </Box>
      <div style={{ flex: 1 }}>
        <Box horizontal alignItems="center" mb={1}>
          <Box mr={3}>
            <Tooltip content={<Trans i18nKey="manager.deviceStorage.genuine" />}>
              <IconCheckFull size={18} />
            </Tooltip>
          </Box>
          <DeviceNameBox horizontal alignItems="center" pr={8} flow={2}>
            <DeviceName
              disabled={isAmnesia}
              color="palette.text.shade100"
              ff="Inter|SemiBold"
              fontSize={7}
              onFocus={() => {
                setEditingName(true);
                setTimeout(() => {
                  document.execCommand("selectAll", false, null);
                });
              }}
              onBlur={() => {
                setEditingName(false);
                setTimeout(() => {
                  window.getSelection().removeAllRanges();
                });
              }}
              onKeyPress={submitNameChangeOnEnter}
              onChange={e => setName(e.target.value)}
              disableEllipsis={editingName}
              value={editingName ? name : name || (isAmnesia ? "Amnesia wallet" : "Nano S")}
              id="device-header-name"
            />
            <IconPen size={14} />
            {editingName && (
              <IconButton>
                <Box justifyContent="center">
                  <IconCross size={14} />
                </Box>
              </IconButton>
            )}
            {editingName && (
              <IconButton onMouseDown={submitNameChange}>
                <Box justifyContent="center" color="positiveGreen">
                  <IconCheck size={14} />
                </Box>
              </IconButton>
            )}
          </DeviceNameBox>
        </Box>
        <Box horizontal alignItems={"center"}>
          <Box flex={1}>
            <Text ff="Inter|SemiBold" color="palette.text.shade40" fontSize={4}>
              {firmwareOutdated ? (
                <Trans
                  i18nKey="manager.deviceStorage.firmwareAvailable"
                  values={{ version: deviceInfo.version }}
                />
              ) : (
                <Trans
                  i18nKey="manager.deviceStorage.firmwareUpToDate"
                  values={{ version: deviceInfo.version }}
                />
              )}{" "}
              {<HighlightVersion>{deviceInfo.version}</HighlightVersion>}
            </Text>
          </Box>
          <Button
            secondary
            outlineGrey
            style={{ backgroundColor: isAmnesia ? color1 : color2 }}
            onClick={toggleAmnesia}
          >
            <IconAmnesia size={16} color={isAmnesia ? color2 : color1} />
            <Text ml={2} color={isAmnesia ? color2 : color1}>
              {"Amnesia mode"}
            </Text>
          </Button>
        </Box>
        <Separator />
        <Info>
          <div>
            <Text fontSize={4}>
              <Trans i18nKey="manager.deviceStorage.used" />
            </Text>
            <Text color="palette.text.shade100" ff="Inter|Bold" fontSize={4}>
              <ByteSize
                deviceModel={deviceModel}
                value={distribution.totalAppsBytes}
                firmwareVersion={deviceInfo.version}
              />
            </Text>
          </div>
          <div>
            <Text fontSize={4}>
              <Trans i18nKey="manager.deviceStorage.capacity" />
            </Text>
            <Text color="palette.text.shade100" ff="Inter|Bold" fontSize={4}>
              <ByteSize
                deviceModel={deviceModel}
                value={distribution.appsSpaceBytes}
                firmwareVersion={deviceInfo.version}
              />
            </Text>
          </div>
          <div>
            <Text fontSize={4}>
              <Trans i18nKey="manager.deviceStorage.installed" />
            </Text>
            <Text color="palette.text.shade100" ff="Inter|Bold" fontSize={4}>
              {!isIncomplete ? distribution.apps.length : "—"}
            </Text>
          </div>
        </Info>
        <StorageBar
          distribution={distribution}
          deviceInfo={deviceInfo}
          deviceModel={deviceModel}
          isIncomplete={isIncomplete}
          installQueue={installQueue}
          uninstallQueue={uninstallQueue}
          jobInProgress={jobInProgress}
        />
        <FreeInfo danger={shouldWarn}>
          {shouldWarn ? <IconTriangleWarning /> : ""}{" "}
          <Box paddingLeft={1}>
            <Text ff="Inter|SemiBold" fontSize={3}>
              {isIncomplete ? (
                <Trans i18nKey="manager.deviceStorage.incomplete" />
              ) : distribution.freeSpaceBytes > 0 ? (
                <>
                  <Trans i18nKey="manager.deviceStorage.freeSpace" values={{ space: 0 }}>
                    <ByteSize
                      value={distribution.freeSpaceBytes}
                      deviceModel={deviceModel}
                      firmwareVersion={deviceInfo.version}
                    />
                    {"free"}
                  </Trans>
                </>
              ) : (
                <Trans i18nKey="manager.deviceStorage.noFreeSpace" />
              )}
            </Text>
          </Box>
        </FreeInfo>
      </div>
    </Card>
  );
};

export default memo<Props>(DeviceStorage);
