// input: start-date, end-date, number of persons, number of kids, number of rooms wished
//output: list of rooms available at these dates for the amount of people.

function isEmailValid(email) {
    var pattern = /^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/;
    return email.match(pattern);
}

function sort_by_key(array, key) {
    return array.sort(function (a, b) {
        var x = a[key]; var y = b[key];
        return ((x < y) ? -1 : ((x > y) ? 1 : 0));
    });
}

function getBookId(roomid, bookedDate){
    
    aDate=bookedDate.getTime();
    for(let books in model.bookings){
                            
        if(model.bookings[books].dates && model.bookings[books].room_id == roomid){
            for(let bookedDates of model.bookings[books].dates){
                console.log (bookedDates +"-"+ aDate)
                if(bookedDates == aDate){
                    return books;
                }
               
            }

        }
    }
}

function alterbooking(bookingId){
    Date.prototype.addDays = function (days) { //funker som fjell 
        var date = new Date(this.valueOf());
        date.setDate(date.getDate() + days);
        return date;
    }
    for(booking in model.bookings){
        if(booking == bookingId){
            let dates=[];
            let startDate 
            let endDate ;


            //fjerne utgåtte datoer fra rooms eller legge til. etter nye datoer er blitt regnet ut. 


            if(model.input.start_date != ''){
                startDate = new Date( model.input.start_date);
            }else{
                startDate = new Date(model.bookings[bookingId].dates[0]);
            }
            if(model.input.end_date != ''){
                endDate = new Date (model.input.end_date);
            }else{
                endDate = new Date (model.bookings[bookingId].dates[model.bookings[bookingId].dates.length-1])
            }
            //while bookings_dates < booking dates
           
           // hvorfor sletter ikke denne første datoen ????? hvorfor må den kjøres 2 ganger ???
                for(let i =0; i < model.bookings[booking].dates.length; i++){ 
                   console.log(i);
                    if(model.rooms[model.bookings[booking].room_id].booked_dates.includes(model.bookings[booking].dates[i]) ){
                        model.rooms[model.bookings[booking].room_id].booked_dates.splice(model.rooms[model.bookings[booking].room_id].booked_dates.indexOf(model.bookings[booking].dates[i]), 1);
                        console.log( model.rooms[model.bookings[booking].room_id].booked_dates)
                    }
                }
                for(let i =0; i < model.bookings[booking].dates.length; i++){ 
                    console.log(i);
                     if(model.rooms[model.bookings[booking].room_id].booked_dates.includes(model.bookings[booking].dates[i]) ){
                         model.rooms[model.bookings[booking].room_id].booked_dates.splice(model.rooms[model.bookings[booking].room_id].booked_dates.indexOf(model.bookings[booking].dates[i]), 1);
                         console.log( model.rooms[model.bookings[booking].room_id].booked_dates)
                     }
                 }
                model.bookings[booking].dates.splice(0, model.bookings[booking].dates.length);

                let romnr = model.input.romnr;

                if(romnr == undefined){
                    romnr = model.bookings[booking].room_id;
                }
                if(! model.rooms[romnr].booked_dates){
                    model.rooms[romnr].booked_dates = [];
                }
            while(startDate.getTime() <= endDate.getTime()){
                dates.push(startDate.getTime());
                model.bookings[booking].dates.push(startDate.getTime())
                model.rooms[romnr].booked_dates.push(startDate.getTime());
                startDate = startDate.addDays(1)
            }

           

            model.bookings[booking]={
                room_id: romnr,
                dates: dates,
                userId: 3,
                num_of_pers: model.input.num_of_pers,
                booking_number: bookingId,
            }
            
            database.ref('bookings').set(model.bookings)
            database.ref("rooms").set(model.rooms)
            
        }
    }
}

