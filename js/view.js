let app = document.getElementById("app");
datab = {}
async function start() {
    // Getting Data once from Database at the beginning
    var databaseUpdate = new Promise (function(resolve,reject){
        database.ref().once('value', (snap) => {
            resolve(snap.val())
          })
    })
    var data = await databaseUpdate
    model.rooms = data.rooms
    for (user in data.users){
        model.users[user] = data.users[user]
    }

    //model.users = data.users
    datab = data
    /*for (i=0; i< data.rooms.length; i++){
        model.rooms[i].booked_dates = []
        if (data.rooms[i].booked_dates != undefined){            
            for (a  =  0; a  <  data.rooms[i].booked_dates.length;  a++) {
                    model.rooms[i].booked_dates[a] = new Date(data.rooms[i].booked_dates[a])
                }
        }
    }*/
    model.bookings= data.bookings
    model.booking_numbers = data.booking_number;

    database.ref('booking_numbers').on('value', (snap) => {
        model.booking_numbers = snap.val();
    })
    
    //UserID_counter
    model.userId_counter = data.userId_counter

    updateView()
}
start()
function updateView() {
    if (model.page.page_pos == 'home') {
        model.input.start_date = ''
        model.input.end_date = ''
        homepageview();
    } else if (model.page.page_pos == 'searchResults') {
        updateSearchView();
    } else if (model.page.page_pos == 'login') {
        updateLoginView();
    } else if (model.page.page_pos == 'User panel' && model.page.current_user != 2) {
        updateUserpanelView();
    } else if (model.page.page_pos == 'Lag ny bruker') {
        updateNewUserView();
    } else if (model.page.page_pos == 'Admin panel') {
        updateAdminView();
    } else if (model.page.page_pos == 'bookin-view') {
        updatebookingview();
    } else if (model.page.page_pos == 'Admin søk på dato') {
        updateAdminSearchOnDate();
    } else if (model.page.page_pos == 'Admin søk på Booking nr') {
        updateAdminSearchOnBookingNr();
    } else if (model.page.page_pos == 'Vis Booking') {
        updateShowBookingView();
    } else if (model.page.page_pos == 'cart') {
        updateCartView()
    }else if(model.page.page_pos == 'Personalia cart'){
        showSetUserOrPersonalia()
    }else if(model.page.page_pos == 'Edit Booking'){
        showEditBooking();
    }
}
function setHomeView(){
    model.page.page_pos = 'home';
    updateView();
}
function setSearchView() {
    model.page.page_pos = 'searchResults';
    search()
    updateView();
}
function setLoginView(){
    model.page.page_pos ='login';
    updateView();
}
function setUserPanel(){
    model.page.page_pos = 'User panel';
    updateView();
}

function setCreateNewUser(){
    model.page.page_pos = 'Lag ny bruker';
    updateView();
}

function setAdminPanel() {
    model.page.page_pos = 'Admin panel';
    updateView();
}
function setAdminSearchOnDate() {
    model.page.page_pos = 'Admin søk på dato';
    updateView();
}
function setAdminSearchOnBookingNr() {
    model.page.page_pos = 'Admin søk på Booking nr';
    updateView();
}
function setShowBookingView() {
    model.page.page_pos = 'Vis Booking';
    updateView();
}
function setCart() {
    model.page.page_pos='cart'
    updateView()
}
function setUserOrPersonaliaCart(){
    model.page.page_pos = 'Personalia cart'
    updateView();
}
function setshowEditBooking(){
    model.page.page_pos = 'Edit Booking';
    updateView();
}

