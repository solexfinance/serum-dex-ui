import { SettingOutlined } from '@ant-design/icons';
import { Button, Menu, Dropdown } from 'antd';
import React, { useCallback, useEffect, useState } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import logo from '../assets/logo.svg';
import styled from 'styled-components';
import { useWallet } from '../utils/wallet';
import { ENDPOINTS, useConnectionConfig } from '../utils/connection';
import Settings from './Settings';
import CustomClusterEndpointDialog from './CustomClusterEndpointDialog';
import { EndpointInfo } from '../utils/types';
import { notify } from '../utils/notifications';
import { Connection } from '@solana/web3.js';
import WalletConnect from './WalletConnect';
import { getTradePageUrl } from '../utils/markets';

// #161a1e global bg
// #22930 border
// #161a1e header bg

const Wrapper = styled.div`
  background-color: #181a20;
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  padding: 0px 16px;
  flex-wrap: wrap;
  border-bottom: 1px solid #252930;
`;

const LogoWrapper = styled.div`
  display: flex;
  margin-right: 20px;
  align-items: center;
  color: #00fdbb;
  font-weight: bold;
  cursor: pointer;
  img {
    height: 30px;
    margin-right: 8px;
  }
`;

const ConfigButton = styled(Button)`
  height: 100%;
  border: unset;
  display: flex;
  align-items: center;

  &:hover,
  &:active,
  &:focus {
    color: #00fdbb;
  }
`;

export default function TopBar() {
  const { connected, wallet } = useWallet();
  const {
    endpointInfo,
    setEndpoint,
    availableEndpoints,
    setCustomEndpoints,
  } = useConnectionConfig();
  const [addEndpointVisible, setAddEndpointVisible] = useState(false);
  const [testingConnection, setTestingConnection] = useState(false);
  const location = useLocation();
  const history = useHistory();

  const handleClick = useCallback(
    (e) => {
      history.push(e.key);
    },
    [history],
  );

  const onAddCustomEndpoint = (info: EndpointInfo) => {
    const existingEndpoint = availableEndpoints.some(
      (e) => e.endpoint === info.endpoint,
    );
    if (existingEndpoint) {
      notify({
        message: `An endpoint with the given url already exists`,
        type: 'error',
      });
      return;
    }

    const handleError = (e) => {
      console.log(`Connection to ${info.endpoint} failed: ${e}`);
      notify({
        message: `Failed to connect to ${info.endpoint}`,
        type: 'error',
      });
    };

    try {
      const connection = new Connection(info.endpoint, 'recent');
      connection
        .getBlockTime(0)
        .then(() => {
          setTestingConnection(true);
          console.log(`testing connection to ${info.endpoint}`);
          const newCustomEndpoints = [
            ...availableEndpoints.filter((e) => e.custom),
            info,
          ];
          setEndpoint(info.endpoint);
          setCustomEndpoints(newCustomEndpoints);
        })
        .catch(handleError);
    } catch (e) {
      handleError(e);
    } finally {
      setTestingConnection(false);
    }
  };

  const endpointInfoCustom = endpointInfo && endpointInfo.custom;
  useEffect(() => {
    const handler = () => {
      if (endpointInfoCustom) {
        setEndpoint(ENDPOINTS[0].endpoint);
      }
    };
    window.addEventListener('beforeunload', handler);
    return () => window.removeEventListener('beforeunload', handler);
  }, [endpointInfoCustom, setEndpoint]);

  const tradePageUrl = location.pathname.startsWith('/market/')
    ? location.pathname
    : getTradePageUrl();

  const menu = (
    <Menu>
      <Menu.Item key="0">
        {connected ? <Settings autoApprove={wallet?.autoApprove} /> : null}
      </Menu.Item>
      <Menu.Item key="1">The setting Lorem ipsum dolor sit amet.</Menu.Item>
      <Menu.Item key="2">Color setting Lorem ipsum dolor sit amet.</Menu.Item>
      <Menu.Item key="3">Layout setting Lorem ipsum dolor sit amet.</Menu.Item>
    </Menu>
  );

  return (
    <>
      <CustomClusterEndpointDialog
        visible={addEndpointVisible}
        testingConnection={testingConnection}
        onAddCustomEndpoint={onAddCustomEndpoint}
        onClose={() => setAddEndpointVisible(false)}
      />
      <Wrapper>
        <LogoWrapper onClick={() => history.push(tradePageUrl)}>
          <img src={logo} alt="" />
          {'EXCHANGE NAME'}
        </LogoWrapper>
        <Menu
          mode="horizontal"
          onClick={handleClick}
          selectedKeys={[location.pathname]}
          style={{
            borderBottom: 'none',
            backgroundColor: 'transparent',
            display: 'flex',
            alignItems: 'flex-end',
            flex: 1,
          }}
        >
          <Menu.Item
            key={tradePageUrl}
            style={{ margin: '0 20px', borderBottom: 'unset' }}
          >
            Trade
          </Menu.Item>
          <Menu.Item
            key={'/aaa'}
            style={{ margin: '0 20px', borderBottom: 'unset' }}
          >
            Other
          </Menu.Item>
        </Menu>
        <div>
          <WalletConnect />
        </div>
        <div
          style={{
            marginLeft: '16px',
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <Dropdown overlay={menu} placement="bottomRight">
            <ConfigButton>
              <SettingOutlined style={{ fontSize: 20 }} />
            </ConfigButton>
          </Dropdown>
        </div>
      </Wrapper>
    </>
  );
}