function storeGuestPersonalia(){
    
    let currentUser = model.userId_counter;
        model.userId_counter ++
        model.page.error = '';
        model.users[currentUser] = {
            role: 'guest',
            userId: currentUser,
            personalia: {
                first_name: model.input.tempFirstName,
                last_name: model.input.tempLastName,
                street: model.input.tempStreet,
                city: model.input.tempCity,
                country: model.input.tempCountry,
                email: model.input.tempEmail,
                tel_num: model.input.tempTel,
            },
            cart: [] = model.users[2].cart
        };
        model.page.current_user = currentUser;
        updateView();
}




function login (){
    for (i in model.users){
        if(model.input.tempUser == model.users[i].personalia.email && model.input.tempPassw == model.users[i].password){
            model.page.current_user = model.users[i].userId;
            console.log(model.page.page_pos);
            if (model.users[model.page.current_user].role == 'admin' && model.page.page_pos != 'Personalia cart') {
                setAdminPanel();
            } else if(model.page.page_pos == 'Personalia cart'){
                model.users[model.page.current_user].cart = model.users[2].cart;
                model.users[2].cart = [];
                model.page.page_pos = 'Personalia cart';
            }
            else {
                setUserPanel();
            }
            model.input.tempUser = '';
            model.input.tempPassw = '';
            
            updateView();
        }else{
            model.page.error = 'Galt brukernavn eller passord';
            updateView();
        }
    }
}
function logout(){
    model.page.current_user = 2; 
    setHomeView();
}
function put_in_cart(roomId){
    var booking = {
        room_id: roomId,
        userId: model.page.current_user,
        dates: [], 
        num_of_pers: model.input.num_of_pers,
        booking_number: 1,
    }
    //get at list of all the dates between the start and end date
    var start = model.input.start_date
    var end = model.input.end_date
    var dates_array = []
    var current_day = start
    while(current_day <= end){
        var newDate = new Date(current_day)
        dates_array.push(newDate.getTime())
        current_day = current_day.addDays(1)
    }
    booking.dates = dates_array
     
    // Booking number creation
    var booking_number = "start"
    var possible= "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
    var check_point = true
    while(check_point){
        booking_number = ""
        for (var i = 0; i < 5; i++){
            booking_number += possible.charAt(Math.floor(Math.random() * possible.length));
        }
        if(model.booking_numbers.includes(booking_number)) continue;
        else {
            booking.booking_number = booking_number
            model.booking_numbers.push(booking_number)
            check_point = false
            database.ref('booking_numbers').set(model.booking_numbers)
        }
    }
    
    if(model.users[model.page.current_user].cart) model.users[model.page.current_user].cart.push(booking);
    else{
        model.users[model.page.current_user].cart = [booking]                
    }
    database.ref("users/"+ model.page.current_user).set(model.users[model.page.current_user])

    updateView()
        
}