function showEditBooking(){
    let html = '';
    model.input.adminSearchBookingNr = model.input.selectedBookingNr; 
    html += viewHeader();
    for (booking in model.bookings){
        if(model.bookings[booking].booking_number == model.input.adminSearchBookingNr ){
            let start_date = new Date(model.bookings[booking].dates[0]);
            let end_date = new Date(model.bookings[booking].dates[model.bookings[booking].dates.length - 1])
            if(start_date){
                startdate = start_date.getFullYear() 
                if(start_date.getMonth()+1 <10) startdate +=  '-' + '0' + (start_date.getMonth()+1) + '-'
                else startdate +=  '-' + (start_date.getMonth()+1) + '-'
                if (start_date.getDate()<10) startdate += '0'+ start_date.getDate();
                else startdate += start_date.getDate();
            }
            if(end_date){
                enddate = end_date.getFullYear() 
                if(end_date.getMonth()+1 <10) enddate +=  '-' + '0' + (end_date.getMonth()+1) + '-'
                else enddate +=  '-' + (end_date.getMonth()+1) + '-'
                if (end_date.getDate()<10) enddate += '0'+ end_date.getDate();
                else enddate += end_date.getDate();
            }

           
            console.log(end_date);
            html+= `
            <label for="startDato">Start Dato:</label>
            <input type="date" name="startDato" onchange="input_updater(this)" min='${date_fixer(new Date())}' value="${startdate}">
            <br><label class="margin" for="sluttDato">Slutt Dato:</label>
            <input id="sluttDatoField" type="date" name="sluttDato" onchange="input_updater(this)" min='${date_fixer(new Date())}' value="${enddate}">
            <br><label class="margin" for="antallPersoner">Antall Voksene:</label>  
            <select id="personer" type="text" name="antallPersoner" value="${model.bookings[booking].num_of_pers} onchange="input_updater(this)">
            `;
            for (i = 1; i<9;i++){
                if(model.input.num_of_pers == i){
                    html += `
                        <option value="${i}" selected="selected">${i}</option>
                        `;
                }
                else {
                    html += `
                    <option value="${i}">${i}</option>
                    `;
                };
            };
            html+=`
            </select>
            <br><label class="margin" for="romNr">Romtype:</label>  
            <select id="rom" type="text" name="romNr" value="${model.bookings[booking].room_id}" onchange = "model.input.romnr = this.value">
            
            `;
            for (let rom in model.rooms){
                if(model.bookings[booking].room_id == rom){
                    html += `
                        <option value="${model.rooms[rom].room_id}" selected="selected">${model.rooms[rom].room_type}</option>
                        `;
                }
                else {
                    html += `
                    <option value="${model.rooms[rom].room_id}">${model.rooms[rom].room_type}</option>
                    `;
                };
            };
            html += `</select>
            <button onclick="alterbooking('${booking}')">Save</button>`
        }
    }
    app.innerHTML = html;
}
function showSetUserOrPersonalia(){
    let html=``;
    html += viewHeader();
    if(model.page.current_user == 2){
        html += `
    <h2>Log inn, lag en ny bruker eller fyll ut personalia:</h2>
    <div id="personaliaWrapper">
    
    <div class="Login"> 
    <h2>Login </h2>
        <p style="color:red;" class="error">${model.page.error}</p>   
        <label for="user">Brukernavn:</label><br>
        <input type="text" placeholder="Skriv inn brukernavn" onchange="model.input.tempUser = this.value" name="user"><br>
        <label for="psw">Passord:</label><br>
        <input type="password" placeholder="Skriv inn passord" onchange="model.input.tempPassw = this.value" name="psw" >
        <br>
        <button onclick="login(); setUserOrPersonaliaCart();" class="btn"><i class="fas fa-sign-in-alt"></i>login</button><br>
        <button onclick="setCreateNewUser()" class="blueButton"  ><i class="fas fa-user"></i> Ny bruker</button>
        
    </div>
    
   
        `;
    html += `
        <div>
        
        <div id="usersPannel">
        <h2>Fyll ut personalia </h2>
        <p>Fyll ut alle feltene nedenfor for å booke</p>
        <p class="red">${model.page.error}</p>
        <br><h3>Personalia:</h3><br><label for="email">Email:</label><br>
        <input name="email"  onchange="model.input.tempEmail = this.value"><br>
            <br><h3>Navn:</h3><br><label for="firstname">Fornavn:</label><br>
            <input name="firstName"  onchange="model.input.tempFirstName = this.value" ><br>
            <label for="lastname">Etternavn:</label><br>
            <input name="lastname"  onchange="model.input.tempLastName = this.value" ><br>
            <br><h3>Adresse:</h3> <br><label for="street">Gatenavn:</label><br>
            <input name="street"  onchange="model.input.tempStreet = this.value" ><br>
            <label for="city">By:</label><br>
            <input name="city"  onchange="model.input.tempCity = this.value" ><br>
            <label for="country">Land:</label><br>
            <input name="country"  onchange="model.input.tempCountry = this.value"><br>
            <br><h3>Kontakt:</h3><br><label for="tel">Telefon:</label><br>
            <input name="tel"  onchange="model.input.tempTel = this.value"><br>
            <button onclick="storeGuestPersonalia()" class="btn">Lagre</button>
            </div>
        </div>
        </div>
    `;
    }else{
        
        html += `
        <h2>Du har nå booket ditt hotelrom</h2>

        `;
        book();
    }
    
    app.innerHTML = html;
}
function updateShowBookingView() {
    let html;
    html += viewHeader();

   

    bookingNr=model.input.selectedBookingNr

    html += '<div class="bookingnrWrapper">';
    html += `<div class="hero"><img src='${model.rooms[model.bookings[bookingNr].room_id].img_url}'></div>`;
    html += '<div class="bookingnrContentWrapper"  >';
    html += `<h2>${model.rooms[model.bookings[bookingNr].room_id].room_type}</h2>`;
    html += `<p>${model.rooms[model.bookings[bookingNr].room_id].room_prices}</p>`;
    html += `<p>Bookingnr: ${bookingNr}</p>`;
    html += `<p>Romnr: ${model.bookings[bookingNr].room_id}</p>`;
    html += `<p>Antall personer: ${model.bookings[bookingNr].num_pers}</p>`;
    html += '<p>Reserverte datoer: ';
    for (let date of model.bookings[bookingNr].dates) {
        date = new Date(date);
        html += date.getDate() + '.' + date.getMonth() + '.' + date.getFullYear() + ' -> ';
    }
    html += '</p>';
    html += '<button onclick="deleteBooking()" class="deleteButton"><i class="fas fa-trash-alt"></i> Slett reservasjon</button>';
    html += '<button class="alterButton"><i class="fas fa-redo"></i> Endre reservasjon</button>';
    html += '</div></div>';
            
    html += footerView(); 
    app.innerHTML = html;
}
function updateCartView() {
    var html = ''
    var chosen_room
    html += viewHeader();
    if (model.users[model.page.current_user].cart && model.users[model.page.current_user].cart != []) {
        for (booking of model.users[model.page.current_user].cart) {
            for (room in model.rooms) {
                if (model.rooms[room].room_id == booking.room_id) {
                    chosen_room = room;
                    html += `
                        <div class="card">
                        <p>${room}
                        <div id="${room}">
                        <img src='${model.rooms[room].img_url}' alt="Standard" width="350" height="200">
                        <p>Room Type: ${model.rooms[room].room_type}</p>
                        <p>Price: ${model.prices[model.rooms[room].room_type]}</p>
                        <p>Startdato: ${new Date(booking.dates[0])}</p>
                        <p>Sluttdato: ${new Date(booking.dates[booking.dates.length - 1])}</p>
                        <button onclick="delete_from_cart('${booking.booking_number}')" class="btn"><i class="fas fa-trash-alt"></i>Fjern fra Handlevogn</button>
                        </div>
                        </div>
                        `
                }
            }


        }
    }
    else {
        html += `<h1>Your shopping Cart is empty</h1>`
    }

    html += `<button onclick="setUserOrPersonaliaCart()" class="btn"><i class="fas fa-shopping-cart"></i> Kjøpe</button>`

    html += footerView();
    app.innerHTML = html
}

