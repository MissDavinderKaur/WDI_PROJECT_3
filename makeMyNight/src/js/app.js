const google = google;
const Planner = Planner || {};

Planner.init = function() {
  this.apiURL = 'http://localhost:3000/api';
  this.$main  = $('main');

  $('.register').on('click', this.register.bind(this));
  $('.login').on('click', this.login.bind(this));
  $('.logout').on('click', this.logout.bind(this));

  this.$main.on('submit', 'form.auth', this.handleForm);
  this.$main.on('submit', '.newPlanForm', this.newPlan.bind(this));
  this.$main.on('click', '.choosePerformance', this.choosePerformance);
  this.$main.on('submit', '.budgetSearch', this.choosePerformanceByBudget);

  if (this.getToken()) {
    this.loggedInState();
    Planner.loggedInUserID = (window.atob(((window.localStorage.getItem('token')).split('.'))[1])).split('"')[3];

    return Planner.ajaxRequest(`${Planner.apiURL}/users/${Planner.loggedInUserID}`, 'GET', null, user => {
      Planner.loggedInUser = user;
      Planner.showLoggedInUser(user);
    });
  } else {
    this.loggedOutState();
    this.generateWelcomePage();
  }
};

Planner.loggedOutState = function(){
  $('.login').show();
  $('.register').show();
  $('.logout').hide();

};

Planner.generateWelcomePage = function() {
  Planner.$main.html(`<div class="jumbotron">
  <div class="container">
  <h1>Welcome!</h1>
  <h5>Ever had to plan the perfect evening but didn't know where to start? <br> <br>
  Presenting <b> Make My Night </b>. The one stop shop to plan a great evening, with a partner or friends or family! </h5>
  </div>
  </div>`);
};

Planner.login = function(e) {
  e.preventDefault();
  this.$main.html(`
    <h2>Login</h2>
    <form class="auth" method="post" action="/login">
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

  Planner.register = function(e){
    if (e) e.preventDefault();
    this.$main.html(`
      <h2>Register</h2>
      <form class="auth" method="post" action="/register">
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

    Planner.loggedInState = function(){
      $('.login').hide();
      $('.register').hide();
      $('.logout').show();
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
        <form class="newPlanForm">
        <div class="form-group">
        <input class="form-control bookingname" type="text" name="booking[name]" placeholder="Booking Name" required>
        </div>
        <div class="form-group">
        <input class="form-control bookingattendees" type="number" name="booking[attendees]" placeholder="No. of Attendees" required>
        </div>
        <button class="btn btn-primary"> Make a new Night Plan! </button>
        </form>
        <h5> My Nightplans</h5>`);
        for( var i = 0; i < user.plans.length; i++) {
          Planner.$main.append(`<h6> ${user.plans[i].name} on ${user.plans[i].date} (Attendees: ${user.plans[i].attendees} )</h6>`);
          for( var j = 0; j < (user.plans[i].bookings).length; j++) {
            Planner.$main.append(`<h6> ${user.plans[i].bookings[j].description} </h6>`);
          }
        }
      };

      Planner.newPlan = function(e) {
        e.preventDefault();
        Planner.tempBookingName = ($(e.target).find('.bookingname').val());
        Planner.tempBookingAttendees = ($(e.target).find('.bookingattendees').val());
        this.loadMap();
        this.addTheatres();
      };

      Planner.loadMap = function() {
        Planner.$main.html(`<div id="map-canvas"></div>`);
        const canvas = document.getElementById('map-canvas');

        const mapOptions = {
          zoom: 13,
          center: new google.maps.LatLng(51.5154,-0.1410),
          mapTypeId: google.maps.MapTypeId.ROADMAP
        };

        this.map = new google.maps.Map(canvas, mapOptions);
      };

      Planner.addTheatres = function() {
        return Planner.ajaxRequest(`${Planner.apiURL}/venues`, 'GET', null, theatres => {
          $.each(theatres, (index, theatre) => {
            let events = '';
            $.each(theatre.events, (index, event) => {
              events += `<li> <a href="#" class="choosePerformance" data-id="${event.EventId}"> ${event.Name} </a> </li>`;
            });
            setTimeout(function() {
              const latlng = new google.maps.LatLng(theatre.latitude, theatre.longitude);
              const marker = new google.maps.Marker({
                position: latlng,
                map: Planner.map,
                animation: google.maps.Animation.DROP
              });
              google.maps.event.addListener(marker, 'click', () => {
                if (typeof this.infoWindow !== 'undefined') this.infoWindow.close();
                this.infoWindow = new google.maps.InfoWindow({
                  content: `<p>${ theatre.name } : <br> <ul> ${events} </ul> </p>`
                });
                this.infoWindow.open(Planner.map, marker);
                Planner.map.setCenter(marker.getPosition());
                Planner.map.setZoom(15);
              });
            }, index * 50);
          });
        });
      };

      Planner.choosePerformance = function(e) {
        e.preventDefault();
        Planner.tempShowName = e.currentTarget.innerHTML
        Planner.ajaxRequest(`${Planner.apiURL}/Events/${$(this).data('id')}/Performances`, 'GET', null, data => {
          const filteredPerformances = (data.Performances).filter(p => p.TotalAvailableTickesCount > Planner.tempBookingAttendees);

          Planner.$main.html(` <h2> ${Planner.tempBookingName} : <br>
          ${Planner.tempBookingAttendees} tickets for ${Planner.tempShowName} </h2>
          <p> ${filteredPerformances.length} options available </p>
          <p> Got a budget? Search by max ticket price </p>
          <form class="budgetSearch" data-id=${data.EventId}> <input class="form-control userBudget" type="number" name="userBudget" required> <button class="btn btn-primary"> Search </button> </form> `);

          for (var i = 0; i < filteredPerformances.length; i++) {
            Planner.$main.append(`<h6> <a href="#"> ${data.Performances[i].PerformanceDate} </a> </h6>`);
          }
        });
      };

      Planner.choosePerformanceByBudget = function(e) {
        console.log('choosing performance by budget');
        console.log($(this));
        e.preventDefault();
        Planner.ajaxRequest(`${Planner.apiURL}/Events/${$(this).data('id')}/Performances`, 'GET', null, data => {

          const filteredPerformances = (data.Performances).filter(p => p.MinimumTicketPrice < ($(e.target).find('.userBudget').val()));

          Planner.$main.html(` <h2> ${Planner.tempBookingName} : <br>
          ${Planner.tempBookingAttendees} tickets for ${Planner.tempShowName} (max £ ${$(e.target).find('.userBudget').val()} per ticket)</h2>
          <p> ${filteredPerformances.length} options available </p>
          <button data-id=${data.EventId} class="choosePerformance"> Back to full search </button> `);
          for (var i = 0; i < filteredPerformances.length; i++) {
            Planner.$main.append(`<h6> <a href="#"> ${data.Performances[i].PerformanceDate} </a> </h6>`);
          }
        });
      };

      Planner.logout = function(e) {
        e.preventDefault();
        Planner.generateWelcomePage();
        Planner.loggedOutState();
        return window.localStorage.clear();
      };


      //INTERNAL HELPER FUNCTIONS
      Planner.getToken = function(){
        return window.localStorage.getItem('token');
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

      Planner.setToken = function(token){
        return window.localStorage.setItem('token', token);
      };

      Planner.setRequestHeader = function(xhr) {
        return xhr.setRequestHeader('Authorization', `Bearer ${this.getToken()}`);
      };


      $(Planner.init.bind(Planner));
