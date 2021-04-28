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
        if(!data.bookings) model.bookings = {};
        model.booking_numbers = snap.val();
    })
    
    //UserID_counter
    model.userId_counter = data.userId_counter
    
    //Cookie Creation
    
    var cookie = document.cookie
    if(cookie != ""){
        var start = cookie.indexOf("user_id")
        var u_id = cookie.substring(start+8)
        model.page.current_user = parseInt(u_id) 
    }
    else{
        model.userId_counter ++
        model.users[model.userId_counter] = {
            password: "",
            role: 'guest',
            userId: model.userId_counter,
            personalia: {
                first_name: '',
                last_name: '',
                street: "",
                city: "",
                country: "",
                email: "",
                tel_num: "",
            },
            list_of_bookings: []
        };
        model.page.current_user=model.userId_counter
        database.ref('users/' + model.page.current_user).set(model.users[model.page.current_user]);
        database.ref('userId_counter').set(model.userId_counter);
        var ex_date = new Date()
            ex_date.setTime(ex_date.getTime()+(30*24*60*60*1000))
            var newcookie ="user_id="+model.page.current_user+ ";expires="+ex_date + ";path=/";
            document.cookie = newcookie
        
    }
    
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
    } else if (model.page.page_pos == 'User panel' && model.users[model.page.current_user].role != "guest") {
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
    }else if(model.page.page_pos == 'room week'){
        showRoomWeekview()
    } else if (model.page.page_pos == 'Rediger rom') {
        showEditRoom();
    } else if (model.page.page_pos == 'Legg til rom') {
        AddNewRoomView();
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
function setRoomWeekView(){
    model.page.page_pos = 'room week'
    updateView();
}
function setShowEditRoom() {
    model.page.page_pos = 'Rediger rom';
    updateView();
}
function setAddNewRoomView() {
    model.page.page_pos = 'Legg til rom';
    updateView();
}
function AddNewRoomView() {
    html = ''
    html += viewHeader();
    html += `<div id="editBookingcss">
        <br><label for="roomnr">Romnr:</label><input type="text" name="roomnr" onchange="model.input.roomnr = this.value" value="" /> 
        <br><label for="roomType">Romtype:</label><input type="text" name="roomType" onchange="model.input.roomtype = this.value" value="" /> 
        <br><label for="price">Pris:</label><input type="text" name="price" onchange="model.input.roomprice = this.value" value="" />    
        <br><label for="antallPersoner">Sengeplasser:</label><select id="personer" type="text" name="antallPersoner" value="0" onchange="model.input.beds = this.value">`;

    for (i = 0; i < 9; i++) {
        if (0 == i) {
            html += `
                        <option value="" selected="selected"></option>
                        `;
        }
        else {
            html += `
                    <option value="${i}">${i}</option>
                    `;
        };
    };
    html += '</select>'
    html += `
            <br><label for="antallbarn">Barneplasser:</label><select id="personer" type="text" name="antallbarn" value="0" onchange="model.input.kids = this.value">`;

    for (i = 0; i < 9; i++) {
        if (0 == i) {
            html += `
                        <option value="" selected="selected"></option>
                        `;
        }
        else {
            html += `
                    <option value="${i}">${i}</option>
                    `;
        };
    };
    html += '</select>'
    html += `<br><label for="imgurl">Bilde:</label><input type="text" name="imgurl" onchange="model.input.imgurl = this.value" 
            value="" /></div> `;
    html += `<button onclick="newRoom()" class="btn"><i class="fas fa-save"></i> Lagre</button>`;

    html += footerView()
    app.innerHTML = html;
}
function showEditRoom() {
    html = '';
    /**room_id:101,
            room_type: "Standart", //or business, premium
            room_prices: "1000kr",
            beds : 2,
            kids : 1,
            booked_dates: [],
            img_url: */
    html += viewHeader();
    html += `<div id="editBookingcss">
        <br><label for="roomType">Romtype:</label><input type="text" name="roomType" onchange="model.input.roomtype = this.value" value="${model.rooms[model.input.selectedRoom].room_type}" /> 
        <br><label for="price">Pris:</label><input type="text" name="price" onchange="model.input.roomprice = this.value" value="${model.rooms[model.input.selectedRoom].room_prices}" />    
        <br><label for="antallPersoner">Sengeplasser:</label><select id="personer" type="text" name="antallPersoner" value="${model.rooms[model.input.selectedRoom].beds}" onchange="model.input.beds = this.value">`;

    for (i = 1; i < 9; i++) {
        if (model.rooms[model.input.selectedRoom].beds == i) {
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
    html += '</select>'
    html += `
            <br><label for="antallbarn">Barneplasser:</label><select id="personer" type="text" name="antallbarn" value="${model.rooms[model.input.selectedRoom].kids}" onchange="model.input.kids = this.value">`;

    for (i = 1; i < 9; i++) {
        if (model.rooms[model.input.selectedRoom].kids == i) {
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
    html += '</select>'
    html += `<br><label for="imgurl">Bilde:</label><input type="text" name="imgurl" onchange="model.input.imgurl = this.value" value="${model.rooms[model.input.selectedRoom].img_url}" /></div> `;
    html += '<button onclick="editRoom()" class="alterButton"><i class="fas fa-redo"></i>Endre rom</button>';
    html += footerView()
       app.innerHTML = html;
}
function showRoomWeekview() {
    let html = '';
    html += viewHeader();
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

    dateString = new Date();
    dateString.setHours(02, 0, 0, 0)
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
            weekday = date_fixer(weekday);
            html += '<th>' + weekday + '</th>';
        }
    }
    //om rooms er tom - print ut ei rad med romNr osv

    let hasRun = false;
    //loop gjennom datoene fra model.bookings, og sjekk om dem er like
    //for hver booking skal det lages en td som markerer bookingen. For alle romnr som er booket skal det lages en tr. 

    /*room_id:101,
    room_type: "Standart", //or business, premium
    room_prices: "1000kr",
    beds : 2,
    kids : 1,
    booked_dates: [],
    img_url:*/

    for (let room in model.rooms) {
        if (room == model.input.selectedRoom) {
            html += `<img src="${model.rooms[room].img_url}" width="400px"> `
            html += '<br><p>Romtype:' + model.rooms[room].room_type; + '</p>'
            html += '<br><p>Rompris:' + model.rooms[room].room_prices + '</p>';
            html += '<br><p>Sengeplasser:' + model.rooms[room].beds + '</p>';
            html += '<br><p>Sengeplasser til barn:' + model.rooms[room].kids + '</p><br>';
        }
    }
    for (let room in model.rooms) {
        if (room == model.input.selectedRoom) {

            html += `</tr><tr id="a${room.room_id}">`;
            html += '<td>' + room + '</td>';
            for (let weekday of week) {
                hasRun = false;
                if (model.rooms[room].booked_dates) {
                    for (let booking of model.rooms[room].booked_dates) {
                        booking = new Date(booking);
                        abooking = date_fixer(booking);
                        aweekday = date_fixer(weekday);
                        if (aweekday == abooking) {

                            bookingNr = getBookId(room, booking);
                            date = date_fixer(weekday);
                            html += `<td class="booked" onclick="model.input.selectedBookingNr = '${bookingNr}'; setShowBookingView();">${date}</td>`;
                            hasRun = true;
                        }
                    }
                }

                if (!hasRun) {
                    date = date_fixer(weekday);
                    html += `<td class="notBooked">${date}</td>`;
                }


            }
        }
    }

    html += '</tr>'




    html += ` 
        </table >`;
    html += '<button onclick="setShowEditRoom()" class="alterButton"><i class="fas fa-redo"></i>Endre rom</button>';
    html += `<button onclick="deleteRoom('${model.input.selectedRoom}')" class="btn deletebtn"><i class="fas fa-redo"></i>Delete</button>`;
    html += footerView()
    app.innerHTML = html;
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

           
           html+= `<div id="editBookingcss>"
            <div class="flexbox1"><label for="startDato">Start Dato:</label>
            <input type="date" name="startDato" onchange="input_updater(this)" min='${date_fixer(new Date())}' value="${startdate}"></div>
            <br>
            <div class="flexbox2"> <label class="margin" for="sluttDato">Slutt Dato:</label>
            <input id="sluttDatoField" type="date" name="sluttDato" onchange="input_updater(this)" min='${date_fixer(new Date())}' value="${enddate}"></div>
            <br>
            <label class="margin" for="antallPersoner">Antall Voksene:</label>  
            <select id="personer" type="text" name="antallPersoner" value="${model.bookings[booking].num_of_pers}" onchange="model.input.num_of_pers = this.value">
            </div>`;
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
            <select id="rom" type="text" name="romNr" value="${model.bookings[booking].room_id}" onchange="model.input.romnr = this.value">


            
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
    html += footerView()
    app.innerHTML = html;
}
function showSetUserOrPersonalia(){
    let html=``;
    html += viewHeader();
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
        <button onclick="login(); book(); updateconfirmationview()" class="btn"><i class="fas fa-sign-in-alt"></i>login</button><br>
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
    html += footerView()
    app.innerHTML = html;
}
function updateShowBookingView() {
    let html = '';
    html += viewHeader();

   

    bookingNr=model.input.selectedBookingNr

    html += '<div class="bookingnrWrapper">';
    html += `<div class="hero"><img src='${model.rooms[model.bookings[bookingNr].room_id].img_url}'></div>`;
    html += '<div class="bookingnrContentWrapper"  >';
    html += `<h2>${model.rooms[model.bookings[bookingNr].room_id].room_type}</h2>`;
    html += `<p>${model.rooms[model.bookings[bookingNr].room_id].room_prices}</p>`;
    html += `<p>Bookingnr: ${bookingNr}</p>`;
    html += `<p>Romnr: ${model.bookings[bookingNr].room_id}</p>`;
    html += `<p>Antall personer: ${model.bookings[bookingNr].num_of_pers}</p>`;
    html += '<p>Reserverte datoer: ';
    startdate = date_fixer(new Date(model.bookings[bookingNr].dates[0]));
    enddate = date_fixer(new Date(model.bookings[bookingNr].dates[model.bookings[bookingNr].dates.length-1]));
    html += startdate + ' -> ' + enddate;
    html += '</p>';
    html += `<button onclick="deleteBooking('${bookingNr}')" class="deleteButton"><i class="fas fa-trash-alt"></i>Slett reservasjon</button>`;
    html += '<button onclick="setshowEditBooking()" class="alterButton"><i class="fas fa-redo"></i>Endre reservasjon</button>';
    html += '</div></div>';
            
    html += footerView(); 
    app.innerHTML = html;
}
function updateCartView() {
    var html = ''
    html += viewHeader();
    if (model.users[model.page.current_user].cart && model.users[model.page.current_user].cart.length != 0) {
        for (booking of model.users[model.page.current_user].cart) {
            html += `
                <div class="card">
                <p>${booking.room_id}
                <div id="${booking.room_id}">
                <img src='${model.rooms[booking.room_id].img_url}' alt="Standard" width="350" height="200">
                <p>Room Type: ${model.rooms[booking.room_id].room_type}</p>
                <p>Price: ${model.rooms[booking.room_id].room_prices}</p>
                <p>Startdato: ${date_fixer(new Date(booking.dates[0]))}</p>
                <p>Sluttdato: ${date_fixer(new Date(booking.dates[booking.dates.length - 1]))}</p>
                <button onclick="delete_from_cart('${booking.booking_number}')" class="btn deletebtn"><i class="fas fa-trash-alt"></i>Fjern fra Handlevogn</button>
                </div>
                </div>
                `

        }
        html += `<button onclick="model.page.buying = true;isloggedintest() " class="btn"><i class="fas fa-shopping-cart"></i> Kjøpe</button>`
    }
    else {
        html += `<h1>Din handlevogn er tom.</h1>`
    }

    html += footerView();
    app.innerHTML = html
}

function updateAdminSearchOnBookingNr() {
    let html = ``;
    let imgSrc = ``;
    html += viewHeader();
    html += `<div><label for="search">Søk:</label><input name="search" onchange="model.input.adminSearchBookingNr = this.value" placeholder="Søk på bookingnr"><button class="btn small" onclick="
    if(model.input.adminSearchBookingNr!= ''){
        setAdminSearchOnBookingNr()
    }else{
        alert('du må fylle ut bookingnr')
    }
        "
    ><i class="fas fa-search"></i> Søk</button> <label for="date">Dato:</label><input onchange="model.input.adminSeachDate = this.value" type="date" name="date"><button class="btn small" onclick="
    
    if (model.input.adminSeachDate != '') {
    setAdminSearchOnDate()
    }else {
        alert('Du må velge en dato')
    }
    
    "><i class="fas fa-search"></i> Søk</button> </div>`;
    html += `<div id="bookingNrSearch">`
    //sort in loop smallest date first. create view with first date first. and show for a week. 
    hasnotRun = true;
    for (let booking in model.bookings) {
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
                startdate = new Date(model.bookings[booking].dates[0]);
                enddate = new Date(model.bookings[booking].dates[model.bookings[booking].dates.length - 1]);
                startdate = date_fixer(startdate);
                enddate = date_fixer(enddate);

                html += startdate + ' -> ' + enddate;
                
            }

            html += '</p>';
            html += `<button onclick="deleteBooking('${model.bookings[booking].booking_number}')" class="deleteButton">Slett reservasjon</button>`;
            hasnotRun = false;
            html += `<button  onclick="model.input.selectedBookingNr = '${model.bookings[booking].booking_number}'; setshowEditBooking()" class="alterButton">Endre reservasjon</button>`;
            html += '</div>';
        } 
    }
    if (hasnotRun) {
        html += `<h2>finner ikke bookingen</h2>`
    }

    html += ` </div>`;
    model.input.adminSearchBookingNr = '';
    html += footerView()
    app.innerHTML = html;
}

function updateAdminSearchOnDate() {
    let html = ``;
    html += viewHeader();
    html += `<div><label for="search">Søk:</label><input name="search" onchange="model.input.adminSearchBookingNr = this.value" placeholder="Søk på bookingnr"><button class="btn small" onclick="
    if(model.input.adminSearchBookingNr!= ''){
        setAdminSearchOnBookingNr()
    }else{
        alert('du må fylle ut bookingnr')
    }
        "
    ><i class="fas fa-search"></i> Søk</button> <label for="date">Dato:</label><input onchange="model.input.adminSeachDate = this.value" type="date" name="date"><button class="btn small" onclick="
    
    if (model.input.adminSeachDate != '') {
    setAdminSearchOnDate()
    }else {
        alert('Du må velge en dato')
    }
    
    "><i class="fas fa-search"></i> Søk</button> </div>`;
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
            weekday = date_fixer(weekday);
            html += '<th>' + weekday + '</th>';
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
                    abooking = date_fixer(booking);
                    aweekday = date_fixer(weekday);
                    if (aweekday == abooking) {
                       
                        bookingNr = getBookId(room, booking);
                        date = date_fixer(weekday); 
                        html += `<td class="booked" onclick="model.input.selectedBookingNr = '${bookingNr}'; setShowBookingView();">${date}</td>`;
                        hasRun = true;
                    }
                }
            }

            if (!hasRun) {
                date = date_fixer(weekday);
                html += `<td class="notBooked">${date}</td>`;
            }


        }
    }

    html += '</tr>'




    html += ` 
        </table >`;

    html += ` </div>`;
    model.input.adminSeachDate = '';
    html += footerView()
    app.innerHTML = html;
}