function updateAdminSearchOnBookingNr() {
    let html = ``;
    let imgSrc = ``;
    html += viewHeader();
    html += `<div><label for="search">Søk:</label><input name="search" onchange="model.input.adminSearchBookingNr = this.value" placeholder="Søk på bookingnr"><button class="btn small" onclick="setAdminSearchOnBookingNr()">Søk</button> <label for="date">Dato:</label><input onchange="model.input.adminSeachDate = this.value" type="date" name="date"><button class="btn small" onclick="setAdminSearchOnDate()">Søk</button> </div>`;
    html += `<div id="bookingNrSearch">`
    //sort in loop smallest date first. create view with first date first. and show for a week. 

    for (let booking in model.bookings) {
        console.log(typeof booking)
        console.log(model.bookings[booking].room_id)
        if (booking == model.input.adminSearchBookingNr) {
            html += '<div class="bookingnrWrapper">';
            for (let rom in model.rooms) {
                if (model.bookings[booking].room_id == rom) {
                    imgSrc = model.rooms[rom].img_url;
                }
            }
            html += `<div class="hero"><img src='${imgSrc}'></div>`;
            html += '<div class="bookingnrContentWrapper"  >';
            for (let room in model.rooms) {
                if (room == model.bookings[booking].room_id) {
                    html += `<h2>${model.rooms[room].room_type}</h2>`;
                    html += `<p>${model.rooms[room].room_prices}</p>`;
                }
            }
            html += `<p>Bookingnr: ${model.bookings[booking].booking_number}</p>`;
            html += `<p>Romnr: ${model.bookings[booking].room_id}</p>`;
            html += `<p>Antall personer: ${model.bookings[booking].num_of_pers}</p>`;
            html += '<p>Reserverte datoer: ';
            if (model.bookings[booking].dates) {
                for (let date of model.bookings[booking].dates) {
                    //date= new Date(date)
                    html += date + ' -> ';
                }
            }

            html += '</p>';
            html += '<button onclick="deleteBooking()" class="deleteButton"><i class="fas fa-trash-alt"></i> Slett reservasjon</button>';
            html += '<button  onclick="setshowEditBooking()" class="alterButton"><i class="fas fa-redo"></i> Endre reservasjon</button>';
            html += '</div>';
        }
    }

    html += ` </div>`;
    app.innerHTML = html;
}

