import React from 'react';
import './Home.css';

function Home() {
  return (
    <div id="absoluteCenteredDiv">
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
  );
}

export default Home;