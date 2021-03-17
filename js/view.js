
let app = document.getElementById("app");
updateView();
function updateView() {
    
    if (model.page.page_pos == 'home') {
        homepageview();
    } else if (model.page.page_pos == 'searchResults') {
        updateSearchView();
    }else if (model.page.page_pos == 'login'){
        updateLoginView();
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
function updateLoginView() {
    let page = model.page;
    let html = '';
    html += `<div id="header"><h1 onclick="setHomeView()">Hotell Stella - ${model.page.page_pos}</h1>`;
    if(model.page.current_user == 'guest'){
        html += `<span id="login" onclick="login()">login</span></div>`;
    }else{
        html += `<span id="login" onclick="userPanel()">${model.page.current_user}</span></div>`;
    }
    html += `
        <div class="Login">    
            <label for="user">Brukernavn:</label>
            <input type="text" onchange="model.input.tempUser = this.value" name="user"><br>
            <label class="margin" for="psw">Passord:</label>
            <input type="password" onchange="model.input.tempPassw = this.value" name="psw" >
            
            <button onclick="login()" class="btn">login</button>
        </div>
        
        <div id="footer">
            <h2>Stellas Hotel</h2>
            <p>informasjon om hotellet</p>
        </div>
            `;
    app.innerHTML = html;
}
function homepageview() {
    let html = '';
    
    html += `<div id="header"><h1 onclick="setHomeView()">Hotell Stella - ${model.page.page_pos}</h1>`;
    if(model.page.current_user == 'guest'){
        html += `<span id="login" onclick="setLoginView()">login</span></div>`;
    }else{
        html += `<span id="login" onclick="userPanel()">${model.page.current_user}</span></div>`;
    }
    html += `
        <div class="searchField">    
            <label for="startDato">Start Dato:</label>
            <input type="date" name="startDato" onchange="input_updater(this)">
            <label class="margin" for="sluttDato">Slutt Dato:</label>
            <input type="date" name="sluttDato" onchange="input_updater(this)">
            <label class="margin" for="antallPersoner">Antall personer:</label>  
            <input type="text" name="antallPersoner" onchange="input_updater(this)">
            <button onclick="setSearchView()" class="btn">Søk</button>
        </div>
        <div id="map">
        <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d32685.15956757092!2d9.603076187783627!3d59.2022658295007!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x4647212b918718bb%3A0x97b76640a65e8514!2sClarion%20Collection%20Hotel%20Bryggeparken!5e0!3m2!1sno!2sno!4v1615902497588!5m2!1sno!2sno" width="600" height="450" style="border:0;" allowfullscreen="" loading="lazy"></iframe>
        </div>
        <div id="footer">
            <h2>Stellas Hotel</h2>
            <p>informasjon om hotellet</p>
        </div>
            `;
    app.innerHTML = html;
}

function updateSearchView() {
    console.log(model.page.search_results)
    let html = ``;


    html += `<div id="header"><h1 onclick="setHomeView()">Hotell Stella - ${model.page.page_pos}</h1>`;
    if(model.page.current_user == 'guest'){
        html += `<span id="login" onclick="setLoginView()">login</span></div>`;
    }else{
        html += `<span id="login" onclick="userPanel()">${model.page.current_user}</span></div>`;
    }
    html += `
        <div class="searchField">    
            <label for="startDato">Start Dato:</label>
            <input type="date" name="startDato" onchange="input_updater(this)">
            <label class="margin" for="sluttDato">Slutt Dato:</label>
            <input type="date" name="sluttDato" onchange="input_updater(this)">
            <label class="margin" for="antallPersoner">Antall personer:</label>  
            <input type="text" name="antallPersoner" onchange="input_updater(this)">
            <button class="btn" onclick="setSearchView()">Søk</button>
        </div>`;
    
    for (var room of model.page.search_results) {
        var img_url =''
        var room_price = 0
   
        if (room_type == 'standart'){
        img_url = 'https://amorgoshotel.com/wp-content/uploads/2014/12/Amorgos-Standard-Room1-e1464286427430.jpg'
        room_price = model.prices.standart
    } else if
        (room_type == 'business') {
            img_url = 'https://t-cf.bstatic.com/images/hotel/max1280x900/557/55724294.jpg'
            room_price = model.prices.business
        } else if 
            (room_type == 'first class'){
                img_url = 'https://www.kidsquest.com/wp-content/uploads/2017/06/Soaring-Hotel-room.jpg'
                room_price = model.prices.premium   
            }   
        app.innerHTML = html;

        html += `
        <div class="card">
        <p>${room.room_id}
         <div id="room.room_id">
        <img scr=${img_url} alt="Standard" width="350" height="200">
        <p>${room.room_type}</p>
        <p>${room_price}</p>
        <button class="btn">Velg</button>
        </div>
        
        `
    }
    html += `
        <div id="footer">
            <h2>Stellas Hotel</h2>
            <p>informasjon om hotellet</p>
        </div>
    `;
    app.innerHTML = html;
}

function input_updater(input_field) {
    if(input_field.name == "startDato") {
        model.input.start_date = input_field.valueAsDate
    }
    else if(input_field.name == "sluttDato") {
        model.input.end_date = input_field.valueAsDate
    }
    else if (input_field.name == "antallPersoner") {
        model.input.num_of_pers = parseInt(input_field.value)
    }
}