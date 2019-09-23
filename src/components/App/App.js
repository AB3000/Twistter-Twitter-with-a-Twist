import React, { Component } from 'react';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
import Home from './components/Home';
import Posts from './components/Posts';
function App() {
  return (
    <Router>
        <div>
          {/* Top-Level Routes */}
          <Switch>
              <Route exact path='/' component={Home} />
              <Route path='/Posts' component={Posts} />
          </Switch>
        </div>
      </Router>
  );
}

export default App;
