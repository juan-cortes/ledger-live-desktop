// @flow
import React from "react";
import Box from "~/renderer/components/Box";
import Button from "~/renderer/components/Button";
import ArrowsUpDown from "~/renderer/icons/ArrowsUpDown";
import styled from "styled-components";
import FromRow from "./FromRow";
import ToRow from "./ToRow";

const RoundButton = styled(Button)`
  padding: 8px;
  border-radius: 9999px;
  height: initial;
`;
function SwapButton() {
  return (
    <RoundButton lighterPrimary>
      <ArrowsUpDown size={14} />
    </RoundButton>
  );
}

export default function FormInputs() {
  const [fromAccount, setFromAccount] = React.useState(null);
  const [fromAmount, setFromAmount] = React.useState(null);
  const [toCurrency, setToCurrency] = React.useState(null);
  const [toAmount, setToAmount] = React.useState(null);

  return (
    <>
      <FromRow
        fromAccount={fromAccount}
        setFromAccount={setFromAccount}
        fromAmount={fromAmount}
        setFromAmount={setFromAmount}
      />

      <Box horizontal justifyContent="center" alignContent="center">
        <SwapButton />
      </Box>
      <ToRow
        toCurrency={toCurrency}
        // $FlowFixMe
        setToCurrency={setToCurrency}
        toAmount={toAmount}
        setToAmount={setToAmount}
      />
    </>
  );
}
