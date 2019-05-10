/**
 * Import
 */
import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
/**
 * Local import
 */
// Composants

// Containers
import Signin from 'src/containers/Signin';
import Login from 'src/containers/Login';
import LostPassword from 'src/containers/LostPassword';
import NewPassword from 'src/containers/NewPassword';
import LeafletMap from 'src/containers/LeafletMap';

// Dumb
import Welcome from '../Welcome';
import NotFound from '../NotFound';
import Loading from '../Loading';
import DisplayBuilding from '../LeafletMap/DisplayBuilding';

// Styles et assets

import './app.scss';
/**
 * Code
 */
const App = () => (
  <Switch>

    <Route
      exact
      path="/"
      render={() => (
        <Redirect to="/login" />
      )}
    />

    <Route
      exact
      path="/signin"
      render={() => (
        <Welcome>
          <Signin />
        </Welcome>
      )}
    />

    <Route
      exact
      path="/login"
      render={() => (
        <Welcome>
          <Login />
        </Welcome>
      )}
    />

    <Route
      exact
      path="/lost-password"
      render={() => (
        <Welcome>
          <LostPassword />
        </Welcome>
      )}
    />

    <Route
      exact
      path="/new-password"
      render={() => (
        <Welcome>
          <NewPassword />
        </Welcome>
      )}
    />

    <Route
      // ROUTE LOADING A ENLEVER PAR LA SUITE
      exact
      path="/loading"
      render={() => (
        <Loading />
      )}
    />

    <Route
      exact
      path="/map"
      render={() => (
        <LeafletMap />
      )}
    />

    <Route
      exact
      path="/display"
      render={() => (
        <DisplayBuilding />
      )}
    />

    <Route component={NotFound} />
  </Switch>
  // <LeafletMap />
);

/**
 * Export
 */
export default App;
