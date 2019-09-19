import React, { Component } from 'react';
import { StyleSheet, css } from 'aphrodite';
import './App.css'

import {
  Stitch,
  AnonymousCredential,
  RemoteMongoClient
} from "mongodb-stitch-browser-sdk";

class App extends Component {
  constructor() {
    super();
    this.state = {
      todos: [],
      username: "",
      password: "",
    };

    this.handleUsername = this.handleUsername.bind(this);
    this.handlePassword = this.handlePassword.bind(this);
    this.displayTodos = this.displayTodos.bind(this);
    this.addTodo = this.addTodo.bind(this);
  }

  componentDidMount() {
    // Initialize the App Client
    this.client = Stitch.initializeDefaultAppClient('twistter307-hbspf');
    console.log("The client is ", this.client);
    // Get a MongoDB Service Client
    // This is used for logging in and communicating with Stitch
    const mongodb = this.client.getServiceClient(
      RemoteMongoClient.factory,
      "mongodb-atlas"
    );
    // Get a reference to the twistter database
    this.db = mongodb.db("twistter");
    this.displayTodosOnLoad();
  }

  displayTodos() {
    // query the remote DB and update the component state
    this.db
      .collection("users")
      .find({}, { limit: 1000 })
      .asArray()
      .then(todos => {
        this.setState({ todos });
      });
  }

  displayTodosOnLoad() {
    // Anonymously log in and display comments on load
    this.client.auth
      .loginWithCredential(new AnonymousCredential())
      .then(this.displayTodos)
      .catch(console.error);
  }

  addTodo(event) {
    event.preventDefault();
    const { username } = this.state;
    const { password } = this.state;

    console.log("username is ", username);
    console.log("password is ", password);

    
    // insert the todo into the remote Stitch DB
    // then re-query the DB and display the new todos
    this.db
      .collection("users")
      .insertOne(
        {
          owner_id: this.client.auth.user.id,
          username: username,
          password: password
        })
      .then(this.displayTodos)
      .catch(console.error);

  }

  handlePassword(event) {
    this.setState({ password: event.target.value });
  }

  handleUsername(event) {
    this.setState({ username: event.target.value });
  }



  render() {
    return (
      <div className="App">
        <div className={css(styles.body)}>
          <div className={css(styles.absoluteCenteredDiv)}>
            <h3>Welcome to Twistter</h3>
            <form onSubmit={this.addTodo}>
              <div className={css(styles.box)}>
                <label>
                  <input
                    type="text"
                    username={this.state.value}
                    onChange={this.handleUsername}
                    className={css(styles.username)} 
                  />
                  <input
                    type="password"
                    password={this.state.value}
                    onChange={this.handlePassword}
                    className={css(styles.password)}  />
                </label>
              </div>
              <input type="submit" className={css(styles.button)} value="Sign In" />
            </form>
          </div>
        </div>
      </div>
    );
  }


  // render() {
  //   return (
  //   <div className={css(styles.body)}>
  //   <div className={css(styles.absoluteCenteredDiv)}>
  //     <form action="index.html" method="post" onSubmit={this.addTodo}>
  //       <div className={css(styles.box)}>
  //           <h1>Login Form</h1>
  //           <input className={css(styles.username)} name="username" type="text" placeholder="User Name" value={this.state.value} onChange={this.handleChange}></input>
  //           <input className={css(styles.username)} name="username" type="password" placeholder="Password"></input>
  //           <a href="#"><div className={css(styles.button)}>Sign In</div></a> 
  //       </div>
  //       <input type="submit" value="Submit" />
  //     </form>
  //     <p>Forgot your password? <a className={css(styles.fwpd)} href="#">Click Here!</a></p>
  //   </div>
  //   </div>);
  // }


}


const styles = StyleSheet.create({

  body: {
    fontFamily: "'Open Sans', 'sans-serif'",
    background: "#3498db",
    margin: "20px 0px 20px 0px",
    width: "100%",
    textAlign: "center"
  },
  p: {
    fontSize: "12px",
    textDecoration: "none",
    color: "#ffffff"
  },
  h1: {
    fontSize: "1.5em",
    color: "#525252"
  },
  box: {
    background: "white",
    width: "300px",
    borderRadius: "6px",
    margin: "0 auto 0 auto",
    padding: "0px 0px 70px 0px",
    border: "#2980b9 4px solid"
  },
  username: {
    background: "#ecf0f1",
    border: "#ccc 1px solid",
    borderBottom: "#ccc 2px solid",
    padding: "8px",
    width: "250px",
    color: "#AAAAAA",
    marginTop: "10px",
    fontSize: "1em",
    borderRadius: "4px"
  },
  password: {
    background: "#ecf0f1",
    border: "#ccc 1px solid",
    borderBottom: "#ccc 2px solid",
    padding: "8px",
    width: "250px",
    color: "#AAAAAA",
    marginTop: "10px",
    fontSize: "1em",
    borderRadius: "4px"
  },
  button: {
    background: "#2ecc71",
    width: "125px",
    paddingTop: "5px",
    paddingBottom: "5px",
    color: "white",
    borderRadius: "4px",
    border: "#27ae60 1px solid",
    marginTop: "20px",
    marginBottom: "20px",
    float: "left",
    marginLeft: "88px",
    fontWeight: "800",
    fontSize: "0.8em"
  },
  button_hover: {
    background: "#2CC06B"
  },
  fpwd: {
    color: "#f1c40f",
    textDecoration: "underline"
  },
  absoluteCenteredDiv: {
    position: "absolute",
    top: "0",
    bottom: "0",
    left: "0",
    right: "0",
    margin: "auto",
    width: "400px",
    height: "300px",
    textAlign: "center"
  }
})

export default App;