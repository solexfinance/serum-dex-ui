import { Col, Row } from 'antd';
import React from 'react';
import styled from 'styled-components';
import { useMarket, useBonfidaTrades } from '../utils/markets';
import { getDecimalCount } from '../utils/utils';
import FloatingElement from './layout/FloatingElement';
import { BonfidaTrade } from '../utils/types';

const Title = styled.div`
  color: rgba(255, 255, 255, 1);
`;
const SizeTitle = styled(Row)`
  padding: 20px 0 14px;
  color: #434a59;
`;

export default function PublicTrades({ smallScreen }) {
  const { baseCurrency, quoteCurrency, market } = useMarket();
  const [trades, loaded] = useBonfidaTrades();

  return (
    <FloatingElement
      style={
        smallScreen
          ? { flex: 1 }
          : {
              minHeight: '270px',
              maxHeight: '400px',
              display: 'flex',
              flexDirection: 'column',
            }
      }
    >
      <Title>Recent Market trades</Title>
      <SizeTitle>
        <Col span={8}>Price ({quoteCurrency}) </Col>
        <Col span={8} style={{ textAlign: 'right' }}>
          Size ({baseCurrency})
        </Col>
        <Col span={8} style={{ textAlign: 'right' }}>
          Time
        </Col>
      </SizeTitle>
      {!!trades && loaded && (
        <div
          style={{
            marginRight: '-20px',
            paddingRight: '5px',
            overflowY: 'scroll',
            flexGrow: 1,
          }}
        >
          {trades.map((trade: BonfidaTrade, i: number) => (
            <Row key={i} style={{ marginBottom: 4 }}>
              <Col
                span={8}
                style={{
                  color: trade.side === 'buy' ? '#0ecb81' : '#f6465d',
                }}
              >
                {market?.tickSize && !isNaN(trade.price)
                  ? Number(trade.price).toFixed(
                      getDecimalCount(market.tickSize),
                    )
                  : trade.price}
              </Col>
              <Col span={8} style={{ textAlign: 'right', color: '#b7bdc6' }}>
                {market?.minOrderSize && !isNaN(trade.size)
                  ? Number(trade.size).toFixed(
                      getDecimalCount(market.minOrderSize),
                    )
                  : trade.size}
              </Col>
              <Col span={8} style={{ textAlign: 'right', color: '#434a59' }}>
                {trade.time && new Date(trade.time).toLocaleTimeString()}
              </Col>
            </Row>
          ))}
        </div>
      )}
    </FloatingElement>
  );
}
