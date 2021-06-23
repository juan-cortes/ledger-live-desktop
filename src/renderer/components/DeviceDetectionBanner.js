// @flow
import React, { useCallback } from "react";
import styled from "styled-components";
import Card from "~/renderer/components/Box/Card";
import Box from "~/renderer/components/Box";
import Text from "~/renderer/components/Text";
import Button from "~/renderer/components/Button";
import bannerIllustration from "~/renderer/images/device-detection-nano-s.svg";
import { useDispatch, useSelector } from "react-redux";
import { openModal } from "~/renderer/actions/modals";
import { getCurrentDevice } from "~/renderer/reducers/devices";
import { accountsSelector } from "~/renderer/reducers/accounts";
import { useConditionalDebounce } from "~/renderer/hooks/useConditionalDebounce";

export const IllustrationWrapper: ThemedComponent<{}> = styled.div`
  align-self: flex-end;
  z-index: 999;
`;
const Illustration = styled.img.attrs(() => ({ src: bannerIllustration }))`
  width: 240px;
  margin-top: -40px;
  margin-right: 20px;
`;
const bannerTitle = "Hey! We’ve detected a new Ledger wallet";
const bannerDescription =
  "Accounts in your portfolio are linked to a different recovery phrase than the one set up on this wallet.";
const bannerPrimaryButton = "Add accounts";
const bannerSecondaryButton = "Can’t access your accounts?";

const DeviceDetectionBanner = ({ bottomMargin }: { bottomMargin?: boolean }) => {
  const accounts = useSelector(accountsSelector);
  const rawDevice = useSelector(getCurrentDevice);
  const dispatch = useDispatch();
  const device = useConditionalDebounce(rawDevice, 4000, key => true); // NB debounce disconnects in favor of connects
  const shouldShowBanner =
    device && device?.cookie && !accounts.find(a => a.cookie === device?.cookie);

  const onAddAccount = useCallback(() => {
    dispatch(openModal("MODAL_ADD_ACCOUNTS"));
  }, [dispatch]);

  return shouldShowBanner ? (
    <Card horizontal mt={4} mb={bottomMargin ? 5 : 0}>
      <Box vertical flex={1}>
        <Box vertical flex={1} p={26}>
          <Text ff="Inter|SemiBold" fontSize="16px" color="palette.text.shade100" mb={1}>
            {bannerTitle}
          </Text>
          <Text ff="Inter|Medium" fontSize={4} mb={3}>
            {bannerDescription}
          </Text>
          <Box horizontal mt={2}>
            <Button onClick={onAddAccount} lighterPrimary>
              {bannerPrimaryButton}
            </Button>
            <Box width={5}></Box>
            <Button secondary>{bannerSecondaryButton}</Button>
          </Box>
        </Box>
      </Box>
      <IllustrationWrapper>
        <Illustration />
      </IllustrationWrapper>
    </Card>
  ) : null;
};

export default DeviceDetectionBanner;
