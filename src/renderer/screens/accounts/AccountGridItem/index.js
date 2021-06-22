// @flow
import React, { useCallback } from "react";
import styled from "styled-components";
import type { TokenAccount, Account } from "@ledgerhq/live-common/lib/types";
import type { PortfolioRange } from "@ledgerhq/live-common/lib/portfolio/v2/types";
import Box from "~/renderer/components/Box";
import AccountCardHeader from "./Header";
import AccountCardBody from "./Body";
import AccountContextMenu from "~/renderer/components/ContextMenu/AccountContextMenu";
import type { ThemedComponent } from "~/renderer/styles/StyleProvider";
type Props = {
  hidden?: boolean,
  account: TokenAccount | Account,
  parentAccount: ?Account,
  onClick: (Account | TokenAccount, ?Account) => void,
  range: PortfolioRange,
};

export default function AccountCard({
  account,
  parentAccount,
  range,
  hidden,
  onClick: onClickProp,
  ...props
}: Props) {
  const onClick = useCallback(() => {
    onClickProp(account, parentAccount);
  }, [account, parentAccount, onClickProp]);

  return (
    <AccountContextMenu account={account} parentAccount={parentAccount}>
      <Card {...props} style={hidden ? { display: "none" } : {}} p={3} onClick={onClick}>
        <AccountCardHeader
          amnesia={props?.amnesia}
          account={account}
          parentAccount={parentAccount}
        />
        <AccountCardBody account={account} parentAccount={parentAccount} range={range} />
      </Card>
    </AccountContextMenu>
  );
}

const Card: ThemedComponent<{}> = styled(Box).attrs(() => ({
  bg: "palette.background.paper",
  p: 3,
  boxShadow: 0,
  borderRadius: 1,
}))`
  margin: 10px;
  cursor: pointer;
  border: ${p => (p.amnesia ? 2 : 1)}px solid
    ${p => (p.amnesia ? "black" : p.cookie ? p.theme.colors.wallet : "transparent")};
  transition: background-color ease-in-out 200ms;
  :hover {
    border-color: ${p =>
      p.amnesia ? "black" : p.cookie ? p.theme.colors.wallet : p.theme.colors.palette.text.shade20};
    ${p => (p.cookie ? "box-shadow: 0px 0px 0px 4px rgba(100, 144, 241, 0.3)" : "")};
  }
  :active {
    border-color: ${p => p.theme.colors.palette.text.shade20};
    background: ${p => p.theme.colors.palette.action.hover};
  }
`;
