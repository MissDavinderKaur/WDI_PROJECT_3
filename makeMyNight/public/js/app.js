"use strict";var google=google,Planner=Planner||{};Planner.init=function(){return this.apiURL="http://localhost:3000/api",this.$main=$("main"),$(".register").on("click",this.register.bind(this)),$(".login").on("click",this.login.bind(this)),$(".logout").on("click",this.logout.bind(this)),this.$main.on("submit","form",this.handleForm),this.$main.on("click",".newPlan",this.newPlan.bind(this)),this.$main.on("click",".performances",this.choosePerformance.bind(this)),this.getToken()?(this.loggedInState(),Planner.loggedInUserID=window.atob(window.localStorage.getItem("token").split(".")[1]).split('"')[3],Planner.ajaxRequest(Planner.apiURL+"/users/"+Planner.loggedInUserID,"GET",null,function(n){Planner.showLoggedInUser(n)})):(this.loggedOutState(),void this.generateWelcomePage())},Planner.loggedOutState=function(){$(".login").show(),$(".register").show(),$(".logout").hide()},Planner.generateWelcomePage=function(){Planner.$main.html('<div class="jumbotron">\n  <div class="container">\n  <h1>Welcome!</h1>\n  <h5>Ever had to plan the perfect evening but didn\'t know where to start? <br> <br>\n  Presenting <b> Make My Night </b>. The one stop shop to plan a great evening, with a partner or friends or family! </h5>\n  </div>\n  </div>')},Planner.login=function(n){n.preventDefault(),this.$main.html('\n    <h2>Login</h2>\n    <form method="post" action="/login">\n    <div class="form-group">\n    <input class="form-control" type="email" name="emailAddress" placeholder="Email">\n    </div>\n    <div class="form-group">\n    <input class="form-control" type="password" name="password" placeholder="Password">\n    </div>\n    <input class="btn btn-primary" type="submit" value="Login">\n    </form>\n    ')},Planner.register=function(n){n&&n.preventDefault(),this.$main.html('\n      <h2>Register</h2>\n      <form method="post" action="/register">\n      <div class="form-group">\n      <input class="form-control" type="text" name="user[name]" placeholder="Fullname">\n      </div>\n      <div class="form-group">\n      <input class="form-control" type="number" name="user[mobile]" placeholder="Mobile Number">\n      </div>\n      <div class="form-group">\n      <input class="form-control" type="email" name="user[emailAddress]" placeholder="Email">\n      </div>\n      <div class="form-group">\n      <input class="form-control" type="password" name="user[password]" placeholder="Password">\n      </div>\n      <div class="form-group">\n      <input class="form-control" type="password" name="user[passwordConfirmation]" placeholder="Password Confirmation">\n      </div>\n      <input class="btn btn-primary" type="submit" value="Register">\n      </form>\n      ')},Planner.handleForm=function(n){n.preventDefault();var e=""+Planner.apiURL+$(this).attr("action"),t=$(this).attr("method"),a=$(this).serialize();return Planner.ajaxRequest(e,t,a,function(n){n.token&&Planner.setToken(n.token),Planner.showLoggedInUser(n.user),Planner.loggedInState()})},Planner.loggedInState=function(){$(".login").hide(),$(".register").hide(),$(".logout").show()},Planner.showLoggedInUser=function(n){Planner.$main.html(" <h2>Hello "+n.name+"</h2>\n        <h5> <b> Email: </b> "+n.emailAddress+"</h5>\n        <h5> <b> Phone: </b> "+n.mobile+'</h5>\n        <br>\n        <p> <a href="/users/'+n._id+'/edit" > <button class="btn btn-primary"> Edit User Details </button> </a>\n        <form action="/users/'+n._id+'" method="post">\n        <input type="hidden" name="_method" value="delete">\n        <button class="btn btn-danger"> Delete User </button>\n        </form>\n        <br>\n        <button class="btn btn-primary newPlan"> Make a new Night Plan! </button>\n        <h5> My Nightplans</h5>');for(var e=0;e<n.plans.length;e++){Planner.$main.append("<h6> "+n.plans[e].name+" on "+n.plans[e].date+" (Attendees: "+n.plans[e].attendees+" )</h6>");for(var t=0;t<n.plans[e].bookings.length;t++)Planner.$main.append("<h6> "+n.plans[e].bookings[t].description+" </h6>")}},Planner.newPlan=function(n){n.preventDefault(),this.loadMap(),this.addTheatres()},Planner.loadMap=function(){Planner.$main.html('<div id="map-canvas"></div>');var n=document.getElementById("map-canvas"),e={zoom:13,center:new google.maps.LatLng(51.5154,(-.141)),mapTypeId:google.maps.MapTypeId.ROADMAP};this.map=new google.maps.Map(n,e)},Planner.addTheatres=function(){return Planner.ajaxRequest(Planner.apiURL+"/venues","GET",null,function(n){$.each(n,function(n,e){var t="";$.each(e.events,function(n,e){t+='<li> <a class="performances" href="'+Planner.apiURL+"/events/"+e.EventId+'/performances"> '+e.Name+" </a> </li>"}),setTimeout(function(){var n=this,a=new google.maps.LatLng(e.latitude,e.longitude),o=new google.maps.Marker({position:a,map:Planner.map,animation:google.maps.Animation.DROP});google.maps.event.addListener(o,"click",function(){"undefined"!=typeof n.infoWindow&&n.infoWindow.close(),n.infoWindow=new google.maps.InfoWindow({content:"<p>"+e.name+" : <br> <ul> "+t+" </ul> </p>"}),n.infoWindow.open(Planner.map,o),Planner.map.setCenter(o.getPosition()),Planner.map.setZoom(15)})},50*n)})})},Planner.choosePerformance=function(n){n.preventDefault(),Planner.ajaxRequest(""+this.attr("href"),"GET",null,function(n){console.log(n)})},Planner.logout=function(n){return n.preventDefault(),Planner.generateWelcomePage(),Planner.loggedOutState(),window.localStorage.clear()},Planner.getToken=function(){return window.localStorage.getItem("token")},Planner.ajaxRequest=function(n,e,t,a){return $.ajax({url:n,method:e,data:t,beforeSend:this.setRequestHeader.bind(this)}).done(a).fail(function(n){console.log(n)})},Planner.setToken=function(n){return window.localStorage.setItem("token",n)},Planner.setRequestHeader=function(n){return n.setRequestHeader("Authorization","Bearer "+this.getToken())},$(Planner.init.bind(Planner));