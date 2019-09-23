import React, { Component } from 'react';
import './Home.css';

class Home extends Component{

  state = {
    data: null
  };

  componentDidMount() {
    // Call our fetch function below once the component mounts
  this.callBackendAPI()
    .then(res => this.setState(
      { data: res.express }
      ))
    .catch(err => console.log(err));
}
  // Fetches our GET route from the Express server. (Note the route we are fetching matches the GET route from server.js
callBackendAPI = async () => {
  const response = await fetch('/express_backend');
  const body = await response.json();


  if (response.status !== 200) {
    throw Error(body.message) 
  }

  console.log("BODY IS", body);
  return body;
};

render () {
  return (
    <div id="absoluteCenteredDiv">
        <form>
            <div className="box">
                <h1>Login Form</h1>
                <input className="username" name="username" type="text" placeholder="User Name"></input>
                <input className="username" name="username" type="password" placeholder="Password"></input>
                <a href="#"><div className="button">Sign In</div></a>
            </div>
        </form>
        <p>Forgot your password? <a className="fpwd" href="#">Click Here!</a></p>
    </div> 
  );
}

}

export default Home;