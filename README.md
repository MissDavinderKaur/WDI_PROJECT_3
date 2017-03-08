# WDI\_PROJECT\_3: Manage My Madness

##Overview
The objective of this project was to build a map-based MEAN stack application, preferrably using an external API. As I really enjoy planning days out in London, I decided to build an app centred around planning an evening (centred around theatre/shows)

The application can be found here

##How it works
Once the user has logged in, they can create a new plan. Each plan begins with a map-view of event options around London. Once the relevant event has been selected, the User can then search details by price (useful if you are on a budget) or by date (if celebrating a occassion for example). Once the tickets have been selected, the user can then add food/drink bookings to the plan. 

##Successes
As basic as it sounds, getting the map to display pins, on the locations in London, where events were happening was a really big win!

##Challenges
When originally designing the application, I had decided that when the user is presented with the map, an AJAX request to the API is made at this point to get the venues and filter by those with events happening. This information would then be plotted on the map. However, this logic was too tricky to build into the front end, and so had to be moved. The best place for this was in a seed file - using Promises, all London venues were retrieved from the API and stored in the DB. Then, for each venue, the array of events was requested and stored. Only those venues with 1 or more events happening, was passed to the view. 
Working out how to do this was very time consuming and so took the majority of the build time. Also, working out how to store an selected  event/venue (into the plan object) required a rework of the OOP 
 
##Next Steps
Due to timme constraints, I was unable to build the functionality to allow users to add food/drink bookings into the plan. Therefore this is the first feature that will need to be built. I think it would also be useful to add attendee details to the plan and be able to email/text the group with times/directions etc.
