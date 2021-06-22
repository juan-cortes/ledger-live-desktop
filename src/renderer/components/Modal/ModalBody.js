// @flow

import React, { useEffect } from "react";

import { getCurrentDevice } from "~/renderer/reducers/devices";
import { amnesiaCookiesSelector } from "~/renderer/reducers/application";
import { useSelector } from "react-redux";

import ModalContent from "./ModalContent";
import ModalHeader from "./ModalHeader";
import ModalFooter from "./ModalFooter";
import { visibleModalsSelector } from "~/renderer/ModalsLayer";
import type { RenderProps } from ".";

type Props = {
  title?: React$Node,
  subTitle?: React$Node,
  headerStyle?: *,
  onBack?: void => void,
  onClose?: void => void,
  render?: (?RenderProps) => any,
  renderFooter?: (?RenderProps) => any,
  modalFooterStyle?: *,
  renderProps?: RenderProps,
  noScroll?: boolean,
  refocusWhenChange?: any,
};

const ModalBody = ({
  refocusWhenChange,
  onBack,
  onClose,
  title,
  subTitle,
  headerStyle,
  render,
  renderFooter,
  renderProps,
  noScroll,
  modalFooterStyle,
}: any) => {
  const content = React.createRef();
  useEffect(() => {
    content.current && content.current.focus();
  }, [content, refocusWhenChange]);

  const device = useSelector(getCurrentDevice);
  const amnesiaCookies = useSelector(amnesiaCookiesSelector);
  // Hackathon, style hijacking for amnesia + add account
  const visibleModals = useSelector(visibleModalsSelector);
  const isAddAccount = visibleModals.find(vm => vm.name === "MODAL_ADD_ACCOUNTS");
  const isAmnesia = amnesiaCookies.includes(device?.cookie) && isAddAccount;

  const renderedFooter = renderFooter && renderFooter(renderProps);
  return (
    <>
      <ModalHeader
        isAmnesia={isAmnesia}
        subTitle={subTitle}
        onBack={onBack}
        onClose={onClose}
        style={headerStyle}
      >
        {title || null}
      </ModalHeader>
      <ModalContent isAmnesia={isAmnesia} ref={content} noScroll={noScroll}>
        {render && render(renderProps)}
      </ModalContent>
      {renderedFooter && (
        <ModalFooter isAmnesia={isAmnesia} style={modalFooterStyle}>
          {renderedFooter}
        </ModalFooter>
      )}
    </>
  );
};

export default ModalBody;
