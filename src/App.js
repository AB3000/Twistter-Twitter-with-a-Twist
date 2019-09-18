import React, { Component } from 'react';
import {StyleSheet, css} from 'aphrodite';
import './App.css'

class App extends Component {
  render() {
    return (
    <div className={css(styles.body)}>
    <div className={css(styles.absoluteCenteredDiv)}>
      <form action="index.html" method="post">
        <div class="box">
            <h1>Login Form</h1>
            <input class="username" name="username" type="text" placeholder="User Name"></input>
            <input class="username" name="username" type="password" placeholder="Password"></input>
            <a href="#"><div class="button">Sign In</div></a> 
        </div>
      </form>
      <p>Forgot your password? <a class="fpwd" href="#">Click Here!</a></p>
    </div>
    </div>);
  }
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