function updateAdminSearchOnDate() {
    let html = ``;
    html += viewHeader();
    html += `<div><label for="search">Søk:</label><input name="search" onchange="model.input.adminSearchBookingNr = this.value" placeholder="Søk på bookingnr"><button class="btn small" onclick="setAdminSearchOnBookingNr()">Søk</button> <label for="date">Dato:</label><input onchange="model.input.adminSeachDate = this.value" type="date" name="date"><button class="btn small" onclick="setAdminSearchOnDate()">Søk</button> </div>`;
    html += `<div id="bookingOverview">`
    //sort in loop smallest date first. create view with first date first. and show for a week. 
    html += `<table style = "width:100%">
          <tr>
            <th>romnr</th>
            `;
    let datesArray = [];
    //dates = sort_by_key(model.bookings, 'date');

    let firstTime = true;
    Date.prototype.addDays = function (days) { //funker som fjell 
        var date = new Date(this.valueOf());
        date.setDate(date.getDate() + days);
        return date;
    }
    Date.prototype.correctMonth = function () {
        var date = new Date(this.valueOf());
        date.setMonth(date.getMonth + 1)
        return date
    }

    let week = [];
    let rooms = [];

    let row1 = "";
    let row2 = "";

    dateString = new Date(model.input.adminSeachDate);
    if (firstTime) {
        firstTime = false;

        week.push(new Date(dateString));

        week.push(new Date(dateString.addDays(1)));
        week.push(new Date(dateString.addDays(2)));
        week.push(new Date(dateString.addDays(3)));
        week.push(new Date(dateString.addDays(4))); /* Legger til en dato for hele uken */
        week.push(new Date(dateString.addDays(5)));
        week.push(new Date(dateString.addDays(6)));
        week.push(new Date(dateString.addDays(7)));
        for (let weekday of week) {
            weekday.correctMonth();
            console.log(weekday);
            html += '<th>' + weekday.getDate() + '.' + weekday.getMonth() + '.' + weekday.getFullYear() + '</th>';
        }
    }
    //om rooms er tom - print ut ei rad med romNr osv

    let hasRun = false;
    //loop gjennom datoene fra model.bookings, og sjekk om dem er like
    //for hver booking skal det lages en td som markerer bookingen. For alle romnr som er booket skal det lages en tr. 
    for (let room in model.rooms) {
        html += `</tr><tr id="a${room.room_id}">`;
        html += '<td>' + room + '</td>';
        for (let weekday of week) {
            hasRun = false;
            if (model.rooms[room].booked_dates) {
                for (let booking of model.rooms[room].booked_dates) {
                    booking = new Date(booking);
                    if (weekday.getTime() == booking.getTime()) {
                        html += `<td class="booked">${weekday.getDate() + '.' + (weekday.getMonth() + 1) + '.' + weekday.getFullYear()}</td>`;
                        hasRun = true;
                    }
                }
            }

            if (!hasRun) {
                html += `<td>${weekday.getDate() + '.' + (weekday.getMonth() + 1) + '.' + weekday.getFullYear()}</td>`;

            }


        }
    }

    html += '</tr>'




    html += ` 
        </table >`;

    html += ` </div>`;
    app.innerHTML = html;
}

function updateAdminView() {
    let html = ``;
    html += viewHeader();
    html += `<div><label for="search">Søk:</label><input name="search" onchange="model.input.adminSearchBookingNr = this.value" placeholder="Søk på bookingnr"><button class="btn small" onclick="setAdminSearchOnBookingNr()"><i class="fas fa-search"></i> Søk</button> <label for="date">Dato:</label><input onchange="model.input.adminSeachDate = this.value" type="date" name="date"><button class="btn small" onclick="setAdminSearchOnDate()"><i class="fas fa-search"></i> Søk</button> </div>`;
    html += `<div id="bookingOverview">`
    //sort in loop smallest date first. create view with first date first. and show for a week. 
    html += `<table style = "width:100%">
          <tr>
            <th>romnr</th>
            `;
    let datesArray = [];
    //dates = sort_by_key(model.bookings, 'dates');


    let firstTime = true;
    Date.prototype.addDays = function (days) { //funker som fjell 
        var date = new Date(this.valueOf());
        date.setDate(date.getDate() + days);
        return date;
    }

    let week = [];
    let rooms = [];

    let row1 = "";
    let row2 = "";

    dateString = new Date();
    week.push(dateString);
    week.push(new Date(dateString.addDays(1)));
    week.push(new Date(dateString.addDays(2)));
    week.push(new Date(dateString.addDays(3)));
    week.push(new Date(dateString.addDays(4))); /* Legger til en dato for hele uken */
    week.push(new Date(dateString.addDays(5)));
    week.push(new Date(dateString.addDays(6)));
    week.push(new Date(dateString.addDays(7)));
    for (let weekday of week) {
        html += '<th>' + weekday.getDate() + '.' + (weekday.getMonth() + 1) + '.' + weekday.getFullYear() + '</th>';
    }
    let hasRun = false;
    //loop gjennom datoene fra model.bookings, og sjekk om dem er like
    //for hver booking skal det lages en td som markerer bookingen. For alle romnr som er booket skal det lages en tr. 
    for (let room in model.rooms) {
        html += `</tr><tr id="a${room}">`;
       
        html += '<td>' + room + '</td>';
        for (let weekday of week) {
            hasRun = false;
            if (model.rooms[room].booked_dates != undefined) {
                for (let booking of model.rooms[room].booked_dates) {
                    booking = new Date(booking);
                    if (weekday.getDate().toString() == booking.getDate().toString()) {
                       
                        bookingNr = getBookId(room, booking);
                          
                        
                        html += `<td class="booked" onclick="model.input.selectedBookingNr = '${bookingNr}'; setShowBookingView();">${weekday.getDate() + '.' + (weekday.getMonth() + 1) + '.' + weekday.getFullYear()}</td>`;
                        hasRun = true;
                    }
                }
            }

            if (!hasRun) {
                html += `<td class="notBooked">${weekday.getDate() + '.' + (weekday.getMonth() + 1) + '.' + weekday.getFullYear()}</td>`;

            }

        }
    }

    html += '</tr>'




    html += ` 
        </table >`;

    html += ` </div>`;
    app.innerHTML = html;
}

