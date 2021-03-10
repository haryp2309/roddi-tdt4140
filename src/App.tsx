import React, { useState } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import Service from './services/Service';
import Login from './screens/Login';
import Home from './screens/Home';
import Dodsbo from './screens/Dodsbo';
import { UserContext } from './components/UserContext';

const initialState: string = '';

const App: React.FC = () => {
  const [id, setId] = useState(initialState)
  return (
    <BrowserRouter>
      <UserContext.Provider value={{ id, setId }}>
        <Switch>
          <Route path="/" exact component={Login} />
          <Route path="/home" exact component={Home} />
          <Route path="/dodsbo/:id" exact component={Dodsbo} />
          <Route path="/" component={() => <div>404 - Page not found</div>} />
        </Switch>
      </UserContext.Provider>
    </BrowserRouter>
  );
}



export default App;
