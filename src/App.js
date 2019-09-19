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

}


export default App;