function updateNewUserView() {
    let page = model.page;
    let html = '';
    html += viewHeader();
    html += searchBannerView();
    html += `
        
        <div>
        <h2>Velkommen ny bruker </h2>
            <div id="usersPannel">
            <p>Fyll ut alle feltene nedenfor for å registrere en ny bruker</p>
            <p class="red">${page.error}</p>
            <br><h3>Profildata:</h3><br><label for="email">Email:</label><br>
            <input name="email"  onchange="model.input.tempEmail = this.value"><br>
            
                <label for="password">Passord:</label><br>
                <input name="password" onchange="model.input.tempPassw = this.value" ><br>
                <br><h3>Navn:</h3><br><label for="firstname">Fornavn:</label><br>
                <input name="firstName"  onchange="model.input.tempFirstName = this.value" ><br>
                <label for="lastname">Etternavn:</label><br>
                <input name="lastname"  onchange="model.input.tempLastName = this.value" ><br>
                <br><h3>Adresse:</h3> <br><label for="street">Gatenavn:</label><br>
                <input name="street"  onchange="model.input.tempStreet = this.value" ><br>
                <label for="city">By:</label><br>
                <input name="city"  onchange="model.input.tempCity = this.value" ><br>
                <label for="country">Land:</label><br>
                <input name="country"  onchange="model.input.tempCountry = this.value"><br>
                <br><h3>Kontakt:</h3><br><label for="tel">Telefon:</label><br>
                <input name="tel"  onchange="model.input.tempTel = this.value"><br>
                <button onclick="newUser()" class="btn"><i class="fas fa-save"></i> Lagre</button>
            </div>
            <div id="bookings">
            
            </div>
        </div>
        
            `;
    html += footerView();
    app.innerHTML = html;
}

function updateUserpanelView() {
    let page = model.page;
    let html = '';

    html += viewHeader();
    html += searchBannerView();
    html += `
        
        <div>
        <h2>Velkommen ${model.users[model.page.current_user].personalia.first_name}  </h2>
            <div id="usersPannel">
                <br><h3>Persondata:</h3><br><label for="email">Email:</label><br>
                <input name="email"  onchange="model.input.tempEmail = this.value" value="${model.users[model.page.current_user].personalia.email}"><br><label for="password">Passord:</label><br>
                <input name="password" onchange="model.input.tempPassw = this.value" value ="${model.users[model.page.current_user].password}"><br>
                <br><h3>Navn:</h3><br><label for="firstname">Fornavn:</label><br>
                <input name="firstName"  onchange="model.input.tempFirstName = this.value" value="${model.users[model.page.current_user].personalia.first_name}"><br>
                <label for="lastname">Etternavn:</label><br>
                <input name="lastname"  onchange="model.input.tempLastName = this.value" value="${model.users[model.page.current_user].personalia.last_name}"><br>
                <br><h3>Adresse:</h3><br><label for="street">gatenavn:</label><br>
                <input name="street"  onchange="model.input.tempStreet = this.value" value="${model.users[model.page.current_user].personalia.street}"><br>
                <label for="city">By:</label><br>
                <input name="city"  onchange="model.input.tempCity = this.value" value="${model.users[model.page.current_user].personalia.city}"><br>
                <label for="country">Land:</label><br>
                <input name="country"  onchange="model.input.tempCountry = this.value" value="${model.users[model.page.current_user].personalia.country}"><br>
                <br><h3>Kontaktinformasjon:</h3><br>
                <label for="tel">Telefon:</label><br>
                <input name="tel"  onchange="model.input.tempTel = this.value" value="${model.users[model.page.current_user].personalia.tel_num}"><br>
                <button style="    width: 159px;
                height: 38px; margin-top:20px;" onclick="storePersonalia()" class="btn"><i class="fas fa-save"></i> Lagre</button>
            </div>
            
                `;
    html += `<h2>${model.users[model.page.current_user].personalia.first_name}'s bookings</h2>`;
    html += `<div id="bookings">`;
    for (let booking in model.bookings) {
        if (model.bookings[booking].userId == model.page.current_user) {
            html += `<div onclick="model.input.selectedBookingNr = '${model.bookings[booking].booking_number}'; setShowBookingView(); " class="booking">`;
            html += `<br>`;
            for (let room in model.rooms) {
                if (model.rooms[room].room_id == model.bookings[booking].room_id) { // alle rom med rom nr fra booking
                    html += model.rooms[room].room_type;
                }
            }
            html += `<br>`;
            html += model.bookings[booking].dates;
            html += `</div>`;
        }
    }
    html += `
            </div>
        </div>
       
            `;
    html += footerView();
    app.innerHTML = html;
}

