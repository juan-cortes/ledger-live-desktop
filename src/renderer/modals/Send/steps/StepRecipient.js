// @flow

import React, { useState, useCallback, PureComponent } from "react";
import { getAccountCurrency, getMainAccount } from "@ledgerhq/live-common/lib/account";
import { getAccountBridge } from "@ledgerhq/live-common/lib/bridge";

import TrackPage from "~/renderer/analytics/TrackPage";
import Box from "~/renderer/components/Box";
import Button from "~/renderer/components/Button";
import CurrencyDownStatusAlert from "~/renderer/components/CurrencyDownStatusAlert";
import ErrorBanner from "~/renderer/components/ErrorBanner";
import Label from "~/renderer/components/Label";
import SelectAccount from "~/renderer/components/SelectAccount";

import SendRecipientFields, { getFields } from "../SendRecipientFields";
import RecipientField from "../fields/RecipientField";

import type { StepProps } from "../types";

import StepRecipientSeparator from "~/renderer/components/StepRecipientSeparator";

const StepRecipient = ({
  t,
  account,
  parentAccount,
  openedFromAccount,
  transaction,
  onChangeAccount,
  onChangeTransaction,
  error,
  status,
  bridgePending,
  maybeRecipient,
  onResetMaybeRecipient,
  currencyName,
  isSelfSend,
}: StepProps) => {
  const mainAccount = account ? getMainAccount(account, parentAccount) : null;
  const [recipient, setRecipient] = useState(null);

  const onSetRecipient = useCallback(
    recipient => {
      if (!account) return;
      const bridge = getAccountBridge(account, null);
      onChangeTransaction(
        bridge.updateTransaction(transaction, { recipient: recipient?.freshAddress }),
      );
      setRecipient(recipient);
    },
    [account, onChangeTransaction, transaction],
  );

  const filter = useCallback(
    a => {
      if (!account) return false;
      const sourceCurrency = getAccountCurrency(account);
      const thisCurrency = getAccountCurrency(a);
      return (
        a.id !== account.id && a.cookie === account.cookie && sourceCurrency.id === thisCurrency.id
      );
    },
    [account],
  );

  if (!status) return null;
  return (
    <Box flow={4}>
      <TrackPage category="Send Flow" name="Step Recipient" currencyName={currencyName} />
      {mainAccount ? <CurrencyDownStatusAlert currencies={[mainAccount.currency]} /> : null}
      {error ? <ErrorBanner error={error} /> : null}
      <Box flow={1}>
        <Label>{t("send.steps.details.selectAccountDebit")}</Label>
        <SelectAccount
          withSubAccounts
          enforceHideEmptySubAccounts
          autoFocus={!openedFromAccount}
          onChange={onChangeAccount}
          value={account}
        />
      </Box>
      <StepRecipientSeparator />
      {account && transaction && mainAccount && (
        <>
          {isSelfSend ? (
            <SelectAccount
              filter={filter}
              withSubAccounts
              enforceHideEmptySubAccounts
              autoFocus={!openedFromAccount}
              onChange={onSetRecipient}
              value={recipient}
            />
          ) : (
            <RecipientField
              status={status}
              autoFocus={openedFromAccount}
              account={mainAccount}
              transaction={transaction}
              onChangeTransaction={onChangeTransaction}
              bridgePending={bridgePending}
              t={t}
              initValue={maybeRecipient}
              resetInitValue={onResetMaybeRecipient}
            />
          )}
          <SendRecipientFields
            account={mainAccount}
            status={status}
            transaction={transaction}
            onChange={onChangeTransaction}
          />
        </>
      )}
    </Box>
  );
};

export class StepRecipientFooter extends PureComponent<StepProps> {
  onNext = async () => {
    const { transitionTo } = this.props;
    transitionTo("amount");
  };

  render() {
    const { t, account, parentAccount, status, bridgePending } = this.props;
    const { errors } = status;

    const mainAccount = account ? getMainAccount(account, parentAccount) : null;

    const isTerminated = mainAccount && mainAccount.currency.terminated;
    const fields = ["recipient"].concat(mainAccount ? getFields(mainAccount) : []);
    const hasFieldError = Object.keys(errors).some(name => fields.includes(name));
    const canNext = !bridgePending && !hasFieldError && !isTerminated;

    return (
      <>
        <Button
          id={"send-recipient-continue-button"}
          isLoading={bridgePending}
          primary
          disabled={!canNext}
          onClick={this.onNext}
        >
          {t("common.continue")}
        </Button>
      </>
    );
  }
}

export default StepRecipient;