function updateAdminView() {
    let html = ``;
    html += viewHeader();
    html += `<div><label for="search">Søk:</label><input name="search" onchange="model.input.adminSearchBookingNr = this.value" placeholder="Søk på bookingnr"><button class="btn small" onclick="
    if(model.input.adminSearchBookingNr!= ''){
        setAdminSearchOnBookingNr()
    }else{
        alert('du må fylle ut bookingnr')
    }
        "
    ><i class="fas fa-search"></i> Søk</button> <label for="date">Dato:</label><input onchange="model.input.adminSeachDate = this.value" type="date" name="date"><button class="btn small" onclick="
    if (model.input.adminSeachDate != '') {
    setAdminSearchOnDate()
    }else {
        alert('Du må velge en dato')
    }
    
    "><i class="fas fa-search"></i> Søk</button> </div>`;
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
        date = date_fixer(weekday);
        html += '<th>' + date + '</th>';
    }
    let hasRun = false;
    //loop gjennom datoene fra model.bookings, og sjekk om dem er like
    //for hver booking skal det lages en td som markerer bookingen. For alle romnr som er booket skal det lages en tr. 
    for (let room in model.rooms) {
        html += `</tr><tr id="a${room}">`;
       
        html += `<td onclick=" model.input.selectedRoom = ${room}; setRoomWeekView();">${room}</td>`;
        for (let weekday of week) {
            hasRun = false;
            if (model.rooms[room].booked_dates != undefined) {
                for (let booking of model.rooms[room].booked_dates) {
                    booking = new Date(booking);
                    abooking = date_fixer(booking);
                    aweekday = date_fixer(weekday);
                    if (aweekday == abooking) {
                       
                        bookingNr = getBookId(room, booking);
                        date = date_fixer(weekday); 
                        html += `<td class="booked" onclick="model.input.selectedBookingNr = '${bookingNr}'; setShowBookingView();">${date}</td>`;
                        hasRun = true;
                    }
                }
            }

            if (!hasRun) {
                date = date_fixer(weekday);
                html += `<td class="notBooked">${date}</td>`;

            }

        }
    }

    html += '</tr>'




    html += ` 
        </table >`;

    html += ` </div>`;
    html += footerView()
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
    for (let booking of model.users[model.page.current_user].list_of_bookings) {
        
            html += `<div onclick="model.input.selectedBookingNr = '${booking.booking_number}'; setShowBookingView(); " class="booking">`;
            html += `<br>`;
            html += model.rooms[booking.room_id].room_type;
               
            html += `<br>`;
            html += date_fixer(new Date(booking.dates[0])) + '--><br>';
            html += date_fixer(new Date(booking.dates[booking.dates.length - 1])) + '<br>';

            
            html += `</div>`;
        
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

    if(model.page.search_results.length == 0 && model.page.error.length > 0){
        html += `
        <h1>${model.page.error}</h1>
        `
    }
    if(model.page.search_results.length == 0 && model.page.error.length == 0){
        html += `
        <h1>Ingen flere rom på denne dato.</h1>`
    }
    
    //looping through the search results
    for (var room of model.page.search_results) {
        html += `
        <div class="card">
            <p>${room.room_id}
            <div id="room.room_id">
            <img src='${room.img_url}' alt="Standard" width="350" height="200">
            <p>Room Type: ${room.room_type}</p>
            <p>Price: ${room.room_prices}</p>
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
        html += `<div class="logout"><span id="login" onclick="setUserPanel()">${model.users[model.page.current_user].personalia.first_name}</span>
        <span onclick="setAdminPanel()"><i class="fas fa-ad"></i> admin </span>
<span onclick="setAddNewRoomView()">Legg til nytt rom</span>
<span onclick="logout()"><i class="fas fa-sign-out-alt"></i> logout</span></div></div>`;

    }
    else if (model.users[model.page.current_user].role == 'user') {
        html += `<div class="logout"><span id="login" onclick="setUserPanel()">${model.users[model.page.current_user].personalia.first_name} </span><span onclick="logout()"><i class="fas fa-sign-out-alt"></i>  logout </span> <span onclick="setCart()"><i class="fas fa-luggage-cart"></i>Handlevogn</span></div></div>`;
    }

    html += `</div>`
    return html
}

function footerView() {
    let html = ``;
    html += `
    <br>
    <br>
    <div id="footer">
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

function updateconfirmationview() {
    var html = ''
    html += viewHeader()
    html += "<h1> Du har nå følgende reservasjoner:</h1>"
    for( var booking of model.users[model.page.current_user].list_of_bookings){
        html += `
         <p>Booking-Nr: ${booking.booking_number}; Start-Dato: ${date_fixer(new Date(booking.dates[0]))}; Slutt-Dato: ${date_fixer(new Date(booking.dates[booking.dates.length -1]))}</p>
        <br>
        <br>`
    }
    
    html += footerView()
    app.innerHTML = html
}