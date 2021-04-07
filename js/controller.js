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


function login (){
    for (let i = 0; i < model.users.length; i++){
        if(model.input.tempUser == model.users[i].personalia.email && model.input.tempPassw == model.users[i].password){
            console.log('logged in as ' + model.users[i].role);
            model.page.current_user = model.users[i].userId;
            if (model.users[model.page.current_user].userId == 0) {
                setAdminPanel();
            } else {
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

function book(roomId) {
    let bookings = [];
    bookings = model.bookings;
    let date = new Date();
    date.setMilliseconds(model.input.start_date);
    let endDate = new Date();
    endDate.valueOf(model.input.end_date);
    var string = model.input.start_date;

    /* får error fordi room.bookings ikke finnes // need some work. funker når dataen i db finnes: nærmere bestemt når room har en booked dates.
    for (let rom of model.rooms) { // need some work. 
        if (rom.room_id == roomId) {

            rom.booked_dates.push(date.valueOf());
            console.log(rom.booked_dates);
            var rootRef = database.ref('rooms');
            rootRef.set(model.rooms);
        }
    }
    */
    //date.setDate(string.getDate());

    bookings.push({ //finished need the rest of the dates... 
        room_id: roomId,
        userId: model.page.current_user,
        dates: [date.valueOf()],
        num_pers: model.input.num_of_pers,
        booking_number: bookings.length,
    }
    )
    model.bookings = bookings;

    var rootRef = database.ref('bookings');
    var newStoreRef = rootRef.push();
    newStoreRef.set(model.bookings[model.bookings.length - 1]);
}

function storePersonalia(){
    if(model.input.tempUserName != ''){
        model.users[model.page.current_user].username = model.input.tempUserName;
    }
    if(model.input.tempPassw != ''){
        model.users[model.page.current_user].password = model.input.tempPassw;
    }
    if(model.input.tempFirstName != ''){
        model.users[model.page.current_user].personalia.first_name = model.input.tempFirstName;
    }
    if(model.input.tempLastName != ''){
        model.users[model.page.current_user].personalia.last_name = model.input.tempLastName;
    }
    if(model.input.tempStreet != ''){
        model.users[model.page.current_user].personalia.street = model.input.tempStreet;
    }
    if(model.input.tempCity != ''){
        model.users[model.page.current_user].personalia.city = model.input.tempCity;
    }
    if(model.input.tempCountry != ''){
        model.users[model.page.current_user].personalia.country = model.input.tempCountry;
    }
    if(model.input.tempEmail != ''){
        model.users[model.page.current_user].personalia.email = model.input.tempEmail;
    }
    if(model.input.tempTel != ''){
        model.users[model.page.current_user].personalia.tel_num = model.input.tempTel;
    }
    updateView();
}

function newUser(){
    let isUnique = true;

    let validEmail = isEmailValid(model.input.tempEmail);
    for(var user of model.users){
        if(user.personalia.email == model.input.tempEmail){ //epost er ikke unik 
           model.page.error = 'Eposten '+ model.input.tempEmail+ ' eksisterer fra før - velg ny epost';
           updateView();
           isUnique = false;
        }
    }
    if (isUnique && validEmail) { //epost er unik
        let currentUser = model.users.length;
        model.page.error = '';
        model.users.push({
            username: model.input.tempUserName,
            password: model.input.tempPassw,
            role: 'user',
            userId: model.users.length,
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
        });
        model.page.current_user = currentUser;
        model.page.page_pos = 'login';
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
    var fitting_rooms = []

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
    for ( var room of model.rooms) {
        var booked_dates = []
        if (room.booked_dates != undefined) {
       
        for (var date of room.booked_dates){
            booked_dates.push(date.getTime())
            
                }

        }  
        
        for (var date of dates_array){
            if(booked_dates.includes(date)) break;
            else counter ++
        }
        if (counter === dates_array.length) available_rooms.push(room)
        counter = 0
    }

    //total available beds
    var tot_beds = 0
    for (var room of available_rooms){
        tot_beds += room.beds
    }
    //available_rooms empty
    if(available_rooms.length === 0) return "No rooms available during the chosen dates. Please choose another time for your stay."

    //check available_rooms if enough rooms available
    else if(available_rooms.length < num_rooms) return "There are not enough rooms during the dates you have chosen"
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
    else if (tot_beds <= pers) return "There are not enough beds available at the chosen dates."
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
    }
  }

function choose_booking() {
    
}