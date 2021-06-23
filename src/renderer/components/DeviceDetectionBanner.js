import React from "react";
import styled from "styled-components";
import Card from "~/renderer/components/Box/Card";
import Box from "~/renderer/components/Box";
import Text from "~/renderer/components/Text";
import Button from "~/renderer/components/Button";
import bannerIllustration from "~/renderer/images/device-detection-nano-s.svg";

export const IllustrationWrapper: ThemedComponent<{}> = styled.div`
  width: 50px;
  align-self: flex-end;
`;
const Illustration = styled.img.attrs(() => ({ src: bannerIllustration }))``;
const bannerTitle = "Hey! We’ve detected a new Ledger wallet";
const bannerDescription = "Accounts in your portfolio are linked to a different recovery phrase than the one set up on this wallet.";
const bannerPrimaryButton = "Add accounts";
const bannerSecondaryButton = "Can’t access your accounts?";

const DeviceDetectionBanner = () => {

  return (
    <Card horizontal mb={5}>
      <Box vertical width={540}>
        <Box vertical flex={1} p={26}>
          <Text ff="Inter|SemiBold" fontSize="16px" color="palette.text.shade100" mb={1}>
            {bannerTitle}
          </Text>
          <Text ff="Inter|Medium" fontSize={4} mb={3}>
            {bannerDescription}
          </Text>
          <Box horizontal>
            <Button lighterPrimary>
              {bannerPrimaryButton}
            </Button>
            <Box width={5}></Box>
            <Button secondary>
              {bannerSecondaryButton}
            </Button>
          </Box>
        </Box>
      </Box>
      <IllustrationWrapper>
        <Illustration/>
      </IllustrationWrapper>
    </Card>
  );
}

export default DeviceDetectionBanner;
