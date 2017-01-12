"use strict";var Planner=Planner||{};Planner.init=function(){this.apiURL="http://localhost:3000/api",this.$main=$("main"),$(".register").on("click",this.register.bind(this)),$(".login").on("click",this.login.bind(this)),this.$main.on("submit","form",this.handleForm)},Planner.register=function(n){n&&n.preventDefault(),this.$main.html('\n    <h2>Register</h2>\n    <form method="post" action="/api/register">\n      <div class="form-group">\n        <input class="form-control" type="text" name="user[name]" placeholder="Fullname">\n      </div>\n      <div class="form-group">\n        <input class="form-control" type="number" name="user[mobile]" placeholder="Mobile Number">\n      </div>\n      <div class="form-group">\n        <input class="form-control" type="email" name="user[emailAddress]" placeholder="Email">\n      </div>\n      <div class="form-group">\n        <input class="form-control" type="password" name="user[password]" placeholder="Password">\n      </div>\n      <div class="form-group">\n        <input class="form-control" type="password" name="user[passwordConfirmation]" placeholder="Password Confirmation">\n      </div>\n      <input class="btn btn-primary" type="submit" value="Register">\n    </form>\n  ')},Planner.login=function(n){n.preventDefault(),this.$main.html('\n    <h2>Login</h2>\n    <form method="post" action="/api/login">\n      <div class="form-group">\n        <input class="form-control" type="email" name="emailAddress" placeholder="Email">\n      </div>\n      <div class="form-group">\n        <input class="form-control" type="password" name="password" placeholder="Password">\n      </div>\n      <input class="btn btn-primary" type="submit" value="Login">\n    </form>\n  ')},$(Planner.init.bind(Planner));