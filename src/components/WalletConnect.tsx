import React from 'react';
import { Dropdown, Menu, Button } from 'antd';
import styled from 'styled-components';
import { useWallet } from '../utils/wallet';
import LinkAddress from './LinkAddress';

const DropdownButton = styled(Dropdown.Button)`
  & button {
    height: 40px;
    border: none;
    background-color: rgba(0, 253, 187, 0.2);
    color: #00fdbb;
  }

  button:hover,
  button:active,
  button:focus {
    color: #00fdbb;
    background-color: rgba(0, 253, 187, 0.2);
  }
`;

const ConnectButton = styled(Button)`
  background-color: rgba(0, 253, 187, 0.2);
  border-width: 0px;
  color: #00fdbb;
  font-size: 16px;
  padding: 0 24px;

  &:hover,
  &:active,
  &:focus {
    background-color: rgba(0, 253, 187, 0.2);
    color: #00fdbb;
  }
`;

export default function WalletConnect() {
  const { connected, wallet, select, disconnect } = useWallet();
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
    <>
      {connected ? (
        <DropdownButton onClick={disconnect} overlay={menu}>
          Disconnect
        </DropdownButton>
      ) : (
        <ConnectButton size="large" onClick={select}>
          Connect wallet
        </ConnectButton>
      )}
    </>
  );
}
