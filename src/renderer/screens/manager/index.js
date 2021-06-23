// @flow
import React, { useState, useCallback } from "react";
import { useSelector } from "react-redux";
import { createAction } from "@ledgerhq/live-common/lib/hw/actions/manager";
import { getCurrentDevice } from "~/renderer/reducers/devices";
import Dashboard from "~/renderer/screens/manager/Dashboard";
import { SyncSkipUnderPriority } from "@ledgerhq/live-common/lib/bridge/react";
import DeviceAction from "~/renderer/components/DeviceAction";
import { command } from "~/renderer/commands";
import { mockedEventEmitter } from "~/renderer/components/debug/DebugMock";
import { getEnv } from "@ledgerhq/live-common/lib/env";
import styled from "styled-components";
import Card from "~/renderer/components/Box/Card";
import Box from "~/renderer/components/Box";
import Text from "~/renderer/components/Text";
import ExternalLinkButton from "~/renderer/components/ExternalLinkButton";
import bannerIllustration from "~/renderer/images/buy-banner.svg";

const connectManagerExec = command("connectManager");
const action = createAction(getEnv("MOCK") ? mockedEventEmitter : connectManagerExec);

export const IllustrationWrapper: ThemedComponent<{}> = styled.div`
  width: 200px;
  align-self: flex-end;
`;
const Illustration = styled.img.attrs(() => ({ src: bannerIllustration }))``;
const bannerTitle = "Don’t have a Ledger wallet yet?"
const bannerDescription = "Get a Ledger wallet to unlock the full Ledger Live experience."
const buttonText = "Buy a Ledger wallet"
const bannerUrl = "https://shop.ledger.com/pages/hardware-wallets-comparison"



const Manager = () => {
  const [appsToRestore, setRestoreApps] = useState();
  const [result, setResult] = useState(null);
  const onReset = useCallback(apps => {
    setRestoreApps(apps);
    setResult(null);
  }, []);
  const onResult = useCallback(result => setResult(result), []);

  const device = useSelector(getCurrentDevice)

  return (
    <>
      <SyncSkipUnderPriority priority={999} />
      {result ? (
        <Dashboard {...result} onReset={onReset} appsToRestore={appsToRestore} />
      ) : (
        <>
          {!device ?
            <Card horizontal>
              <Box vertical flex={1} p={26}>
                <Text ff="Inter|SemiBold" fontSize={6} color="palette.text.shade100" mb={1}>
                  {bannerTitle}
                </Text>
                <Text ff="Inter|Medium" fontSize={5} mb={3}>
                  {bannerDescription}
                </Text>
                <Box horizontal>
                  <ExternalLinkButton url={bannerUrl} label={buttonText} primary/>
                </Box>
              </Box>
              <IllustrationWrapper>
                <Illustration/>
              </IllustrationWrapper>
            </Card>
          : null }
          <DeviceAction onResult={onResult} action={action} request={null} />
        </>
      )}
    </>
  );
};

export default Manager;
