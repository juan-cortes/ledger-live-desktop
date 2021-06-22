// @flow

import React, { useState, useEffect, useMemo } from "react";
import type { AccountLike, Account } from "@ledgerhq/live-common/lib/types";
import type { PortfolioRange } from "@ledgerhq/live-common/lib/portfolio/v2/types";
import styled from "styled-components";
import AccountItem from "../AccountRowItem";
import AccountItemPlaceholder from "../AccountRowItem/Placeholder";
import { useTransition, animated } from "react-spring";
import { useSelector } from "react-redux";
import { useDebounce } from "@ledgerhq/live-common/lib//hooks/useDebounce";

import { getCurrentDevice } from "~/renderer/reducers/devices";
import { amnesiaCookiesSelector } from "~/renderer/reducers/application";

type Props = {
  visibleAccounts: Account[],
  hiddenAccounts: Account[],
  onAccountClick: AccountLike => void,
  lookupParentAccount: (id: string) => ?Account,
  range: PortfolioRange,
  showNewAccount: boolean,
  search?: string,
};

const ListBody = ({
  visibleAccounts,
  showNewAccount,
  hiddenAccounts,
  range,
  onAccountClick,
  lookupParentAccount,
  search,
}: Props) => {
  const amnesiaCookies = useSelector(amnesiaCookiesSelector);
  const rawDevice = useSelector(getCurrentDevice);
  const device = useDebounce(rawDevice, 3000);
  const [items, setItems] = useState([]);

  useEffect(() => {
    setItems(
      [...visibleAccounts, ...hiddenAccounts]
        .filter(Boolean)
        .sort((a, b) => {
          if (a.cookie === b.cookie) return 0;
          if (a.cookie === device?.cookie) return -1;
          if (b.cookie === device?.cookie) return 1;
          return 0;
        })
        .map(account => {
          const cookie = device?.cookie && account.cookie === device.cookie;

          return {
            account,
            cookie,
            height: 80,
            amnesia: amnesiaCookies.includes(account?.cookie),
            css: account.id,
          };
        }),
    );
  }, [visibleAccounts, hiddenAccounts, device, amnesiaCookies]);

  const listItems = useMemo(
    () =>
      items.map((child, i) => {
        const xy = [0, i * child.height]; // Im just butchering the masonery approach on grid, yolo
        return { ...child, xy, width: "100%", height: child.height };
      }),
    [items],
  );

  const transitions = useTransition(listItems, i => i.css, {
    from: ({ xy, height, width }) => ({ xy, height, width, opacity: 0 }),
    enter: ({ xy, height, width }) => ({ xy, height, width, opacity: 1 }),
    update: ({ xy }) => ({ xy }),
    leave: { opacity: 0 },
    config: { mass: 5, tension: 500, friction: 100 },
    trail: 25,
  });

  return (
    <List id="accounts-list">
      {transitions.map(({ item, props: { xy, ...rest }, key }) => (
        <animated.div
          key={key}
          style={{ transform: xy.interpolate((x, y) => `translate3d(${x}px,${y}px,0)`), ...rest }}
        >
          {!item.account ? (
            <AccountItemPlaceholder key="placeholder" />
          ) : (
            <AccountItem
              key={item.account.id}
              account={item.account}
              search={search}
              parentAccount={
                item.account.type !== "Account" ? lookupParentAccount(item.account.parentId) : null
              }
              range={range}
              onClick={onAccountClick}
              amnesia={item.amnesia}
              cookie={item.cookie}
            />
          )}
        </animated.div>
      ))}
    </List>
  );
};

const List = styled.div`
  position: relative;
  width: 100%;
  height: 100%;

  & > div {
    position: absolute;
    will-change: transform, width, height, opacity;
  }

  & > div > div {
    position: relative;
    width: 100%;
    height: 100%;
  }
`;


export default ListBody;
