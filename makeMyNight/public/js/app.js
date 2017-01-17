"use strict";var google=google,Planner=Planner||{};Planner.init=function(){return this.apiURL="http://localhost:3000/api",this.$main=$("main"),$(".register").on("click",this.register.bind(this)),$(".login").on("click",this.login.bind(this)),$(".logout").on("click",this.logout.bind(this)),this.$main.on("click",".planDetail",this.showPlanDetail),this.$main.on("submit","form.auth",this.handleForm),this.$main.on("submit",".newPlanForm",this.newPlan),this.$main.on("click",".choosePerformance",this.choosePerformance),this.$main.on("submit",".budgetSearch",this.choosePerformanceByBudget),this.$main.on("click",".bookShow",this.bookShow),this.getToken()?(this.loggedInState(),Planner.loggedInUserID=window.atob(window.localStorage.getItem("token").split(".")[1]).split('"')[3],Planner.ajaxRequest(Planner.apiURL+"/users/"+Planner.loggedInUserID,"GET",null,function(n){Planner.loggedInUser=n,Planner.showLoggedInUser(n)})):(Planner.loggedOutState(),void Planner.generateWelcomePage())},Planner.loggedOutState=function(){$(".login").show(),$(".register").show(),$(".logout").hide()},Planner.generateWelcomePage=function(){Planner.$main.html('<div class="jumbotron">\n  <div class="container">\n  <h1>Welcome!</h1>\n  <h5>Ever had to plan the perfect evening but didn\'t know where to start? <br> <br>\n  Presenting <b> Make My Night </b>. The one stop shop to plan a great evening, with a partner or friends or family! </h5>\n  </div>\n  </div>')},Planner.login=function(n){n.preventDefault(),this.$main.html('\n    <h2>Login</h2>\n    <form class="auth" method="post" action="/login">\n    <div class="form-group">\n    <input class="form-control" type="email" name="emailAddress" placeholder="Email">\n    </div>\n    <div class="form-group">\n    <input class="form-control" type="password" name="password" placeholder="Password">\n    </div>\n    <input class="btn btn-primary" type="submit" value="Login">\n    </form>\n    ')},Planner.register=function(n){n&&n.preventDefault(),this.$main.html('\n      <h2>Register</h2>\n      <form class="auth" method="post" action="/register">\n      <div class="form-group">\n      <input class="form-control" type="text" name="user[name]" placeholder="Fullname">\n      </div>\n      <div class="form-group">\n      <input class="form-control" type="number" name="user[mobile]" placeholder="Mobile Number">\n      </div>\n      <div class="form-group">\n      <input class="form-control" type="email" name="user[emailAddress]" placeholder="Email">\n      </div>\n      <div class="form-group">\n      <input class="form-control" type="password" name="user[password]" placeholder="Password">\n      </div>\n      <div class="form-group">\n      <input class="form-control" type="password" name="user[passwordConfirmation]" placeholder="Password Confirmation">\n      </div>\n      <input class="btn btn-primary" type="submit" value="Register">\n      </form>\n      ')},Planner.handleForm=function(n){n.preventDefault();var e=""+Planner.apiURL+$(this).attr("action"),a=$(this).attr("method"),t=$(this).serialize();return Planner.ajaxRequest(e,a,t,function(n){n.token&&Planner.setToken(n.token),Planner.showLoggedInUser(n.user),Planner.loggedInState()})},Planner.loggedInState=function(){$(".login").hide(),$(".register").hide(),$(".logout").show()},Planner.showLoggedInUser=function(n){Planner.ajaxRequest(Planner.apiURL+"/users/"+n._id,"GET",""+n._id,function(n){Planner.$main.html(" <h2>Hello "+n.name+"</h2>\n          <h5> <b> Email: </b> "+n.emailAddress+"</h5>\n          <h5> <b> Phone: </b> "+n.mobile+'</h5>\n          <br>\n          <br>\n          <form class="newPlanForm" method="post" action="/users/'+n._id+'/plans"\n          <div class="form-group">\n          <input class="form-control" type="text" name="plan[name]" placeholder="Plan Name" required>\n          </div>\n          <div class="form-group">\n          <input class="form-control" type="number" name="plan[attendees]" placeholder="No. of Attendees" required>\n          </div>\n          <button class="btn btn-primary"> Make a new Night Plan! </button>\n          </form>\n          <h5> My Previous Plans</h5>');for(var e=0;e<n.plans.length;e++)Planner.$main.append('<h6> <a href="'+Planner.apiURL+"/users/"+n._id+"/plans/"+n.plans[e]._id+'" class="planDetail"> '+n.plans[e].name+" </a> on "+n.plans[e].date+" </h6>")})},Planner.showPlanDetail=function(n){return n.preventDefault(),Planner.ajaxRequest(n.currentTarget.href,"GET",null,function(n){Planner.$main.html('<a href="/"> Back to my page </a>\n          <h6> '+n.name+" ("+n.attendees+" people) on "+n.date+" </h6>");for(var e=0;e<n.bookings.length;e++)Planner.$main.append("<h6> "+n.bookings[e].description+" </a> at  "+n.bookings[e].postcode+" </h6>")})},Planner.newPlan=function(n){n.preventDefault(),Planner.ajaxRequest(""+Planner.apiURL+$(this).attr("action"),"POST",$(this).serialize(),function(n){Planner.currentPlan=n}),Planner.loadMap(),Planner.addTheatres()},Planner.loadMap=function(){Planner.$main.html('<div id="map-canvas"></div>');var n=document.getElementById("map-canvas"),e={zoom:13,center:new google.maps.LatLng(51.5154,(-.141)),mapTypeId:google.maps.MapTypeId.ROADMAP};this.map=new google.maps.Map(n,e)},Planner.addTheatres=function(){return Planner.ajaxRequest(Planner.apiURL+"/venues","GET",null,function(n){$.each(n,function(n,e){var a="";$.each(e.events,function(n,e){a+='<li> <a href="#" class="choosePerformance" data-id="'+e.EventId+'"> '+e.Name+" </a> </li>"}),setTimeout(function(){var n=this,t=new google.maps.LatLng(e.latitude,e.longitude),o=new google.maps.Marker({position:t,map:Planner.map,animation:google.maps.Animation.DROP});google.maps.event.addListener(o,"click",function(){"undefined"!=typeof n.infoWindow&&n.infoWindow.close(),n.infoWindow=new google.maps.InfoWindow({content:"<p>"+e.name+" : <br> <ul> "+a+" </ul> </p>"}),n.infoWindow.open(Planner.map,o),Planner.map.setCenter(o.getPosition()),Planner.map.setZoom(15)})},50*n)})})},Planner.choosePerformance=function(n){n.preventDefault(),Planner.tempBookingShowName=n.target.innerHTML,Planner.ajaxRequest(Planner.apiURL+"/Events/"+$(this).data("id")+"/Performances","GET",null,function(n){var e=n.Performances.filter(function(n){return n.TotalAvailableTickesCount>Planner.currentPlan.attendees});Planner.$main.html(" <h2> "+Planner.currentPlan.name+" : <br>\n            "+Planner.currentPlan.attendees+" tickets for "+Planner.tempBookingShowName+" </h2>\n            <p> "+e.length+' options available </p>\n            <p> Got a budget? Search by max ticket price </p>\n            <form class="budgetSearch" data-id='+n.EventId+'> <input class="form-control userBudget" type="number" name="userBudget" required> <button class="btn btn-primary"> Search </button> </form> ');for(var a=0;a<e.length;a++)Planner.$main.append("<h6> "+n.Performances[a].PerformanceDate+' <button class="bookShow"> Book </button> </h6>')})},Planner.choosePerformanceByBudget=function(n){n.preventDefault(),Planner.ajaxRequest(Planner.apiURL+"/Events/"+$(this).data("id")+"/Performances","GET",null,function(e){var a=e.Performances.filter(function(e){return e.MinimumTicketPrice<$(n.target).find(".userBudget").val()});Planner.$main.html(" <h2> "+Planner.currentPlan.name+" : <br>\n              "+Planner.currentPlan.attendees+" tickets for "+Planner.tempBookingShowName+" (max £ "+$(n.target).find(".userBudget").val()+" per ticket)</h2>\n              <p> "+a.length+" options available </p>\n              <button data-id="+e.EventId+' class="choosePerformance"> Back to full search </button> ');for(var t=0;t<a.length;t++)Planner.$main.append("<h6> "+e.Performances[t].PerformanceDate+' <button class="bookShow" data-id="'+e.Performances[t].PerformanceDate+'"> Book </button> </h6>')})},Planner.bookShow=function(n){n.preventDefault(),Planner.currentPlan.date=$(".bookShow").attr("data-id"),Planner.ajaxRequest(Planner.apiURL+"/users/"+Planner.loggedInUserID+"/plans/"+Planner.currentPlan._id,"PUT",Planner.currentPlan,function(n){var e={type:"Show",description:Planner.tempShowName};Planner.ajaxRequest(Planner.apiURL+"/users/"+Planner.loggedInUserID+"/plans/"+Planner.currentPlan._id,"POST",e,function(n){console.log(n),Planner.$main.html('<a href="/"> Back to my page </a>\n                    <h6> '+n.name+" ("+n.attendees+" people) on "+n.date+" </h6>");for(var e=0;e<n.bookings.length;e++)Planner.$main.append("<h6> "+n.bookings[e].type+": "+n.bookings[e].description+" </h6>")})})},Planner.logout=function(n){return n.preventDefault(),Planner.generateWelcomePage(),Planner.loggedOutState(),window.localStorage.clear()},Planner.getToken=function(){return window.localStorage.getItem("token")},Planner.ajaxRequest=function(n,e,a,t){return $.ajax({url:n,method:e,data:a,beforeSend:this.setRequestHeader.bind(this)}).done(t).fail(function(n){console.log(n)})},Planner.setToken=function(n){return window.localStorage.setItem("token",n)},Planner.setRequestHeader=function(n){return n.setRequestHeader("Authorization","Bearer "+this.getToken())},$(Planner.init.bind(Planner));