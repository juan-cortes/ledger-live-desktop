// @flow
import React, { useRef, useCallback, useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";
import styled from "styled-components";
import { PasswordIncorrectError } from "@ledgerhq/errors";
import { setEncryptionKey, isEncryptionKeyCorrect, hasBeenDecrypted } from "~/renderer/storage";
import IconTriangleWarning from "~/renderer/icons/TriangleWarning";
import { useHardReset } from "~/renderer/reset";
import { fetchAccounts } from "~/renderer/actions/accounts";
import { unlock } from "~/renderer/actions/application";
import { isLocked as isLockedSelector } from "~/renderer/reducers/application";
import { accountsSelector } from "~/renderer/reducers/accounts";
import { trustedCookieSeedsSelector } from "~/renderer/reducers/settings";
import { getCurrentDevice } from "~/renderer/reducers/devices";
import Box from "~/renderer/components/Box";
import Spinner from "~/renderer/components/Spinner";
import Text from "~/renderer/components/Text";
import Alert from "~/renderer/components/Alert";
import InputPassword from "~/renderer/components/InputPassword";
import LedgerLiveLogo from "~/renderer/components/LedgerLiveLogo";
import Button from "~/renderer/components/Button";
import ConfirmModal from "~/renderer/modals/ConfirmModal";
import type { ThemedComponent } from "~/renderer/styles/StyleProvider";
import IconArrowRight from "~/renderer/icons/ArrowRight";
import IconNanoS from "~/renderer/icons/NanoSFold";
import LedgerLiveImg from "~/renderer/images/ledgerlive-logo.svg";
import Image from "./Image";

export default function IsUnlocked({ children }: { children: any }) {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const hardReset = useHardReset();
  const [inputValue, setInputValue] = useState<InputValue>({ password: "" });
  const [incorrectPassword, setIncorrectPassword] = useState<MaybeError>(null);
  const [isHardResetting, setIsHardResetting] = useState(false);
  const [isHardResetModalOpened, setIsHardResetModalOpened] = useState(false);
  const isLocked = useSelector(isLockedSelector);

  // HACKATHON, soft unlock with trusted device.
  const accounts = useSelector(accountsSelector);
  const isSoftLocked = accounts.length;
  const [isUnlocking, setIsUnlocking] = useState(false);
  const device = useSelector(getCurrentDevice);
  const [needsDisconnect, setNeedsDisconnect] = useState(!!device);
  const [failed, setFailed] = useState(false);
  const trustedCookieSeeds = useSelector(trustedCookieSeedsSelector);

  useEffect(() => {
    if (isLocked && needsDisconnect && !device) {
      setNeedsDisconnect(false);
    } else if (!isLocked) {
      setIsUnlocking(false);
      setFailed(false);
    }
  }, [device, isLocked, needsDisconnect]);

  useEffect(() => {
    // fake a delay after we connect to convey we are unlocking, the needs disconnect can be bypassed by
    // entering an application but it's ok for the demo
    if (!needsDisconnect && device?.cookie) {
      setIsUnlocking(true);
      const programmedUnlock = setTimeout(() => {
        if (trustedCookieSeeds.includes(device.cookie)) {
          dispatch(unlock());
          setFailed(false);
        } else {
          setFailed(true);
        }
        setNeedsDisconnect(true);
        setIsUnlocking(false);
      }, 3000);
      return () => clearTimeout(programmedUnlock);
    }
  }, [isLocked, device, dispatch, trustedCookieSeeds, needsDisconnect]);

  const handleChangeInput = useCallback(
    (key: $Keys<InputValue>) => (value: $Values<InputValue>) => {
      setInputValue({
        ...inputValue,
        [key]: value,
      });
      setIncorrectPassword(null);
    },
    [inputValue],
  );

  const handleSubmit = useCallback(
    async (e: SyntheticEvent<HTMLFormElement>) => {
      e.preventDefault();

      const isAccountDecrypted = await hasBeenDecrypted("app", "accounts");
      try {
        if (!isAccountDecrypted) {
          await setEncryptionKey("app", "accounts", inputValue.password);
          await dispatch(fetchAccounts());
        } else if (!(await isEncryptionKeyCorrect("app", "accounts", inputValue.password))) {
          throw new PasswordIncorrectError();
        }
        dispatch(unlock());
      } catch (error) {
        setIncorrectPassword(new PasswordIncorrectError());
      }
      setInputValue({
        password: "",
      });
    },
    [inputValue, dispatch],
  );

  const handleOpenHardResetModal = useCallback(() => setIsHardResetModalOpened(true), [
    setIsHardResetModalOpened,
  ]);

  const handleCloseHardResetModal = useCallback(() => setIsHardResetModalOpened(false), [
    setIsHardResetModalOpened,
  ]);

  const handleHardReset = useCallback(async () => {
    setIsHardResetting(true);
    try {
      await hardReset();
      window.api.reloadRenderer();
    } catch (error) {
      setIsHardResetting(false);
    }
  }, [hardReset]);

  useEffect(() => {
    let subscribed = false;
    const onKeyDown = () => {
      const input = document.getElementById("lockscreen-password-input");
      if (input) {
        input.focus();
      }
    };
    if (isLocked) {
      subscribed = true;
      window.addEventListener("keydown", onKeyDown);
    }
    return () => {
      if (subscribed) {
        window.removeEventListener("keydown", onKeyDown);
      }
    };
  }, [isLocked]);

  if (isLocked) {
    return (
      <Box sticky alignItems="center" justifyContent="center" id="lockscreen-container">
        <form onSubmit={handleSubmit} style={{ width: 600 }}>
          <Box alignItems="center">
            <LedgerLiveLogo
              style={{ marginBottom: 40 }}
              icon={
                <Image resource={LedgerLiveImg} alt="" draggable="false" width={50} height={50} />
              }
            />
            <PageTitle>{t("common.lockScreen.title")}</PageTitle>
            <LockScreenDesc>
              {t("common.lockScreen.subTitle")}
              <br />
              {t("common.lockScreen.description")}
            </LockScreenDesc>
            <Box horizontal alignItems="center">
              <Box style={{ width: 280 }}>
                <InputPassword
                  autoFocus
                  placeholder={t("common.lockScreen.inputPlaceholder")}
                  type="password"
                  onChange={handleChangeInput("password")}
                  value={inputValue.password}
                  error={incorrectPassword}
                  id="lockscreen-password-input"
                />
              </Box>
              <Box ml={2}>
                <Button
                  onClick={handleSubmit}
                  primary
                  flow={1}
                  style={{ width: 46, height: 46, padding: 0, justifyContent: "center" }}
                  id="lockscreen-login-button"
                >
                  <Box alignItems="center">
                    <IconArrowRight size={20} />
                  </Box>
                </Button>
              </Box>
            </Box>

            <Button
              type="button"
              mt={3}
              mb={5}
              small
              onClick={handleOpenHardResetModal}
              id="lockscreen-forgotten-button"
            >
              {t("common.lockScreen.lostPassword")}
            </Button>
            {isSoftLocked ? (
              <Box style={{ width: "100%" }} p={10}>
                <Alert type={failed ? "error" : "hint"} noIcon>
                  <Box
                    style={{ width: "100%" }}
                    horizontal
                    alignItems={"center"}
                    justifyContent={"center"}
                  >
                    {!isUnlocking ? (
                      <>
                        <IconNanoS size={22} />
                        <Text ml={2}>
                          {failed
                            ? "The connected device is not trusted to unlock Ledger Live"
                            : needsDisconnect
                            ? "To unlock using the connected device, please reconnect it"
                            : "Remember you can also connect your Nano S to access Ledger Live"}
                        </Text>
                      </>
                    ) : (
                      <Spinner size={22} />
                    )}
                  </Box>
                </Alert>
              </Box>
            ) : null}
          </Box>
        </form>
        <ConfirmModal
          analyticsName="HardReset"
          isDanger
          centered
          isLoading={isHardResetting}
          isOpened={isHardResetModalOpened}
          onClose={handleCloseHardResetModal}
          onReject={handleCloseHardResetModal}
          onConfirm={handleHardReset}
          confirmText={t("common.reset")}
          title={t("settings.hardResetModal.title")}
          desc={t("settings.hardResetModal.desc")}
          renderIcon={HardResetIcon}
        />
      </Box>
    );
  }

  return children;
}

type InputValue = {
  password: string,
};

type MaybeError = ?Error;

export const PageTitle: ThemedComponent<{}> = styled(Box).attrs(() => ({
  ff: "Inter|Regular",
  fontSize: 7,
  color: "palette.text.shade100",
}))``;

export const LockScreenDesc: ThemedComponent<{}> = styled(Box).attrs(() => ({
  ff: "Inter|Regular",
  fontSize: 4,
  textAlign: "center",
  color: "palette.text.shade80",
}))`
  margin: 10px auto 25px;
`;

const IconWrapperCircle = styled(Box)`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: #ea2e4919;
  align-items: center;
  justify-content: center;
`;

const HardResetIcon = () => (
  <IconWrapperCircle color="alertRed">
    <IconTriangleWarning width={23} height={21} />
  </IconWrapperCircle>
);
