import { BrowserRouter as Router, Route, Redirect, Switch } from "react-router-dom";
import React, { Component } from "react";
import axios from "axios";
import Dashboard from "./components/Dashboard";
import Login from "./components/Login";
import Signup from "./components/Signup";

import './App.css';

class App extends Component {
  state = {
    user: null
  }

  componentDidMount() {
    // When the app loads, try and get the current user
    this.getCurrentUser();
  }

  setUser = user => {
      // Set the current user into state.
      this.setState({ user });
  }

  getCurrentUser = () => {
    axios
        .get("/p1/auth/info", {
        })
        .then(res => {
            if (res.status === 200) {
              const user = res.data;
              this.setState({ user });
            }
        });
  }

  render() {
    return (
      <div className="App">
        <h1>Invoice App</h1>
        <Router>
          <div>

          <Switch>

            <Route
                exact
                path="/login"
                render={() =>
                    this.state.user ? <Redirect to="/" /> : <Login getCurrentUser={this.getCurrentUser} />
                }
            />

            <Route
                exact
                path="/signup"
                render={() =>
                    this.state.user ? (
                    <Redirect to="/" />
                    ) : (
                    <Signup setUser={this.setUser} />
                    )
                }
            />

            <Route
                path="/"
                render={() =>
                    this.state.user ? (
                    <Dashboard setUser={this.setUser} />
                    ) : (
                    <Redirect to="/login" />
                    )
                }
            />

          </Switch>
          </div>
        </Router>
      </div>
    );
  }
}

export default App;
