// input: start-date, end-date, number of persons, number of kids, number of rooms wished
//output: list of rooms available at these dates for the amount of people.



function login(){
    for (let i = 0; i < model.users.length; i++){
        if(model.input.tempUser == model.users[i].username && model.input.tempPassw == model.users[i].password){
            console.log('logged in as ' + model.users[i].role);
            model.page.current_user = model.users[i].username;
            updateView();
        }
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
        dates_array.push(new Date(current_day))
        current_day = current_day.addDays(1)
    }

    // check all the rooms that are free on all of these days and add them to available rooms
    var counter = 0
    for ( var room of model.rooms) {
        for (var date of dates_array){
            if(room.booked_dates.includes(date)) break;
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
    console.log(available_rooms)
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