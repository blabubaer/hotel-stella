<<<<<<< HEAD
=======

let app = document.getElementById("app");
updateView();
>>>>>>> f038a168ca2d1055b9675e7de4a52d94f631abdb
function updateView() {
    
    if (model.page.page_pos == 'home') {
        homepageview();
    } else if (model.page.page_pos == 'searchResults') {
        updateSearchView();
<<<<<<< HEAD
    }
}

function setSearchView() {
    model.page.page_pos = 'searchResults';
        console.log('test');
    console.log(model.page.page_pos);
    updateView();
}

=======
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
    let page = model.page;
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
            <input type="date" name="startDato">
            <label class="margin" for="sluttDato">Slutt Dato:</label>
            <input type="date" name="sluttDato" >
            <label class="margin" for="antallPersoner">Antall personer:</label>  
            <input type="text" name="antallPersoner">
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
>>>>>>> f038a168ca2d1055b9675e7de4a52d94f631abdb

function updateSearchView() {

    let html = ``;


<<<<<<< HEAD
    html += '<div id="header"><h1>Hotell Stella</h1><span id="login" onclick="login()">login</span></div>';
=======
    html += `<div id="header"><h1 onclick="setHomeView()">Hotell Stella - ${model.page.page_pos}</h1>`;
    if(model.page.current_user == 'guest'){
        html += `<span id="login" onclick="setLoginView()">login</span></div>`;
    }else{
        html += `<span id="login" onclick="userPanel()">${model.page.current_user}</span></div>`;
    }
>>>>>>> f038a168ca2d1055b9675e7de4a52d94f631abdb
    html += `
        <div class="searchField">    
            <label for="startDato">Start Dato:</label>
            <input type="date" name="startDato">
            <label class="margin" for="sluttDato">Slutt Dato:</label>
            <input type="date" name="sluttDato" >
            <label class="margin" for="antallPersoner">Antall personer:</label>  
            <input type="text" name="antallPersoner">
            <button class="btn">Søk</button>
        </div>`;
        /* her må det skrives html */
    html +=  ` 
<<<<<<< HEAD
            <div class="searchResultWrapper"><img src="https://pix6.agoda.net/hotelImages/1198373/-1/f9583757bde8c4dec85d5fcc570ca86b.jpg?s=1024x768"> <h2>Dette er søkerresultat</h2> <p>søker resultat"</p></div>
=======
            <p>Her kommer søkeresultat</p>
>>>>>>> f038a168ca2d1055b9675e7de4a52d94f631abdb
        `;
    html += `
        <div id="footer">
            <h2>Stellas Hotel</h2>
            <p>informasjon om hotellet</p>
        </div>
    `;
    app.innerHTML = html;
}