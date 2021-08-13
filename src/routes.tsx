import { HashRouter, Route, Switch, Redirect } from 'react-router-dom';
import TradePage from './pages/TradePage';
import React from 'react';
import BasicLayout from './components/BasicLayout';
import NewPoolPage from './pages/pools/NewPoolPage';
import PoolPage from './pages/pools/PoolPage';
import PoolListPage from './pages/pools/PoolListPage';
import { getTradePageUrl } from './utils/markets';

export function Routes() {
  return (
    <>
      <HashRouter basename={'/'}>
        <BasicLayout>
          <Switch>
            <Route exact path="/market/:marketAddress">
              <TradePage />
            </Route>
            <Route exact path="/pools">
              <PoolListPage />
            </Route>
            <Route exact path="/pools/new">
              <NewPoolPage />
            </Route>
            <Route exact path="/pools/:poolAddress">
              <PoolPage />
            </Route>
            <Route path="*">
              <Redirect to={getTradePageUrl()} />
            </Route>
          </Switch>
        </BasicLayout>
      </HashRouter>
    </>
  );
}