function delete_from_cart(bookingnr){
    
    for (a in model.users[model.page.current_user].cart){
        if(model.users[model.page.current_user].cart[a].booking_number = bookingnr)
            model.users[model.page.current_user].cart.splice(a,1)
            database.ref("users/"+model.page.current_user).set(model.users[model.page.current_user] )
    }
    
    for ( i in model.booking_numbers){
        if(model.booking_numbers[i] == bookingnr) {
            model.booking_numbers.splice(i,1);
            database.ref("booking_numbers").set(model.booking_numbers)
            break
        }
    }

    updateView()
    

}
function deleteBooking(){
    
    let bookingId = model.input.adminSearchBookingNr;
    
    let roomNr = model.bookings[bookingId].room_id
    let booked_dates = model.bookings[bookingId].dates
    for ( i in booked_dates){
        console.log(i);
            console.log(i + "in the iffy");
            model.rooms[roomNr].booked_dates.splice(model.rooms[roomNr].booked_dates.indexOf(booked_dates[i]),1)
       
        
    }
    delete model.bookings[bookingId]
    database.ref("bookings/" + bookingId).set('')
    database.ref("rooms/"+ roomNr).set(model.rooms[roomNr])
   // test this with new model before deleting below
    

   /* for(a in model.bookings){
       if(model.bookings[a].booking_number == bookingId){
           
            roomNr = model.bookings[a].room_id;
            if(model.bookings[a].dates != undefined){
                for(let date in model.bookings[a].dates){
                    booked_dates.push(model.bookings[a].dates[date])
                }
            }
            
            
            for(let bookingdate of model.bookings[a].dates){
                for(var i =0; i<model.rooms[z].booked_dates.length; i++){
                    
                    bookingdate = new Date(bookingdate);
                    let rom_bookingdate = new Date(model.rooms[z].booked_dates[i]);
                    
                    if(bookingdate.getTime() === rom_bookingdate.getTime()){
                        
                        model.rooms[z].booked_dates.splice(i, 1)
                        var roomsRef = database.ref('rooms');
                        roomsRef.set(model.rooms);
                    }
                }
            }
                        
                        
                  
                
            }
            model.bookings.splice(a, 1);

            var rootRef = database.ref('bookings');
   
            rootRef.set(model.bookings);



        }
    }*/
}
function book() {
    //adding booking from cart to bookings and booked_dates of rooms
    for (booking of model.users[model.page.current_user].cart) {
        model.bookings[booking.booking_number] = booking
        if(!model.rooms[booking.room_id].booked_dates) model.rooms[booking.room_id].booked_dates = [];
        for(date of booking.dates){
            model.rooms[booking.room_id].booked_dates.push(date)
        }
        if(model.users[model.page.current_user].list_of_bookings){
            model.users[model.page.current_user].list_of_bookings.push(booking)
        }
        else{
            model.users[model.page.current_user].list_of_bookings = [booking,]
        }
        
    }
    // emptying cart
    model.users[model.page.current_user].cart = []
    //updating database
    database.ref('bookings').set(model.bookings)
    database.ref('users').set(model.users)
    database.ref('rooms').set(model.rooms)

    //needs further connection to next side!!!!!

}

function storePersonalia(){
    if (model.input.tempUserName != undefined && model.input.tempUserName != '') {
        model.users[model.page.current_user].username = model.input.tempUserName;
    }
    if (model.input.tempPassw != undefined && model.input.tempPassw != '') {
        model.users[model.page.current_user].password = model.input.tempPassw;
    }
    if (model.input.tempFirstName != undefined && model.input.tempFirstName != '') {
        model.users[model.page.current_user].personalia.first_name = model.input.tempFirstName;
    }
    if (model.input.tempLastName != undefined && model.input.tempLastName != '') {
        model.users[model.page.current_user].personalia.last_name = model.input.tempLastName;
    }
    if (model.input.tempStreet != undefined && model.input.tempStreet != '') {
        model.users[model.page.current_user].personalia.street = model.input.tempStreet;
    }
    if (model.input.tempCity != undefined && model.input.tempCity != '') {
        model.users[model.page.current_user].personalia.city = model.input.tempCity;
    }
    if (model.input.tempCountry != undefined && model.input.tempCountry != '') {
        model.users[model.page.current_user].personalia.country = model.input.tempCountry;
    }
    if (model.input.tempEmail != undefined && model.input.tempEmail != '') {
        model.users[model.page.current_user].personalia.email = model.input.tempEmail;
    }
    if (model.input.tempTel != undefined && model.input.tempTel != '') {
        model.users[model.page.current_user].personalia.tel_num = model.input.tempTel;
    }
    updateView();
}

function newUser(){
    let isUnique = true;

    let validEmail = isEmailValid(model.input.tempEmail);
    for(u in model.users){
        if(model.users[u].personalia.email == model.input.tempEmail){ //epost er ikke unik 
           model.page.error = 'Eposten '+ model.input.tempEmail+ ' eksisterer fra før - velg ny epost';
           updateView();
           isUnique = false;
        }
    }
    if (isUnique && validEmail) { //epost er unik
        let currentUser = model.userId_counter;
        model.userId_counter ++
        model.page.error = '';
        model.users[currentUser] = {
            password: model.input.tempPassw,
            role: 'user',
            userId: currentUser,
            personalia: {
                first_name: model.input.tempFirstName,
                last_name: model.input.tempLastName,
                street: model.input.tempStreet,
                city: model.input.tempCity,
                country: model.input.tempCountry,
                email: model.input.tempEmail,
                tel_num: model.input.tempTel,
            },
            list_of_bookings: []
        };
        model.page.current_user = currentUser;
        model.page.page_pos = 'login';
        //updating database
        database.ref('users/' + currentUser).set(model.users[currentUser]);
        database.ref('userId_counter').set(model.userId_counter);

        updateView();
    } else if (!validEmail) {
        model.page.error = 'Eposten ' + model.input.tempEmail + ' er ikke korrekt ';
        updateView();
    }
}

