import React, { Component } from "react";
import axios from "axios"

class Login extends Component {

  state = {
    email: "",
    password: "",
    message: ""
  };

  handleChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  };

  handleSubmit = e => {
    e.preventDefault();
    // 1. Grab email and password out of state
    const { email, password } = this.state;
    // 2. Post them to our backend
    axios
        .post("/p1/auth/signup", {
          data: {
            email,
            password
          },
          withCredentials: true
        }
        )
        .then(res => {
        if (res.status === 200) {
            const user = res.data;
            // 3. Set the user in state!
            this.props.setUser(user);
        } else {
          this.setState({
            message: "Duplicate email address, please try something else."
          })
        }
        });
  };

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <div>
          <label htmlFor="email">Email: </label>
          <input
            type="email"
            onChange={this.handleChange}
            name="email"
            id="email"
            placeholder="email"
          />
        </div>
        <div>
          <label htmlFor="email">Password: </label>
          <input
            type="password"
            onChange={this.handleChange}
            name="password"
            id="password"
            placeholder="Enter your desired password"
          />
        </div>
        <div>
          <input type="submit" value="Signup" />
        </div>
        <div>{this.state.message}</div>
      </form>
    );
  }
}

export default Login;
