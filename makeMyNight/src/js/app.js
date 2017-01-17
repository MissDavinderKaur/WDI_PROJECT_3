const google = google;
const Planner = Planner || {};

Planner.init = function() {
  this.apiURL = 'http://localhost:3000/api';
  this.$main  = $('main');

  $('.register').on('click', this.register.bind(this));
  $('.login').on('click', this.login.bind(this));
  $('.logout').on('click', this.logout.bind(this));

  this.$main.on('click', '.planDetail', this.showPlanDetail);
  this.$main.on('submit', 'form.auth', this.handleForm);
  this.$main.on('submit', '.newPlanForm', this.newPlan);
  this.$main.on('click', '.choosePerformance', this.choosePerformance);
  this.$main.on('submit', '.budgetSearch', this.choosePerformanceByBudget);
  this.$main.on('click', '.bookShow', this.bookShow);

  if (this.getToken()) {
    this.loggedInState();
    Planner.loggedInUserID = (window.atob(((window.localStorage.getItem('token')).split('.'))[1])).split('"')[3];

    return Planner.ajaxRequest(`${Planner.apiURL}/users/${Planner.loggedInUserID}`, 'GET', null, user => {
      if(!user) {
        Planner.loggedOutState();
        Planner.generateWelcomePage();
      }
      Planner.loggedInUser = user;
      Planner.showLoggedInUser(user);
    });
  } else {
    Planner.loggedOutState();
    Planner.generateWelcomePage();
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
  <h1> <span class="brand"> Welcome! </span> </h1>
  <h5>Ever had to plan the perfect evening but didn't know where to start? <br> <br>
  Presenting <span class="brandSmall"> Make My Night </span>. The one stop shop to plan a great evening, with a partner or friends or family! </h5>
  </div>
  </div>`);
};

Planner.login = function(e) {
  e.preventDefault();
  this.$main.html(`
    <div class="content">
    <h2>Login</h2>
    <form class="auth" method="post" action="/login">
    <div class="form-group col-md-6">
    <input class="form-control" type="email" name="emailAddress" placeholder="Email">
    </div>
    <div class="form-group col-md-6">
    <input class="form-control" type="password" name="password" placeholder="Password">
    </div>
    <input class="btn btn-primary" type="submit" value="Login">
    </form>
    </div>
    `);
  };

  Planner.register = function(e){
    if (e) e.preventDefault();
    this.$main.html(`
      <div class="content">
      <h2>Register</h2>
      <form class="auth" method="post" action="/register">
      <span class="col-md-12" style="padding-left: 0px; padding-right: 0px;">
      <div class="form-group col-md-6">
      <input class="form-control" type="text" name="user[name]" placeholder="Fullname">
      </div>
      </span>
      <div class="form-group col-md-6">
      <input class="form-control" type="number" name="user[mobile]" placeholder="Mobile Number">
      </div>
      <div class="form-group col-md-6">
      <input class="form-control" type="email" name="user[emailAddress]" placeholder="Email">
      </div>
      <div class="form-group col-md-6">
      <input class="form-control" type="password" name="user[password]" placeholder="Password">
      </div>
      <div class="form-group col-md-6">
      <input class="form-control" type="password" name="user[passwordConfirmation]" placeholder="Password Confirmation">
      </div>
      <input class="btn btn-primary" type="submit" value="Register">
      </form>
      </div>
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
      Planner.ajaxRequest(`${Planner.apiURL}/users/${user._id}`, 'GET', `${user._id}`, user => {
        Planner.$main.html(`<div class="content">
        <img src="../images/profilePic.jpeg" alt="Davinder Kaur">
        <h2>Hello....... ${user.name}!</h2>
        <h6> <b> Email: </b> ${user.emailAddress}</h6>
        <h6> <b> Phone: </b> ${user.mobile}</h6>
        <br>
        <br>
        <span class="col-md-12 newPlanSpan">
        <form class="newPlanForm" method="post" action="/users/${user._id}/plans">
        <div class="form-group col-md-3">
        <input class="form-control" type="text" name="plan[name]" placeholder="Plan Name" required>
        </div>
        <div class="form-group col-md-3">
        <input class="form-control" type="number" name="plan[attendees]" placeholder="No. of Attendees" required>
        </div>
        <div class="form-group col-md-3">
        <button class="btn btn-primary"> Make a new Night Plan! </button>
        </div>
        </form>
        </span>
        <h5 class="previousPlans"> My Previous Plans</h5> </div>`);
        for( var i = 0; i < user.plans.length; i++) {
          Planner.$main.append(`<div class="appendContent"> <h6 class="previousPlans"> <a href="${Planner.apiURL}/users/${user._id}/plans/${user.plans[i]._id}" class="planDetail"> ${user.plans[i].name} </a> on ${user.plans[i].date} </h6> </div>`);
        }
      });
    };

    Planner.showPlanDetail = function(e) {
      e.preventDefault();
      return Planner.ajaxRequest(e.currentTarget.href, 'GET', null, plan => {
        Planner.$main.html(`<div class="content"> <a href="/"> Back to my page </a>
        <h6> ${plan.name} (${plan.attendees} people) on ${plan.date} </h6> </div>`);
        for( var i = 0; i < plan.bookings.length; i++) {
          Planner.$main.append(`<div class="appendContent"> <h6> ${plan.bookings[i].type}: ${plan.bookings[i].description}</h6> </div>`);
        }
      });
    };


    Planner.newPlan = function(e) {
      e.preventDefault();
      Planner.ajaxRequest(`${Planner.apiURL}${$(this).attr('action')}`, 'POST', $(this).serialize(), plan => {
        Planner.currentPlan = plan;
      });
      Planner.loadMap();
      Planner.addTheatres();
    };

    Planner.loadMap = function() {
      Planner.$main.html(`<div id="map-canvas"></div>`);
      const canvas = document.getElementById('map-canvas');

      const mapOptions = {
        zoom: 14,
        center: new google.maps.LatLng(51.510067, -0.133869),
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        styles: [{"featureType":"administrative.neighborhood","elementType":"labels.text","stylers":[{"visibility":"simplified"}]},{"featureType":"administrative.land_parcel","elementType":"all","stylers":[{"hue":"#ff4d00"},{"saturation":6},{"lightness":-31},{"visibility":"off"}]},{"featureType":"landscape.man_made","elementType":"geometry","stylers":[{"visibility":"off"}]},{"featureType":"landscape.man_made","elementType":"geometry.fill","stylers":[{"visibility":"off"}]},{"featureType":"landscape.man_made","elementType":"geometry.stroke","stylers":[{"visibility":"off"}]},{"featureType":"landscape.man_made","elementType":"labels","stylers":[{"visibility":"off"}]},{"featureType":"landscape.man_made","elementType":"labels.text","stylers":[{"visibility":"off"}]},{"featureType":"landscape.man_made","elementType":"labels.text.fill","stylers":[{"visibility":"off"}]},{"featureType":"landscape.man_made","elementType":"labels.text.stroke","stylers":[{"visibility":"off"}]},{"featureType":"landscape.man_made","elementType":"labels.icon","stylers":[{"visibility":"off"}]},{"featureType":"poi","elementType":"all","stylers":[{"visibility":"off"}]},{"featureType":"poi.attraction","elementType":"all","stylers":[{"visibility":"off"}]},{"featureType":"poi.attraction","elementType":"geometry","stylers":[{"visibility":"off"}]},{"featureType":"poi.attraction","elementType":"geometry.fill","stylers":[{"visibility":"off"}]},{"featureType":"poi.attraction","elementType":"geometry.stroke","stylers":[{"visibility":"off"}]},{"featureType":"poi.attraction","elementType":"labels","stylers":[{"visibility":"off"}]},{"featureType":"poi.attraction","elementType":"labels.text","stylers":[{"visibility":"off"}]},{"featureType":"poi.attraction","elementType":"labels.text.fill","stylers":[{"visibility":"off"}]},{"featureType":"poi.attraction","elementType":"labels.text.stroke","stylers":[{"visibility":"off"}]},{"featureType":"poi.attraction","elementType":"labels.icon","stylers":[{"visibility":"off"}]},{"featureType":"poi.business","elementType":"labels","stylers":[{"visibility":"off"}]},{"featureType":"poi.government","elementType":"labels","stylers":[{"visibility":"off"}]},{"featureType":"poi.medical","elementType":"labels","stylers":[{"visibility":"off"}]},{"featureType":"poi.park","elementType":"all","stylers":[{"hue":"#8aff00"},{"saturation":17},{"lightness":-2},{"visibility":"on"}]},{"featureType":"poi.park","elementType":"labels","stylers":[{"visibility":"off"}]},{"featureType":"poi.place_of_worship","elementType":"all","stylers":[{"visibility":"off"}]},{"featureType":"poi.school","elementType":"all","stylers":[{"visibility":"off"}]},{"featureType":"poi.sports_complex","elementType":"all","stylers":[{"visibility":"on"}]},{"featureType":"road","elementType":"labels.text","stylers":[{"weight":"0.68"}]},{"featureType":"road.highway","elementType":"all","stylers":[{"hue":"#8aff00"},{"saturation":-47},{"lightness":-17},{"visibility":"simplified"}]},{"featureType":"road.arterial","elementType":"all","stylers":[{"hue":"#ff0000"},{"saturation":"-100"},{"lightness":13},{"visibility":"simplified"}]},{"featureType":"road.local","elementType":"all","stylers":[{"hue":"#ff0000"},{"saturation":"97"},{"lightness":100},{"visibility":"simplified"}]},{"featureType":"road.local","elementType":"labels","stylers":[{"visibility":"off"}]},{"featureType":"transit","elementType":"all","stylers":[{"visibility":"simplified"}]},{"featureType":"transit","elementType":"labels","stylers":[{"visibility":"simplified"}]},{"featureType":"transit","elementType":"labels.text","stylers":[{"visibility":"off"}]},{"featureType":"water","elementType":"all","stylers":[{"hue":"#76aee3"},{"saturation":38},{"lightness":-11},{"visibility":"on"}]}]
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
          const icon = {
            url: 'images/mapmarker.png',
            scaledSize: new google.maps.Size(22, 22),
            origin: new google.maps.Point(0,0),
            anchor: new google.maps.Point(0, 0)
          };
          setTimeout(function() {
            const latlng = new google.maps.LatLng(theatre.latitude, theatre.longitude);
            const marker = new google.maps.Marker({
              position: latlng,
              map: Planner.map,
              animation: google.maps.Animation.DROP,
              icon: icon
            });
            google.maps.event.addListener(marker, 'click', () => {
              if (typeof this.infoWindow !== 'undefined') this.infoWindow.close();
              this.infoWindow = new google.maps.InfoWindow({
                content: `<p class="theatre">${ theatre.name } : <br> <ul class="theatreEvent"> ${events} </ul> </p>`
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

      if(Planner.tempBookingShowName === undefined){
        Planner.tempBookingShowName = e.target.innerHTML;
      }

      Planner.ajaxRequest(`${Planner.apiURL}/Events/${$(this).data('id')}/Performances`, 'GET', null, data => {

        const filteredPerformances = (data.Performances).filter(p => p.TotalAvailableTickesCount > Planner.currentPlan.attendees);

        Planner.$main.html(` <div class="content"> <h2> ${Planner.currentPlan.name} : </h2> <br>
        <h5> ${Planner.currentPlan.attendees} tickets for ${Planner.tempBookingShowName} </h5>
        <p class="smallFont"> ${filteredPerformances.length} options available </p>
        <span class="col-md-12">
        <h6 class="col-md-6"> Got a budget? Search by max ticket price </h6>
        <span class="col-md-4">
        <form class="budgetSearch" data-id=${data.EventId}> <input class="form-control userBudget" type="number" name="userBudget" required> <button class="btn btn-primary"> Search </button> </form>
        </span> </div> <br>`);

        for (var i = 0; i < filteredPerformances.length; i++) {
          const date = moment(`${data.Performances[i].PerformanceDate}`).format('ddd Do MMM YYYY, h:mm a');
          Planner.$main.append(`<div class="appendContent col-md-4"><h6>${date} <button class="bookShow" data-id="${data.Performances[i].PerformanceDate}"> Book </button> </h6> </div>`);
        }
      });
    };

    Planner.choosePerformanceByBudget = function(e) {
      e.preventDefault();
      Planner.ajaxRequest(`${Planner.apiURL}/Events/${$(this).data('id')}/Performances`, 'GET', null, data => {

        const filteredPerformances = (data.Performances).filter(p => p.MinimumTicketPrice < ($(e.target).find('.userBudget').val()));

        Planner.$main.html(` <div class="content"> <h2> ${Planner.currentPlan.name} :  </h2> <br>
        <h5> ${Planner.currentPlan.attendees} tickets for ${Planner.tempBookingShowName} (max £ ${$(e.target).find('.userBudget').val()} per ticket)</h5>
        <p class="smallFont"> ${filteredPerformances.length} options available </p>

        <button class="btn btn-primary choosePerformance" data-id=${data.EventId}> Back to full search </button> </div> `);

        for (var i = 0; i < filteredPerformances.length; i++) {
          const date = moment(`${data.Performances[i].PerformanceDate}`).format('ddd Do MMM YYYY, h:mm a');
          Planner.$main.append(`<div class="appendContent col-md-4"> <h6>${date} <button class="bookShow" data-id="${data.Performances[i].PerformanceDate}"> Book </button> </h6> </div>`);
        }
      });
    };

    Planner.bookShow = function(e) {
      e.preventDefault();
      Planner.currentPlan.date = ($(e.target).attr('data-id'));
      const data = Planner.currentPlan

      Planner.ajaxRequest(
        `${Planner.apiURL}/users/${Planner.loggedInUserID}/plans/${Planner.currentPlan._id}`, 'PUT',
        data,
        plan => {
          Planner.currentPlan = plan;

          const booking = {
            type: 'Show',
            description: Planner.tempBookingShowName
          };

          Planner.ajaxRequest(
            `${Planner.apiURL}/users/${Planner.loggedInUserID}/plans/${Planner.currentPlan._id}`,
            'POST',
            booking,
            plan => {
              Planner.$main.html(`<a href="/"> Back to my page </a>
              <h6> ${plan.name} (${plan.attendees} people) on ${plan.date} </h6>`);
              for( var i = 0; i < plan.bookings.length; i++) {
                Planner.$main.append(`<div class="appendContent"> <h6> ${plan.bookings[i].type}: ${plan.bookings[i].description} </h6> </div>`);
              }
            });
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
