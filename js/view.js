let app = document.getElementById("app");

async function start() {
    // Getting Data once from Database at the beginning
    var databaseUpdate = new Promise (function(resolve,reject){
        database.ref().once('value', (snap) => {
            resolve(snap.val())
          })
    })
    var data = await databaseUpdate
    model.rooms = data.rooms
    model.users = data.users
    for (i=0; i< data.rooms.length; i++){
        model.rooms[i].booked_dates = []
        if (data.rooms[i].booked_dates != undefined){            
            for (a  =  0; a  <  data.rooms[i].booked_dates.length;  a++) {
                    model.rooms[i].booked_dates[a] = new Date(data.rooms[i].booked_dates[a])
                }
        }
    }
    model.bookings= []
    for (a in data.bookings){
        model.bookings.push(data.bookings[a])
    }

    //booking-numbers keeping them updated
    if (data.booking_number) {
        model.booking_numbers = data.booking_number;
    
        database.ref('booking_numbers').on('value', (snap) => {
            model.booking_numbers = snap.val();
        })
    }
    //UserID_counter
    model.userId_counter = data.userId_counter

    updateView()
}
start()
function updateView() {
    
    if (model.page.page_pos == 'home') {
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

function updateShowBookingView() {
    let html;
    html += viewHeader();

    for (let booking of model.bookings) {
        if (booking.booking_number == model.input.selectedBookingNr) {
            html += '<div class="bookingnrWrapper">';
            for (let rom of model.rooms) {
                if (booking.room_id == rom.room_id) {
                    imgSrc = rom.img_url;
                }
            }
            html += `<div class="hero"><img src='${imgSrc}'></div>`;
            html += '<div class="bookingnrContentWrapper"  >';
            for (let room of model.rooms) {
                if (room.room_id == booking.room_id) {
                    html += `<h2>${room.room_type}</h2>`;
                    html += `<p>${room.room_prices}</p>`;
                }
            }
            html += `<p>Bookingnr: ${booking.booking_number}</p>`;
            html += `<p>Romnr: ${booking.room_id}</p>`;
            html += `<p>Antall personer: ${booking.num_pers}</p>`;
            html += '<p>Reserverte datoer: ';
            for (let date of booking.dates) {
                date = new Date(date);
                html += date.getDate() + '.' + date.getMonth() + '.' + date.getFullYear() + ' -> ';
            }
            html += '</p>';
            html += '<button onclick="deleteBooking()" class="deleteButton">Slett reservasjon</button>';
            html += '<button class="alterButton">Endre reservasjon</button>';
            html += '</div></div>';
        }
    }
    html += footerView(); 
    app.innerHTML = html;
}
function updateCartView(){
    var html = ''
    var chosen_room
    html += viewHeader();
    if(model.users[model.page.current_user].cart && model.users[model.page.current_user].cart != []){
        for (booking of model.users[model.page.current_user].cart){
            for (room of model.rooms){
                if (room.room_id == booking.room_id){
                    chosen_room = room;
                    html +=`
                        <div class="card">
                        <p>${room.room_id}
                        <div id="booking.room_id">
                        <img src='${room.img_url}' alt="Standard" width="350" height="200">
                        <p>Room Type: ${room.room_type}</p>
                        <p>Price: ${model.prices[room.room_type]}</p>
                        <p>Startdato: ${new Date(booking.dates[0])}</p>
                        <p>Sluttdato: ${new Date(booking.dates[booking.dates.length-1])}</p>
                        <button onclick="delete_from_cart('${booking.booking_number}')" class="btn">Fjern fra Handlevogn</button>
                        </div>
                        </div>
                        `
                } 
                }
            
                 
        }
    }
    else {
        html +=`<h1>Your shopping Cart is empty</h1>`
    }
    
    html += `<button onclick="book()" class="btn">Kjøpe</button>`

    html += footerView();
    app.innerHTML = html
}

function updateAdminSearchOnBookingNr() {
    let html = ``;
    let imgSrc =``;
    html += viewHeader();
    html += `<div><label for="search">Søk:</label><input name="search" onchange="model.input.adminSearchBookingNr = this.value" placeholder="Søk på bookingnr"><button class="btn small" onclick="setAdminSearchOnBookingNr()">Søk</button> <label for="date">Dato:</label><input onchange="model.input.adminSeachDate = this.value" type="date" name="date"><button class="btn small" onclick="setAdminSearchOnDate()">Søk</button> </div>`;
    html += `<div id="bookingNrSearch">`
    //sort in loop smallest date first. create view with first date first. and show for a week. 
    
    for(let booking of model.bookings){
        if(booking.booking_number == model.input.adminSearchBookingNr){
            html += '<div class="bookingnrWrapper">';
            for(let rom of model.rooms){
                if(booking.room_id == rom.room_id){
                    imgSrc = rom.img_url;
                }
            }
            html += `<div class="hero"><img src='${imgSrc}'></div>`;
            html += '<div class="bookingnrContentWrapper"  >';
            for(let room of model.rooms){
                if(room.room_id == booking.room_id){
                    html += `<h2>${room.room_type}</h2>`;
                    html += `<p>${room.room_prices}</p>`;   
                }
            }
            html += `<p>Bookingnr: ${booking.booking_number}</p>`;
            html += `<p>Romnr: ${booking.room_id}</p>`;
            html += `<p>Antall personer: ${booking.num_pers}</p>`;
            html += '<p>Reserverte datoer: ';
            for(let date of booking.dates){
                html += date.getDate() + '.' + date.getMonth() + '.' + date.getFullYear() + ' -> ';
            }
            html += '</p>';
            html += '<button class="deleteButton">Slett reservasjon</button>';
            html += '<button class="alterButton">Endre reservasjon</button>';
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
    dates = sort_by_key(model.bookings, 'date');

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
    for (let date of dates) {// alle datoene i modelen sortert i stigene rekkefølge
        //aBookedDate.setDate(date.date.getDate());
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
                html += '<th>' + weekday.getDate() + '.'+ weekday.getMonth() +'.'+ weekday.getFullYear() + '</th>';
            }
        }
        //om rooms er tom - print ut ei rad med romNr osv
    }
    let hasRun = false;
    //loop gjennom datoene fra model.bookings, og sjekk om dem er like
    //for hver booking skal det lages en td som markerer bookingen. For alle romnr som er booket skal det lages en tr. 
    for (let room of model.rooms) {
        html += `</tr><tr id="a${room.room_id}">`;
        html += '<td>' + room.room_id + '</td>';
        for (let weekday of week) {
            hasRun = false;
            for (let booking of room.booked_dates) {
                booking = new Date(booking);
                if (weekday.toString() == booking.toString()) {
                    html += `<td class="booked">${weekday.getDate() + '.' + weekday.getMonth() + '.' + weekday.getFullYear()}</td>`;
                    hasRun = true;
                }
            }
            if (!hasRun) {
                html += `<td>${weekday.getDate() + '.' + weekday.getMonth() + '.' + weekday.getFullYear()}</td>`;

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
    html += `<div><label for="search">Søk:</label><input name="search" onchange="model.input.adminSearchBookingNr = this.value" placeholder="Søk på bookingnr"><button class="btn small" onclick="setAdminSearchOnBookingNr()">Søk</button> <label for="date">Dato:</label><input onchange="model.input.adminSeachDate = this.value" type="date" name="date"><button class="btn small" onclick="setAdminSearchOnDate()">Søk</button> </div>`;
    html += `<div id="bookingOverview">`
    //sort in loop smallest date first. create view with first date first. and show for a week. 
    html += `<table style = "width:100%">
          <tr>
            <th>romnr</th>
            `;
    let datesArray = [];
    dates = sort_by_key(model.bookings, 'dates');


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
    for (let room of model.rooms) {
        html += `</tr><tr id="a${room.room_id}">`;
        html += '<td>' + room.room_id + '</td>';
        for (let weekday of week) {
            hasRun = false;
            if (room.booked_dates != undefined) {
                for (let booking of room.booked_dates) {
                    booking = new Date(booking);
                    if (weekday.getDate().toString() == booking.getDate().toString()) {
                        html += `<td class="booked">${weekday.getDate() + '.' + (weekday.getMonth() + 1) + '.' + weekday.getFullYear()}</td>`;
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

function updateNewUserView(){
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
                <button onclick="newUser()" class="btn">Lagre</button>
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
                height: 38px; margin-top:20px;" onclick="storePersonalia()" class="btn">Lagre</button>
            </div>
            
                `;
            html += `<h2>${model.users[model.page.current_user].personalia.first_name}'s bookings</h2>`; 
            html += `<div id="bookings">`;
                    for(let booking of model.bookings){
                        if(booking.userId == model.page.current_user){
                            html += `<div onclick="model.input.selectedBookingNr = '${booking.booking_number}'; setShowBookingView(); " class="booking">`;
                            html += `<br>`;
                            for (let room of model.rooms){
                                if (room.room_id == booking.room_id){ // alle rom med rom nr fra booking
                                    html += room.room_type;
                                }
                            }
                            html += `<br>`;
                            html += booking.date;
                            html += `</div>`;
                        }
                    }
                html +=`
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
            <button onclick="login()" class="btn">login</button><br>
            <button onclick="setCreateNewUser()" class="blueButton"  >Ny bruker</button>
            
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
            <button onclick="put_in_cart(${room.room_id})" class="btn">Satt i handlevogn</button>
            </div>
        </div>
        
        `;
   }
   if(model.users[model.page.current_user].cart && model.users[model.page.current_user].cart.length != 0){
        html +=`
        <button onclick="setCart()">Til Handlevogn</button>
        `
   }
   html += footerView();
   app.innerHTML = html;
}

function date_fixer(date){
    var today_day
    if(date.getDate() < 10) {
        today_day = '0'+ date.getDate()
    }
    else {
        today_day = date.getDate()
    }
    var today_month
    if(date.getMonth() < 9){
        today_month = '0' + (date.getMonth() + 1) 
    }
    else {
        today_month = date.getMonth() + 1
    }
    var today = date.getFullYear()+'-'+today_month+'-'+today_day
    return today
}

function searchBannerView(){
    let html =``;
    html += `
        <div class="searchField">    
            <label for="startDato">Start Dato:</label>
            <input type="date" name="startDato" onchange="input_updater(this)" min='${date_fixer(new Date())}'>
            <label class="margin" for="sluttDato">Slutt Dato:</label>
            <input id="sluttDatoField" type="date" name="sluttDato" onchange="input_updater(this)" min='${date_fixer(new Date())}'>
            <label class="margin" for="antallPersoner">Antall Voksene:</label>  
            <select id="personer" type="text" name="antallPersoner" onchange="input_updater(this)">
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
            <option value="5">5</option>
            <option value="6">6</option>
            <option value="7">7</option>
            <option value="8">8</option>
          </select>
          <label class="margin" for="antallPersoner">Antall Barn:</label>  
            <select id="personer" type="text" name="antallPersoner" onchange="input_updater(this)">
            <option value="0">0</option>
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
            <option value="5">5</option>
            <option value="6">6</option>
            <option value="7">7</option>
            <option value="8">8</option>
          </select>
            <button class="btn small" onclick="setSearchView()">Søk</button>
        </div>`;
        return html
}

function viewHeader(){
    let html = '<div id="header_overdiv">';
    html += `<div id="header"><h1 onclick="setHomeView()">Hotell Stella - ${model.page.page_pos}</h1>`;
    if(model.users[model.page.current_user].role == 'guest'){
        html += `<div class="logout"><span onclick="setLoginView()">Login </span><span> Guest </span><span onclick="setCart()"> Handlevogn</span></div></div>`;

    }else if(model.users[model.page.current_user].role == 'admin'){
        html += `<div class="logout"><span id="login" onclick="setUserPanel()">${model.users[model.page.current_user].personalia.first_name}</span><span onclick="setAdminPanel()">admin </span><span onclick="logout()"> logout</span></div></div>`;
  
    }
    else if(model.users[model.page.current_user].role == 'user'){
        html += `<div class="logout"><span id="login" onclick="setUserPanel()">${model.users[model.page.current_user].personalia.first_name} </span><span onclick="logout()"> logout </span> <span onclick="setCart()"> Handlevogn</span></div></div>`;
    }

    html +=`</div>`
    return html
}

function footerView(){
    let html = ``;
    html += `<div id="footer">
        <div class="footer-content">

            <div class="footer-section about">
                <h1 class="logo-text"><span>Hotel</span>Stella</h1>
                <p>
                   Hotel Stella ligger i Skien og er Byens vakkreste hotel
                </p>
               <div class="contact">
                    <span><i class="fas fa-phone"></i> &nbsp; 112 113 110 </span>
                    <span><i class="fas fa-envelope"></i> &nbsp; Hotel@Stella.no </span>
                </div>
                <div class="sosialmedia">
                    <a herf="#"><i class="fab fa-facebook"></i></a>
                    <a herf="#"><i class="fab fa-instagram"></i></a>
                    <a herf="#"><i class="fab fa-twitter"></i></a>  
                </div>
            </div>

            <div class="footer-section links">
                <h2>Linker</h2>
                <br>
                <ul>
                    <a herf="#"><li>Home</li></a>
                    <a herf="#"><li>Booking</li></a>
                    <a herf="#"><li>Login</li></a>
                </ul>
                </div>

            <div class="footer-section contact-form></div>
                <h2>Kontakt oss</h2>
                <br>
                <from action="index.html" method="post">
                    <input type="email" name="email" class="text-input contact-input" placeholder="Din epost adresse">
                    <textarea name="message"  class="text-input contact-input" placeholder="Skriv her..."></textarea>
                    <button type="submit" class="btn btn-big">
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

function updatebookingview(){
    var html =``
    html += viewHeader()
    html += `
  
   
    <div class="Login"> 
    <p style="color:red;" class="error">${model.page.error}</p>   
    <label for="user">Brukernavn:</label><br>
    <input type="text" placeholder="Skriv inn brukernavn" onchange="model.input.tempUser = this.value" name="user"><br>
    <label for="psw">Passord:</label><br>
    <input type="password" placeholder="Skriv inn passord" onchange="model.input.tempPassw = this.value" name="psw" >
    <br>
    <button onclick="login()" class="btn">login</button><br>
    <button onclick="setCreateNewUser()" class="blueButton"  >Ny bruker</button>
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
    height: 38px; margin-top:20px;" onclick="storePersonalia()" class="btn">Lagre</button>
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
    
    html += `<button id="confirmOrder" onclick="Confirm()">Confirm</button></div>`;
    html += footerView()
    
    app.innerHTML = html;

}

function bookingdetailView () {
    var html =``
    html += viewHeader()
    html += `
    <div class="Searchbardetail">
    <input type="text" placeholder="Search.." name="search">
    </div> 
   
    ` 
    html += `<div id="bookings">`;
                    for(let booking of model.bookings){
                        if(booking.userId == model.page.current_user){
                            html+= '<div class="booking">';
                            html += `<br>`;
                            for (let room of model.rooms){
                                if (room.room_id == booking.room_id){ // alle rom med rom nr fra booking
                                    html += room.room_type;
                                }
                            }
                            html += `<br>`;
                            html += booking.date;
                            html += `</div>`;
                        }
                    }   

    html += `<button id="searchOrder" onclick="search()">Søk</button></div>`;
    html += `<button id="SaveDetails" onclick="save()">Lagre</button></div>`;
    html += `<button id="deleteDetails" onclick="delete()">Slett</button></div>`;

    html += footerView()

    app.innerHTML = html; 
}
