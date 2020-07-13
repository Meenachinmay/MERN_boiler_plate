import React from 'react';
import { Route, Switch } from 'react-router-dom';
import  About  from '../components/routes-components/About';
import  Home  from '../components/routes-components/Home';

function App() {
  return (
    <div>
      <Switch>
        <Route exact path='/' component={ Home }/>
        <Route exact path='/about' component={ About }/>
      </Switch>
    </div>
  );
}

export default App;
