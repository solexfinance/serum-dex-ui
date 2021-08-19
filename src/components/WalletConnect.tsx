import React from 'react';
import { Dropdown, Menu } from 'antd';
import styled from 'styled-components';
import { useWallet } from '../utils/wallet';
import LinkAddress from './LinkAddress';

const Button = styled(Dropdown.Button)`
  & button {
    height: 40px;
    border: none;
    background-color: rgba(0, 253, 187, 0.2);
    color: #00fdbb;
  }
`;

export default function WalletConnect() {
  const { connected, wallet, select, connect, disconnect } = useWallet();
  const publicKey = (connected && wallet?.publicKey?.toBase58()) || '';

  const menu = (
    <Menu>
      {connected && <LinkAddress shorten={true} address={publicKey} />}
      <Menu.Item key="3" onClick={select}>
        Change Wallet
      </Menu.Item>
    </Menu>
  );

  return (
    <Button onClick={connected ? disconnect : connect} overlay={menu}>
      {connected ? 'Disconnect' : 'Connect'}
    </Button>
  );
}
