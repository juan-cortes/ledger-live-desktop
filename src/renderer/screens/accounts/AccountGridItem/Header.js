// @flow

import React, { PureComponent } from "react";
import type { Account, TokenAccount } from "@ledgerhq/live-common/lib/types";
import {
  getAccountCurrency,
  getAccountUnit,
  getAccountName,
} from "@ledgerhq/live-common/lib/account";
import Box from "~/renderer/components/Box";
import Ellipsis from "~/renderer/components/Ellipsis";
import Bar from "~/renderer/components/Bar";
import Text from "~/renderer/components/Text";
import FormattedVal from "~/renderer/components/FormattedVal";
import ParentCryptoCurrencyIcon from "~/renderer/components/ParentCryptoCurrencyIcon";
import Star from "~/renderer/components/Stars/Star";
import Tooltip from "~/renderer/components/Tooltip";
import useTheme from "~/renderer/hooks/useTheme";
import styled from "styled-components";
import IconAmnesia from "~/renderer/icons/Amnesia";
import AccountSyncStatusIndicator from "../AccountSyncStatusIndicator";
import AccountTagDerivationMode from "~/renderer/components/AccountTagDerivationMode";

// HACKATHON notes, shame juan, shame, you know better
const Amnesia = styled.div`
  position: absolute;
  top: 10px;
  right: 10px;
  width: 32px;
  height: 32px;
  border-radius: 5px;
  border-top-left-radius: 0;
  border-bottom-right-radius: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${p => p.theme.colors.palette.text.shade100};
  color: ${p => p.theme.colors.palette.background.paper};
`;

class HeadText extends PureComponent<{
  account: Account | TokenAccount,
  title: string,
  name: string,
}> {
  render() {
    const { title, name, account } = this.props;

    return (
      <Box style={{ flex: 1, alignItems: "flex-start" }}>
        <Box
          style={{ textTransform: "uppercase" }}
          horizontal
          alignItems="center"
          fontSize={10}
          color="palette.text.shade80"
        >
          {title}
          <AccountTagDerivationMode account={account} />
        </Box>
        <Tooltip content={name} delay={1200}>
          <Ellipsis>
            <Text fontSize={13} color="palette.text.shade100">
              {name}
            </Text>
          </Ellipsis>
        </Tooltip>
      </Box>
    );
  }
}

const Header = ({
  account,
  parentAccount,
  amnesia,
}: {
  account: Account | TokenAccount,
  parentAccount: ?Account,
  amnesia?: boolean,
}) => {
  const currency = getAccountCurrency(account);
  const unit = getAccountUnit(account);
  const name = getAccountName(account);
  const black = useTheme("colors.palette.text.shade100");

  let title;
  switch (account.type) {
    case "Account":
    case "AccountChild":
      title = currency.name;
      break;
    case "TokenAccount":
      title = "token";
      break;
    default:
      title = "";
  }

  return (
    <Box flow={4}>
      <Box horizontal ff="Inter|SemiBold" flow={3} alignItems="center">
        {amnesia ? (
          <Amnesia>
            <IconAmnesia size={16} />
          </Amnesia>
        ) : null}
        <ParentCryptoCurrencyIcon currency={currency} withTooltip />
        <HeadText account={account} name={name} title={title} />
        <AccountSyncStatusIndicator
          accountId={(parentAccount && parentAccount.id) || account.id}
          account={account}
        />
        <Star
          amnesia={amnesia}
          accountId={account.id}
          parentId={account.type !== "Account" ? account.parentId : undefined}
        />
      </Box>
      <Bar size={1} color={amnesia ? black : "palette.divider"} />
      <Box justifyContent="center">
        <FormattedVal
          alwaysShowSign={false}
          animateTicker={false}
          ellipsis
          color="palette.text.shade100"
          unit={unit}
          showCode
          val={account.balance}
        />
      </Box>
    </Box>
  );
};

export default Header;