Date.prototype.addDays = function(days) {
    var date = new Date(this.valueOf());
    date.setDate(date.getDate()+days);
    return date
}

function search() {
    var start = model.input.start_date
    var end = model.input.end_date
    var pers = model.input.num_of_pers
    //var kids = model.input.num_of_kids
    var num_rooms = model.input.num_of_rooms
    var available_rooms = []
    //var fitting_rooms = []
    model.page.error = ""
    model.page.search_results = []

    //get at list of all the dates between the start and end date
    var dates_array = []
    var current_day = start
    while(current_day <= end){
        var newDate = new Date(current_day)
        dates_array.push(newDate.getTime())
        current_day = current_day.addDays(1)
    }
    
    

    // check all the rooms that are free on all of these days and add them to available rooms
    var counter = 0
    for ( var room in model.rooms) {
        var booked_dates = []
        if (model.rooms[room].booked_dates == undefined){
            available_rooms.push(model.rooms[room]) 
            continue
        }
        else{
       
            for (var date of model.rooms[room].booked_dates){
                booked_dates.push(date)
                
            }

        }  
        
        for (var date of dates_array){
            if(booked_dates.includes(date)) break;
            else counter ++
        }
        if (counter === dates_array.length) available_rooms.push(model.rooms[room])
        counter = 0
    }

    //total available beds
    var tot_beds = 0
    for (var room of available_rooms){
        tot_beds += room.beds
    }
    //available_rooms empty
    if(available_rooms.length === 0) {
        model.page.error = "No rooms available during the chosen dates. Please choose another time for your stay.";
        return
    }
    //check available_rooms if enough rooms available
    else if(available_rooms.length < num_rooms) {
        model.page.error = "There are not enough rooms during the dates you have chosen"
        return
    }
   
    // only one room wished -> checks is this rooms has enough beds
    /*
    else if(num_rooms === 1){
        for (var room in available_rooms) {
            if (room.beds >= pers){
                fitting_rooms.push(room)
            }
        }
        model.page.search_results = fitting_rooms
        return
    }
    */
    // if not enough beds in all the available rooms
    else if (tot_beds < pers) {
        model.page.error = "There are not enough beds available at the chosen dates."
        return
    }
        // if enough rooms and beds are available it return the list of rooms
    else {
        model.page.search_results = available_rooms
        return
    }

}

function input_updater(input_field) {
    if (input_field.name == "startDato") {
        model.input.start_date = new Date (input_field.valueAsDate);
        var sluttDatoField = document.getElementById('sluttDatoField')
        sluttDatoField.min = date_fixer(model.input.start_date)
    } else if (input_field.name == "sluttDato") {
        model.input.end_date = input_field.valueAsDate;
    } else if (input_field.name == "antallPersoner") {
        model.input.num_of_pers = parseInt(input_field.value);
        html = ``
        for (i=1; i<=model.input.num_of_pers; i++){
            if(model.input.num_of_rooms == i){
                html += `
                    <option value="${i}" selected="selected">${i}</option>
                    `
            }
            else {
                html += `
                <option value="${i}">${i}</option>
                `
            }
        }
        document.getElementById("romvelger").innerHTML = html
        document.getElementById('romvelger').value = model.input.num_of_rooms
        if(model.input.num_of_rooms>model.input.num_of_pers){
            model.input.num_of_rooms = model.input.num_of_pers
            document.getElementById('romvelger').value = model.input.num_of_pers
        }
    }
    else if (input_field.name == "antallrom") {
        model.input.num_of_rooms = parseInt(input_field.value);
    }
  }
