// @flow

import React from "react";
import styled from "styled-components";
import { useTranslation } from "react-i18next";
import type { ThemedComponent } from "~/renderer/styles/StyleProvider";

import Box from "~/renderer/components/Box";
import Text from "~/renderer/components/Text";
import Tabbable from "~/renderer/components/Box/Tabbable";

import IconCross from "~/renderer/icons/Cross";
import IconAngleLeft from "~/renderer/icons/AngleLeft";
import IconAmnesia from "~/renderer/icons/Amnesia";

const TitleContainer = styled(Box).attrs(() => ({
  vertical: true,
}))`
  position: absolute;
  left: 0;
  right: 0;
  pointer-events: none;
`;

const ModalTitle = styled(Box).attrs(({ isAmnesia }) => ({
  color: isAmnesia ? "palette.background.paper" : "palette.text.shade100",
  ff: "Inter|Medium",
  fontSize: 6,
}))`
  text-align: center;
  line-height: 1;
`;

const ModalSubTitle = styled(Box).attrs(() => ({
  color: "palette.text.shade50",
  ff: "Inter|Regular",
  fontSize: 3,
}))`
  text-align: center;
  line-height: 2;
`;

const ModalHeaderAction = styled(Tabbable).attrs(() => ({
  horizontal: true,
  alignItems: "center",
  fontSize: 3,
  p: 3,
}))`
  border-radius: 8px;
  color: ${p =>
    p.color || p.isAmnesia
      ? p.theme.colors.palette.background.paper
      : p.theme.colors.palette.text.shade60};
  top: 0;
  align-self: ${p => (p.right ? "center" : "flex-start")};
  line-height: 0;
  ${p =>
    p.onClick
      ? `
    cursor: pointer;

    &:hover,
    &:hover ${
      // $FlowFixMe
      Text
    } {
      color: ${
        p.isAmnesia ? p.theme.colors.palette.background.paper : p.theme.colors.palette.text.shade80
      };
    }

    &:active,
    &:active ${
      // $FlowFixMe
      Text
    } {
      color: ${p.theme.colors.palette.text.shade100};
    }

    ${
      // $FlowFixMe
      Text
    } {
      border-bottom: 1px dashed transparent;
    }
    &:focus span {
      border-bottom-color: none;
    }
  `
      : ""}
`;

const Container: ThemedComponent<{ hasTitle: boolean }> = styled(Box).attrs(() => ({
  horizontal: true,
  alignItems: "center",
  justifyContent: "space-between",
  p: 2,
  relative: true,
}))`
  min-height: ${p => (p.hasTitle ? 66 : 0)}px;
  background: ${p => (p.isAmnesia ? p.theme.colors.palette.text.shade100 : "transparent")};
  height: ${p => (p.isAmnesia ? "110px" : "")};
`;

const ModalHeader = ({
  children,
  subTitle,
  onBack,
  onClose,
  style = {},
  isAmnesia,
}: {
  children?: any,
  subTitle?: React$Node,
  onBack?: void => void,
  onClose?: void => void,
  style?: *,
  isAmnesia?: boolean,
}) => {
  const { t } = useTranslation();

  return (
    <Container isAmnesia={isAmnesia} hasTitle={Boolean(children || subTitle)} style={style}>
      {onBack ? (
        <ModalHeaderAction isAmnesia={isAmnesia} onClick={onBack} id="modal-back-button">
          <IconAngleLeft size={12} />
          <Text
            ff="Inter|Medium"
            fontSize={4}
            color={isAmnesia ? "palette.background.paper" : "palette.text.shade40"}
          >
            {t("common.back")}
          </Text>
        </ModalHeaderAction>
      ) : (
        <div />
      )}
      {children || subTitle ? (
        <TitleContainer>
          {subTitle && <ModalSubTitle id="modal-subtitle">{subTitle}</ModalSubTitle>}
          {isAmnesia ? (
            <Box
              color={isAmnesia ? "palette.background.paper" : "palette.text.shade40"}
              alignItems={"center"}
              justifyContent={"center"}
              flex={1}
              mb={2}
              mt={2}
            >
              <IconAmnesia size={16} color={"white"} />
            </Box>
          ) : null}
          <ModalTitle
            id="modal-title"
            isAmnesia={isAmnesia}
            color={isAmnesia ? "palette.background.paper" : "palette.text.shade40"}
          >
            {children}
          </ModalTitle>
        </TitleContainer>
      ) : null}
      {onClose ? (
        <ModalHeaderAction isAmnesia={isAmnesia} right onClick={onClose} id="modal-close-button">
          <IconCross size={16} />
        </ModalHeaderAction>
      ) : (
        <div />
      )}
    </Container>
  );
};

export default ModalHeader;