function updateLoginView() {
    let html = '';
    html += viewHeader();
    html += `
        <div class="Login"> 
            <p style="color:red;" class="error">${model.page.error}</p>   
            <label for="user">Brukernavn:</label><br>
            <input type="text" placeholder="Skriv inn brukernavn" onchange="model.input.tempUser = this.value" name="user"><br>
            <label for="psw">Passord:</label><br>
            <input type="password" placeholder="Skriv inn passord" onchange="model.input.tempPassw = this.value" name="psw" >
            <br>
            <button onclick="login()" class="btn"><i class="fas fa-sign-in-alt"></i> Login</button><br>
            <button onclick="setCreateNewUser()" class="blueButton"  ><i class="fas fa-user"></i> Ny bruker</button>
            
        </div>
        
       
            `;
    html += footerView();
    app.innerHTML = html;
}

function homepageview() {
    let html = '';

    html += viewHeader();
    html += searchBannerView();
    html += `
       
        <div id="map">
        <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d32685.15956757092!2d9.603076187783627!3d59.2022658295007!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x4647212b918718bb%3A0x97b76640a65e8514!2sClarion%20Collection%20Hotel%20Bryggeparken!5e0!3m2!1sno!2sno!4v1615902497588!5m2!1sno!2sno" width="600" height="450" style="border:0;" allowfullscreen="" loading="lazy"></iframe>
        </div>
        
            `;
    html += footerView();
    app.innerHTML = html;
}

function updateSearchView() {
    let html = ``;

    html += viewHeader();
    html += searchBannerView();

    if(model.page.search_results.length == 0){
        html += `
        <h1>${model.page.error}</h1>
        `

    }
    //looping through the search results
    for (var room of model.page.search_results) {
        var img_url = "";
        var room_price = 0;
        if (room.room_type == "Standart") {
            img_url =
                "https://amorgoshotel.com/wp-content/uploads/2014/12/Amorgos-Standard-Room1-e1464286427430.jpg";
            room_price = model.prices.standart;
        } else if (room.room_type == "Business") {
            img_url =
                "https://t-cf.bstatic.com/images/hotel/max1280x900/557/55724294.jpg";
            room_price = model.prices.business;
        } else if (room.room_type == "Premium") {
            img_url =
                "https://www.kidsquest.com/wp-content/uploads/2017/06/Soaring-Hotel-room.jpg";
            room_price = model.prices.premium;
        }
        html += `
        <div class="card">
            <p>${room.room_id}
            <div id="room.room_id">
            <img src='${img_url}' alt="Standard" width="350" height="200">
            <p>Room Type: ${room.room_type}</p>
            <p>Price: ${model.prices[room.room_type]}</p>
             <button onclick="put_in_cart(${room.room_id})" class="btn"><i class="fas fa-luggage-cart"></i> Legg til i handlevogn</button>
            </div>
        </div>
        
        `;
    }
    if (model.users[model.page.current_user].cart && model.users[model.page.current_user].cart.length != 0) {
        html += `
        <button onclick="setCart()"><i class="fas fa-luggage-cart"></i> Til Handlevogn</button>
        `
    }
    html += footerView();
    app.innerHTML = html;
}

function date_fixer(date) {
    var today_day
    if (date.getDate() < 10) {
        today_day = '0' + date.getDate()
    }
    else {
        today_day = date.getDate()
    }
    var today_month
    if (date.getMonth() < 9) {
        today_month = '0' + (date.getMonth() + 1)
    }
    else {
        today_month = date.getMonth() + 1
    }
    var today = date.getFullYear() + '-' + today_month + '-' + today_day
    return today
}

