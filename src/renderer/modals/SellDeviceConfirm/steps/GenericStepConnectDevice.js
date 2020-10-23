// @flow

import React, { useMemo, useState } from "react";
import { Trans } from "react-i18next";
import type { Device } from "@ledgerhq/live-common/lib/hw/actions/types";
import DeviceAction from "~/renderer/components/DeviceAction";
import StepProgress from "~/renderer/components/StepProgress";
import { createAction } from "@ledgerhq/live-common/lib/hw/actions/transaction";
import { toTransactionRaw } from "@ledgerhq/live-common/lib/transaction";

import type {
  Account,
  AccountLike,
  Transaction,
  TransactionStatus,
  Operation,
  SignedOperation,
} from "@ledgerhq/live-common/lib/types";
import { command } from "~/renderer/commands";
import { getEnv } from "@ledgerhq/live-common/lib/env";
import { mockedEventEmitter } from "~/renderer/components/DebugMock";
import { DeviceBlocker } from "~/renderer/components/DeviceAction/DeviceBlocker";
import { createAction as initSellCreateAction } from "@ledgerhq/live-common/lib/hw/actions/initSell";
import { toAccountRaw, toAccountLikeRaw } from "@ledgerhq/live-common/lib/account/serialization";
import { toTransactionStatusRaw } from "@ledgerhq/live-common/lib/transaction/status";
import Box from "~/renderer/components/Box";
import BigSpinner from "~/renderer/components/BigSpinner";
import { getAccountBridge } from "@ledgerhq/live-common/lib/bridge";
import { getMainAccount } from "@ledgerhq/live-common/lib/account/helpers";

const checkSignatureAndPrepare = command("checkSignatureAndPrepare");
const connectAppExec = command("connectApp");
const initSellExec = command("getTransactionId");

const action = createAction(getEnv("MOCK") ? mockedEventEmitter : connectAppExec);

const onError = err => console.log(err);

const Result = ({
  signedOperation,
  device,
}: {
  signedOperation: ?SignedOperation,
  device: Device,
}) => {
  if (!signedOperation) return null;
  return (
    <StepProgress modelId={device.modelId}>
      <DeviceBlocker />
      <Trans i18nKey="send.steps.confirmation.pending.title" />
    </StepProgress>
  );
};

export default function StepConnectDevice({
  account,
  parentAccount,
  transaction,
  status,
  transitionTo,
  onOperationBroadcasted,
  onTransactionError,
  setSigned,
  setTransactionId,
}: {
  transitionTo: string => void,
  account: ?AccountLike,
  parentAccount: ?Account,
  transaction: ?Transaction,
  status: TransactionStatus,
  onTransactionError: Error => void,
  onOperationBroadcasted: Operation => void,
  setSigned: boolean => void,
  setTransactionId: string => Promise<any>,
}) {
  const tokenCurrency = account && account.type === "TokenAccount" && account.token;
  const [sellData, setSellData] = useState(null);
  const [signedOperation, setSignedOperation] = useState(false);

  const action2 = useMemo(
    () =>
      initSellCreateAction(
        getEnv("MOCK") ? mockedEventEmitter : connectAppExec,
        getEnv("MOCK")
          ? mockedEventEmitter
          : ({ deviceId }) =>
              initSellExec({
                deviceId,
              }),
        ({
          deviceId,
          transaction,
          binaryPayload,
          receiver,
          payloadSignature,
          account,
          parentAccount,
          status,
        }) =>
          checkSignatureAndPrepare({
            deviceId,
            transaction: toTransactionRaw(transaction),
            binaryPayload,
            receiver,
            payloadSignature,
            account: toAccountLikeRaw(account),
            parentAccount: parentAccount ? toAccountRaw(parentAccount) : undefined,
            status: toTransactionStatusRaw(status),
          }),
        setTransactionId,
      ),
    [setTransactionId],
  );

  if (!transaction || !account) return null;

  if (signedOperation) {
    console.log({ signedOperation });
    return (
      <Box alignItems={"center"} justifyContent={"center"} p={20}>
        <BigSpinner size={40} />
      </Box>
    );
  }

  if (!sellData) {
    return (
      <DeviceAction
        action={action2}
        request={{
          tokenCurrency,
          parentAccount,
          account,
          transaction,
          status,
        }}
        Result={Result}
        onResult={({ initSellResult, initSellError, ...rest }) => {
          console.log({ initSellResult });
          if (initSellError) {
            onError(initSellError);
          } else {
            setSellData(initSellResult);
          }
        }}
      />
    );
  }

  console.log({ sellData, transaction, account, parentAccount });

  const bridge = getAccountBridge(account, parentAccount);

  bridge
    .getTransactionStatus(getMainAccount(account, parentAccount), sellData.transaction)
    .then(status => {
      console.log("STATUS: ", status);
    });

  return (
    <DeviceAction
      key={"send"}
      action={action}
      request={{
        tokenCurrency,
        parentAccount,
        account,
        transaction: sellData.transaction,
        appName: "Exchange",
      }}
      Result={Result}
      onResult={({ signedOperation, transactionSignError }) => {
        if (transactionSignError) {
          onError(transactionSignError);
        } else {
          setSignedOperation(signedOperation);
        }
      }}
    />
  );
}
