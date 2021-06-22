// @flow
import React, {useCallback } from "react";
import styled from "styled-components";
import { Trans } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { closeModal } from "~/renderer/actions/modals";
import Box from "~/renderer/components/Box";
import Button from "~/renderer/components/Button";
import Modal from "~/renderer/components/Modal";
import ModalBody from "~/renderer/components/Modal/ModalBody";
import Text from "~/renderer/components/Text";
import BulletList from "~/renderer/components/BulletList";

import { getCurrentDevice } from "~/renderer/reducers/devices";
import { toggleAmnesiaForCookieSeed } from "~/renderer/actions/application";
import { setNameForCookieSeed } from "~/renderer/actions/settings";
import amnesiaIllustration from "~/renderer/images/amnesia-mode.svg";

const Illustration = styled.img.attrs(() => ({ src: amnesiaIllustration }))`
  margin-bottom: 24px;
`;

const modalTitle = "Amnesia mode";
const contentTitle = "You are now entering Amnesia mode";
const bullets = [
  "Turn on Amnesia mode to keep accounts more private",
  "Accounts in Amnesia mode will be deleted after your session",
  "You can turn off Amnesia mode at any time",
];
const gotIt = "Got it!";

const AmnesiaModal = () => {
  const dispatch = useDispatch();
  const device = useSelector(getCurrentDevice);

  const onClose = useCallback(() => {
    dispatch(closeModal("MODAL_AMNESIA"));
  }, [dispatch]);

  const onConfirmation = useCallback(() => {
    global.localStorage.setItem("amnesiaModeAcked", true);
    dispatch(toggleAmnesiaForCookieSeed({ cookieSeed: device?.cookie }));
    dispatch(setNameForCookieSeed({ cookieSeed: device?.cookie, name: "" }));
    onClose();
  }, [dispatch, onClose]);

  return (
    <Modal name="MODAL_AMNESIA" preventBackdropClick centered>
      <ModalBody
        title={modalTitle}

        render={() => (
          <Box>
            <Illustration/>
            <Box mb={3}>
              <Text ff="Inter|SemiBold" textAlign={"center"} fontSize={"15px"} color="palette.text.shade100">
                {contentTitle}
              </Text>
            </Box>
            <Box>
              <BulletList
                centered
                bullets={bullets}
              />
            </Box>
          </Box>
        )}

        renderFooter={() => (
          <Box horizontal alignItems="center" justifyContent="flex-end" flow={2}>
            <Button onClick={onClose}>
              <Trans i18nKey="common.cancel" />
            </Button>
            <Button
              primary
              onClick={onConfirmation}
            >
              {gotIt}
            </Button>
          </Box>
        )}
      />
    </Modal>
  );
};

export default AmnesiaModal;