function searchBannerView() {
    let html = ``;
    var startdate = ''
    var enddate = ''
    if(model.input.start_date){
        startdate = model.input.start_date.getFullYear() 
        if(model.input.start_date.getMonth()+1 <10) startdate +=  '-' + '0' + (model.input.start_date.getMonth()+1) + '-'
        else startdate +=  '-' + (model.input.start_date.getMonth()+1) + '-'
        if (model.input.start_date.getDate()<10) startdate += '0'+ model.input.start_date.getDate();
        else startdate += model.input.start_date.getDate();
    }
    if(model.input.end_date){
        enddate = model.input.end_date.getFullYear() 
        if(model.input.end_date.getMonth()+1 <10) enddate +=  '-' + '0' + (model.input.end_date.getMonth()+1) + '-'
        else enddate +=  '-' + (model.input.end_date.getMonth()+1) + '-'
        if (model.input.end_date.getDate()<10) enddate += '0'+ model.input.end_date.getDate();
        else enddate += model.input.end_date.getDate();
    }
    html += `
        <div id='searchfield' class="searchField">    
            <label for="startDato">Start Dato:</label>
            <input type="date" name="startDato" onchange="input_updater(this)" min='${date_fixer(new Date())}' value="${startdate}">
            <label class="margin" for="sluttDato">Slutt Dato:</label>
            <input id="sluttDatoField" type="date" name="sluttDato" onchange="input_updater(this)" min='${date_fixer(new Date())}' value="${enddate}">
            <label class="margin" for="antallPersoner">Antall Voksene:</label>  
            <select id="personer" type="text" name="antallPersoner" onchange="input_updater(this)">`;
            for (i = 1; i<9;i++){
                if(model.input.num_of_pers == i){
                    html += `
                        <option value="${i}" selected="selected">${i}</option>
                        `;
                }
                else {
                    html += `
                    <option value="${i}">${i}</option>
                    `;
                };
            };
            html+=`
            </select>
            <label class="margin" for="antallPersoner">Antall rom:</label>  
            <select id="romvelger" type="text" name="antallrom" onchange="input_updater(this)">`
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
            html += `</select>
            <button class="btn small" onclick="setSearchView()"><i class="fas fa-search"></i>Søk</button>
            </div>`;
    return html
}

function viewHeader() {
    let html = '<div class="header_overdiv">';
    html += `<div class="headerView">
            <h1 onclick="setHomeView()"><span>Hotel</span>Stella - ${model.page.page_pos}</h1></div>`;

    if (model.users[model.page.current_user].role == 'guest') {
        html += `<div class="logout"><span onclick="setLoginView()"><i class="fas fa-sign-in-alt"></i> Login </span>
                <br>
                <span> <i class="fas fa-concierge-bell"></i> Guest </span>
                <br>
                <span onclick="setCart()"><i class="fas fa-luggage-cart"></i> Handlevogn</span></div></div>`;

    } else if (model.users[model.page.current_user].role == 'admin') {
        html += `<div class="logout"><span id="login" onclick="setUserPanel()">${model.users[model.page.current_user].personalia.first_name}</span><span onclick="setAdminPanel()"><i class="fas fa-ad"></i>admin </span><span onclick="logout()"><i class="fas fa-sign-out-alt"></i> logout</span></div></div>`;

    }
    else if (model.users[model.page.current_user].role == 'user') {
        html += `<div class="logout"><span id="login" onclick="setUserPanel()">${model.users[model.page.current_user].personalia.first_name} </span><span onclick="logout()"><i class="fas fa-sign-out-alt"></i>  logout </span> <span onclick="setCart()"><i class="fas fa-luggage-cart"></i>Handlevogn</span></div></div>`;
    }

    html += `</div>`
    return html
}

