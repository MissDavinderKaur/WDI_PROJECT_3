const google = google;
const Planner = Planner || {};

Planner.init = function() {
  this.apiURL = 'http://localhost:3000/api';
  this.$main  = $('main');
  $('.register').on('click', this.register.bind(this));
  $('.login').on('click', this.login.bind(this));
  $('.logout').on('click', this.logOut.bind(this));

  this.$main.on('submit', 'form', this.handleForm);
  this.$main.on('click', '.newPlan', this.newPlanStepOne.bind(this));

  if (this.getToken()) {
    this.loggedInState();

    Planner.loggedInUserID = (window.atob(((window.localStorage.getItem('token')).split('.'))[1])).split('"')[3];
    console.log(Planner.loggedInUserID);

    return Planner.ajaxRequest(`${Planner.apiURL}/users/${Planner.loggedInUserID}`, 'GET', null, user => {
      Planner.showLoggedInUser(user);
    });

  } else {
    this.loggedOutState();
  }
};

Planner.logOut = function(e) {
  e.preventDefault();
  Planner.loggedOutState();
  return window.localStorage.clear();
};

Planner.newPlanStepOne = function(e) {
  e.preventDefault();

  Planner.$main.html(`<div id="map-canvas"></div>`);
  const canvas = document.getElementById('map-canvas');

  const mapOptions = {
    zoom: 12,
    center: new google.maps.LatLng(51.506178,-0.088369),
    mapTypeId: google.maps.MapTypeId.ROADMAP
  };

  this.map = new google.maps.Map(canvas, mapOptions);
};

Planner.loggedInState = function(){
  $('.login').hide();
  $('.register').hide();
  $('.logout').show();
    //this.plannerChooseShow();
};

Planner.showLoggedInUser = function(user) {
  Planner.$main.html(` <h2>Hello ${user.name}</h2>
    <h5> <b> Email: </b> ${user.emailAddress}</h5>
    <h5> <b> Phone: </b> ${user.mobile}</h5>
    <br>
    <p> <a href="/users/${user._id}/edit" > <button class="btn btn-primary"> Edit User Details </button> </a>
      <form action="/users/${user._id}" method="post">
      <input type="hidden" name="_method" value="delete">
      <button class="btn btn-danger"> Delete User </button>
      </form>
      <br>
      <button class="btn btn-primary newPlan"> Make a new Night Plan! </button>
      <h5> My Nightplans</h5>`);
  for( var i = 0; i < user.plans.length; i++) {
    Planner.$main.append(`<h6> ${user.plans[i].name} on ${user.plans[i].date} (Attendees: ${user.plans[i].attendees} )</h6>`);
    for( var j = 0; j < (user.plans[i].bookings).length; j++) {
      Planner.$main.append(`<h6> ${user.plans[i].bookings[j].description} </h6>`);
    }
  }
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
    Planner.showLoggedInUser(data.user);
    Planner.loggedInState();
  });
};

Planner.ajaxRequest = function(url, method, data, callback){
  return $.ajax({
    url,
    method,
    data,
    beforeSend: this.setRequestHeader.bind(this)
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

Planner.setRequestHeader = function(xhr) {
  return xhr.setRequestHeader('Authorization', `Bearer ${this.getToken()}`);
};

$(Planner.init.bind(Planner));
