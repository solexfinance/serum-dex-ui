import { Col, Row } from 'antd';
import React, { useRef, useEffect, useState } from 'react';
import styled from 'styled-components';
import { useMarket, useOrderbook, useMarkPrice } from '../utils/markets';
import { isEqual, getDecimalCount } from '../utils/utils';
import { useInterval } from '../utils/useInterval';
import FloatingElement from './layout/FloatingElement';
import usePrevious from '../utils/usePrevious';
import { ArrowUpOutlined, ArrowDownOutlined } from '@ant-design/icons';

const Title = styled.div`
  font-weight: 600;
  color: rgba(255, 255, 255, 1);
`;

const SizeTitle = styled(Row)`
  padding: 20px 0 14px;
  color: #b7bdc6;
`;

const MarkPriceTitle = styled(Row)`
  padding: 20px 0 14px;
  font-weight: 700;
`;

export default function Orderbook({ smallScreen, depth = 7, onPrice, onSize }) {
  const markPrice = useMarkPrice();
  const [orderbook] = useOrderbook();
  const { baseCurrency, quoteCurrency } = useMarket();

  const currentOrderbookData = useRef(null);
  const lastOrderbookData = useRef(null);

  const [orderbookData, setOrderbookData] = useState(null);

  useInterval(() => {
    if (
      !currentOrderbookData.current ||
      JSON.stringify(currentOrderbookData.current) !==
        JSON.stringify(lastOrderbookData.current)
    ) {
      let bids = orderbook?.bids || [];
      let asks = orderbook?.asks || [];

      let sum = (total, [, size], index) =>
        index < depth ? total + size : total;
      let totalSize = bids.reduce(sum, 0) + asks.reduce(sum, 0);

      let bidsToDisplay = getCumulativeOrderbookSide(bids, totalSize, false);
      let asksToDisplay = getCumulativeOrderbookSide(asks, totalSize, true);

      currentOrderbookData.current = {
        bids: orderbook?.bids,
        asks: orderbook?.asks,
      };

      setOrderbookData({ bids: bidsToDisplay, asks: asksToDisplay });
    }
  }, 250);

  useEffect(() => {
    lastOrderbookData.current = {
      bids: orderbook?.bids,
      asks: orderbook?.asks,
    };
  }, [orderbook]);

  function getCumulativeOrderbookSide(orders, totalSize, backwards = false) {
    let cumulative = orders
      .slice(0, depth)
      .reduce((cumulative, [price, size], i) => {
        const cumulativeSize = (cumulative[i - 1]?.cumulativeSize || 0) + size;
        cumulative.push({
          price,
          size,
          cumulativeSize,
          sizePercent: Math.round((cumulativeSize / (totalSize || 1)) * 100),
        });
        return cumulative;
      }, []);
    if (backwards) {
      cumulative = cumulative.reverse();
    }
    return cumulative;
  }

  return (
    <FloatingElement
      style={
        smallScreen ? { flex: 1 } : { height: '500px', overflow: 'hidden' }
      }
    >
      <Title>Orderbook</Title>
      <SizeTitle>
        <Col span={8} style={{ textAlign: 'left' }}>
          Price ({quoteCurrency})
        </Col>
        <Col span={8} style={{ textAlign: 'right' }}>
          Size ({baseCurrency})
        </Col>
        <Col span={8} style={{ textAlign: 'right' }}>
          Total
        </Col>
      </SizeTitle>
      {orderbookData?.asks.map(({ price, size, sizePercent }) => (
        <OrderbookRow
          key={price + ''}
          price={price}
          size={size}
          side={'sell'}
          sizePercent={sizePercent}
          onPriceClick={() => onPrice(price)}
          onSizeClick={() => onSize(size)}
        />
      ))}
      <MarkPriceComponent markPrice={markPrice} />
      {orderbookData?.bids.map(({ price, size, sizePercent }) => (
        <OrderbookRow
          key={price + ''}
          price={price}
          size={size}
          side={'buy'}
          sizePercent={sizePercent}
          onPriceClick={() => onPrice(price)}
          onSizeClick={() => onSize(size)}
        />
      ))}
    </FloatingElement>
  );
}

const OrderbookRow = React.memo(
  ({ side, price, size, sizePercent, onSizeClick, onPriceClick }) => {
    const element = useRef();

    const { market } = useMarket();

    useEffect(() => {
      // eslint-disable-next-line
      !element.current?.classList.contains('flash') &&
        element.current?.classList.add('flash');
      const id = setTimeout(
        () =>
          element.current?.classList.contains('flash') &&
          element.current?.classList.remove('flash'),
        250,
      );
      return () => clearTimeout(id);
    }, [price, size]);

    let formattedSize =
      market?.minOrderSize && !isNaN(size)
        ? Number(size).toFixed(getDecimalCount(market.minOrderSize) + 1)
        : size;

    let formattedPrice =
      market?.tickSize && !isNaN(price)
        ? Number(price).toFixed(getDecimalCount(market.tickSize) + 1)
        : price;

    return (
      <Row
        ref={element}
        style={{ marginBottom: 1, color: '#b7bdc6' }}
        onClick={onSizeClick}
      >
        <Col span={8} style={{ textAlign: 'left' }}>
          <span
            style={{ color: side === 'buy' ? '#0ecb81' : '#f6465d' }}
            onClick={onPriceClick}
          >
            {formattedPrice}
          </span>
        </Col>
        <Col span={8} style={{ textAlign: 'right' }}>
          {formattedSize}
        </Col>
        <Col span={8} style={{ textAlign: 'right' }}>
          {Math.round(formattedPrice * formattedSize * 1000) / 1000}
        </Col>
      </Row>
    );
  },
  (prevProps, nextProps) =>
    isEqual(prevProps, nextProps, ['price', 'size', 'sizePercent']),
);

const MarkPriceComponent = React.memo(
  ({ markPrice }) => {
    const { market } = useMarket();
    const previousMarkPrice = usePrevious(markPrice);

    let markPriceColor =
      markPrice > previousMarkPrice
        ? '#0ecb81'
        : markPrice < previousMarkPrice
        ? '#f6465d'
        : 'white';

    let formattedMarkPrice =
      markPrice &&
      market?.tickSize &&
      markPrice.toFixed(getDecimalCount(market.tickSize));

    return (
      <MarkPriceTitle>
        <Col style={{ color: markPriceColor }}>
          {formattedMarkPrice || '----'}
          {markPrice > previousMarkPrice && (
            <ArrowUpOutlined style={{ marginLeft: 3 }} />
          )}
          {markPrice < previousMarkPrice && (
            <ArrowDownOutlined style={{ marginLeft: 3 }} />
          )}
        </Col>
      </MarkPriceTitle>
    );
  },
  (prevProps, nextProps) => isEqual(prevProps, nextProps, ['markPrice']),
);