function footerView() {
    let html = ``;
    html += `<div id="footer">
        <div class="footer-content">

            <div class="footer-section about">
                <h1 class="logo-text" onclick="setHomeView()"><span>Hotel</span>Stella</h1>
              
                <p>
                   Hotel Stella ligger i Skien og er Byens vakkreste hotel
                </p>
                <br>
               <div class="contact">
                    <span><i class="fas fa-phone-square-alt"></i> &nbsp; 112 113 110 </span>
                    <span><i class="fas fa-envelope" ></i> &nbsp; Hotel@Stella.no </span>
                </div>
                <div class="sosialmedia">
                    <a herf="#"><i class="fab fa-facebook"></i></a>
                    <a herf="#"><i class="fab fa-instagram"></i></a>
                    <a herf="#"><i class="fab fa-twitter"></i></a>  
                </div>
            </div>

            <div class="footer-section links">
                <h2>Linker</h2>
                <ul>
                    <a onclick="setHomeView()"><li>Home</li></a>
                    <a onclick="setShowBookingView()"><li>Booking</li></a>
                    <a onclick="setLoginView()"><li>Login</li></a>
                    <a onclick="setAdminPanel()"><li>Admin</li></a>
                </ul>
                </div>

            <div class="footer-section contact-form></div>
                <h2>Kontakt oss</h2>
                <br>
                <from action="index.html" method="post">
                    <input type="email" name="email" class="text-input contact-input" placeholder="Din epost adresse">
                    <textarea name="message"  class="text-input contact-input" placeholder="Skriv her..."></textarea>
                    <button type="submit" class="btn btn-big"><i class="fas fa-paper-plane"></i>
                    Send
                    </button>
                </form>
        </div>

    </div>
        <div id="footer-bottom">
            &copy; Get Academy | Marten, Borgar og Christoffer
         </div>`;
    return html
}
function updatebookingview() {
    var html = ``
    html += viewHeader()
    html += `
  
   
    <div class="Login"> 
    <p style="color:red;" class="error">${model.page.error}</p>   
    <label for="user">Brukernavn:</label><br>
    <input type="text" placeholder="Skriv inn brukernavn" onchange="model.input.tempUser = this.value" name="user"><br>
    <label for="psw">Passord:</label><br>
    <input type="password" placeholder="Skriv inn passord" onchange="model.input.tempPassw = this.value" name="psw" >
    <br>
    <button onclick="login()" class="btn"><i class="fas fa-sign-in-alt"></i> login</button><br>
    <button onclick="setCreateNewUser()" class="blueButton"  ><i class="far fa-user"></i> Ny bruker</button>
    </div>
    
    
    <div id="usersPannel">
    <br><h3>Persondata:</h3><br><label for="email">Email:</label><br>
    <input name="email"  onchange="model.input.tempEmail = this.value" value="${model.users[model.page.current_user].personalia.email}"><br><label for="password">Passord:</label><br>
    <input name="password" onchange="model.input.tempPassw = this.value" value ="${model.users[model.page.current_user].password}"><br>
    <br><h3>Navn:</h3><br><label for="firstname">Fornavn:</label><br>
    <input name="firstName"  onchange="model.input.tempFirstName = this.value" value="${model.users[model.page.current_user].personalia.first_name}"><br>
    <label for="lastname">Etternavn:</label><br>
    <input name="lastname"  onchange="model.input.tempLastName = this.value" value="${model.users[model.page.current_user].personalia.last_name}"><br>
    <br><h3>Adresse:</h3><br><label for="street">gatenavn:</label><br>
    <input name="street"  onchange="model.input.tempStreet = this.value" value="${model.users[model.page.current_user].personalia.street}"><br>
    <label for="city">By:</label><br>
    <input name="city"  onchange="model.input.tempCity = this.value" value="${model.users[model.page.current_user].personalia.city}"><br>
    <label for="country">Land:</label><br>
    <input name="country"  onchange="model.input.tempCountry = this.value" value="${model.users[model.page.current_user].personalia.country}"><br>
    <br><h3>Kontaktinformasjon:</h3><br>
    <label for="tel">Telefon:</label><br>
    <input name="tel"  onchange="model.input.tempTel = this.value" value="${model.users[model.page.current_user].personalia.tel_num}"><br>
    <button style="    width: 159px;
    height: 38px; margin-top:20px;" onclick="storePersonalia()" class="btn"><i class="fas fa-save"></i> Lagre</button>   
    </div> 
    `


    /*
    <div class="card">
    <p>${room.room_id}
    <div id="room.room_id">
    <img src=${img_url} alt="Standard" width="350" height="200">
    <p>Room Type: ${room.room_type}</p>
    <p>Price: ${room_price}</p>
    <button onclick="book(${room.room_id})" class="btn">Velg</button>
        </div>
       
    */
    // Confirm

    html += `<button id="confirmOrder" onclick="Confirm()"><i class="far fa-calendar-check"></i>Confirm</button></div>`;
    html += footerView()

    app.innerHTML = html;

}

function bookingdetailView() {
    var html = ``
    html += viewHeader()
    html += `
    <div class="Searchbardetail">
    <input type="text" placeholder="Search.." name="search">
    </div> 
   
    `
    html += `<div id="bookings">`;
    for (let booking in model.bookings) {
        if (model.bookings[booking].userId == model.page.current_user) {
            html += '<div class="booking">';
            html += `<br>`;
            for (let room in model.rooms) {
                if (room == model.bookings[booking].room_id) { // alle rom med rom nr fra booking
                    html += model.rooms[room].room_type;
                }
            }
            html += `<br>`;
            html += model.bookings[booking].date;
            html += `</div>`;
        }
    }

    html += `<button id="searchOrder" onclick="search()"><i class="fas fa-search"></i> Søk </button></div>`;
    html += `<button id="SaveDetails" onclick="save()"><i class="fas fa-save"></i> Lagre</button></div>`;
    html += `<button id="deleteDetails" onclick="delete()"> <i class="fas fa-trash-alt"></i> Slett</button></div>`;

    html += footerView()

    app.innerHTML = html;
}