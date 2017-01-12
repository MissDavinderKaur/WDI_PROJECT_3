const Planner = Planner || {};

Planner.init = function() {
  this.apiURL = 'http://localhost:3000/api';
  this.$main  = $('main');
  $('.register').on('click', this.register.bind(this));
  $('.login').on('click', this.login.bind(this));
  $('.logout').on('click', this.logOut.bind(this));

  this.$main.on('submit', 'form', this.handleForm);
  // this.$main.on('click', '.logout', this.logOut);

  if (this.getToken()) {
    this.loggedInState();
  } else {
    this.loggedOutState();
  }
};

Planner.logOut = function(e) {
  e.preventDefault();
  Planner.loggedOutState();
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

    Planner.$main.html(` <h2>Hello ${data.user.name}</h2>
      <h5> <b> Email: </b> ${data.user.emailAddress}</h5>
      <h5> <b> Phone: </b> ${data.user.mobile}</h5>
      <br>
      <p> <a href="/users/${data.user._id}/edit" > <button class="btn btn-primary"> Edit User Details </button> </a>
        <form action="/users/${data.user._id}" method="post">
        <input type="hidden" name="_method" value="delete">
        <button class="btn btn-danger"> Delete User </button>
        </form>
        <br>
        <h5> My Nightplans</h5>`);
    for( var i = 0; i < data.user.plans.length; i++) {
      Planner.$main.append(`<h6> ${data.user.plans[i].name} on ${data.user.plans[i].date} (Attendees: ${data.user.plans[i].attendees} )</h6>`);
      for( var j = 0; j < (data.user.plans[i].bookings).length; j++) {
        Planner.$main.append(`<h6> ${data.user.plans[i].bookings[j].description} </h6>`);
      }
    }





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
