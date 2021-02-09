import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import Service from './components/Service';
import Login from './screens/Login';
import Home from './screens/Home';


const App: React.FC = () => {

  return (
    <BrowserRouter>
      <Switch>
        <Route path="/" exact component={Login} />
        <Route path="/home" exact component={Home} />
        <Route path = "/" component = {() => <div>404 - Page not found</div>}/>
      </Switch>
    </BrowserRouter>
  );
}



export default App;
