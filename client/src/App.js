import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import "./index.css";
import Home from "./Home/Home";
import ChatRoom from "./ChatRoom/ChatRoom";

function App() {
  return (
    <Router>
      <Switch>
        <Route exact path="/" component={Home} />
        <Route exact path="/:projectId" component={ChatRoom} />
      </Switch>
    </Router>
  );
}

export default App;
