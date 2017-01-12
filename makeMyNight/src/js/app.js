const Planner = Planner || {};

Planner.init = function() {
  this.apiURL = 'http://localhost:3000/api';
  this.$main  = $('main');
  $('.register').on('click', this.register.bind(this));
  $('.login').on('click', this.login.bind(this));

  this.$main.on('submit', 'form', this.handleForm);
  this.$main.on('click', '.logout', this.logOut.bind(this));

  if (this.getToken()) {
    this.loggedInState();
  } else {
    this.loggedOutState();
  }
};

Planner.logOut = function(e) {
  e.preventDefault();
  return window.localStorage.clear();
};


Planner.loggedInState = function(){
  $('.login').hide();
  $('.register').hide();
  $('.logout').show();
    //this.plannerChooseShow();
};

Planner.setToken = function(token){
  return window.localStorage.setItem('token', token);
};


Planner.handleForm = function(e){
  e.preventDefault();

  const url    = `${Planner.apiURL}${$(this).attr('action')}`;
  const method = $(this).attr('method');
  const data   = $(this).serialize();

  return Planner.ajaxRequest(url, method, data, data => {
    if (data.token) Planner.setToken(data.token);
    Planner.$main.html(` <h2>Hello ${data.user.name}</h2> `);
    Planner.loggedInState();
  });
};

Planner.ajaxRequest = function(url, method, data, callback){
  return $.ajax({
    url,
    method,
    data
    //WHAT WAS THIS FOR??? beforeSend: this.setRequestHeader.bind(this)
  })
  .done(callback)
  .fail(data => {
    console.log(data);
  });
};

Planner.register = function(e){
  if (e) e.preventDefault();
  this.$main.html(`
    <h2>Register</h2>
    <form method="post" action="/register">
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
    <form method="post" action="/login">
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

Planner.loggedOutState = function(){
  $('.login').show();
  $('.register').show();
  $('.logout').hide();
};

Planner.getToken = function(){
  return window.localStorage.getItem('token');
};

$(Planner.init.bind(Planner));
