const Planner = Planner || {};

Planner.init = function() {
  this.apiURL = 'http://localhost:3000/api';
  this.$main  = $('main');
  $('.register').on('click', this.register.bind(this));
  $('.login').on('click', this.login.bind(this));
  this.$main.on('submit', 'form', this.handleForm);
};

Planner.register = function(e){
  if (e) e.preventDefault();
  this.$main.html(`
    <h2>Register</h2>
    <form method="post" action="/api/register">
      <div class="form-group">
        <input class="form-control" type="text" name="user[name]" placeholder="Fullname">
      </div>
      <div class="form-group">
        <input class="form-control" type="number" name="user[mobile]" placeholder="Mobile Number">
      </div>
      <div class="form-group">
        <input class="form-control" type="email" name="user[emailAddress]" placeholder="Email">
      </div>
      <div class="form-group">
        <input class="form-control" type="password" name="user[password]" placeholder="Password">
      </div>
      <div class="form-group">
        <input class="form-control" type="password" name="user[passwordConfirmation]" placeholder="Password Confirmation">
      </div>
      <input class="btn btn-primary" type="submit" value="Register">
    </form>
  `);
};

Planner.login = function(e) {
  e.preventDefault();
  this.$main.html(`
    <h2>Login</h2>
    <form method="post" action="/api/login">
      <div class="form-group">
        <input class="form-control" type="email" name="emailAddress" placeholder="Email">
      </div>
      <div class="form-group">
        <input class="form-control" type="password" name="password" placeholder="Password">
      </div>
      <input class="btn btn-primary" type="submit" value="Login">
    </form>
  `);
};

$(Planner.init.bind(Planner));
