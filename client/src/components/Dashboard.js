import React from "react";
import axios from "axios";
import Logout from "./Logout";

class Dashboard extends React.Component {
  state = {
  };

  // handleChange = e => {
  //   this.setState({
  //     [e.target.name]: e.target.value
  //   });
  // };

  // getTodos = () => {
  //   // 1. When the dashboard loads, get the user's token
  //   const token = getToken();
  //   // 2. Send a GET request to /todo and pass the token to grab a list of ONLY this user's todos
  //   axios
  //       .get("/todo", {
  //       headers: {
  //           Authorization: `Bearer ${token}`
  //       }
  //       })
  //       .then(res => {
  //           if (res.status === 200) {
  //               const todos = res.data.payload;
  //               // 3. If we get a successful response, store the todos in state.
  //               this.setState({ todos });
  //           }
  //       });
  // };

  componentDidMount() {
    // this.getTodos();
  }

  // componentDidUpdate() {
  //   this.getTodos();
  // }

  handleSubmit = e => {
    // e.preventDefault();
    // const { todo } = this.state;
    //
    // const token = getToken()
    // // 1. Get the user's token
    //
    // axios
    //   .post("/todo",
    //     {
    //       description: todo
    //     },
    //     {
    //       headers: {
    //         Authorization: `Bearer ${token}`
    //       }
    //     })
    //     .then(this.getTodos);
    // // 2. Send a POST to /todo with
    // //  a - the body containing the TODO we wish to post
    // //  b - the Authorization Header Bearer <token>
  };

  render() {
    return (
      <div>
        <h1>Dashboard</h1>
        <ul>
        </ul>
        <Logout setUser={this.props.setUser} />
      </div>
    );
  }
}

export default Dashboard;
