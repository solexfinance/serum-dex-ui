import BalancesTable from './BalancesTable';
import OpenOrderTable from './OpenOrderTable';
import styled from 'styled-components';
import React from 'react';
import { Tabs } from 'antd';
import FillsTable from './FillsTable';
import FloatingElement from '../layout/FloatingElement';
import FeesTable from './FeesTable';
import { useOpenOrders, useBalances, useMarket } from '../../utils/markets';

const TabsContainer = styled(Tabs)`
  color: #848e9c;

  .ant-tabs-ink-bar {
    display: none;
  }

  .ant-tabs-tab:hover {
    color: #00fdbb;
  }
`;

const { TabPane } = Tabs;

export default function Index() {
  const { market } = useMarket();
  return (
    <FloatingElement style={{ flex: 1, paddingTop: 4 }}>
      <TabsContainer
        defaultActiveKey="orders"
        tabBarStyle={{ borderBottom: 'unset' }}
      >
        <TabPane tab="Open Orders" key="orders">
          <OpenOrdersTab />
        </TabPane>
        <TabPane tab="Recent Trade History" key="fills">
          <FillsTable />
        </TabPane>
        <TabPane tab="Balances" key="balances">
          <BalancesTab />
        </TabPane>
        {market && market.supportsSrmFeeDiscounts ? (
          <TabPane tab="Fee discounts" key="fees">
            <FeesTable />
          </TabPane>
        ) : null}
      </TabsContainer>
    </FloatingElement>
  );
}

const OpenOrdersTab = () => {
  const openOrders = useOpenOrders();

  return <OpenOrderTable openOrders={openOrders} />;
};

const BalancesTab = () => {
  const balances = useBalances();

  return <BalancesTable balances={balances} />;
};
