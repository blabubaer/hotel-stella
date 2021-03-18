
let app = document.getElementById("app");
updateView();
function updateView() {
    
    if (model.page.page_pos == 'home') {
        homepageview();
    } else if (model.page.page_pos == 'searchResults') {
        updateSearchView();
    }else if (model.page.page_pos == 'login'){
        updateLoginView();
    }else if(model.page.page_pos == 'User panel' && model.page.current_user != 2){
        updateUserpanelView();
    }else if(model.page.page_pos == 'Lag ny bruker'){
        updateNewUserView();
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



function updateNewUserView(){
    let page = model.page;
    let html = '';
    
    html += viewHeader();  
    html += searchBannerView();
    html += `
        
        <div>
        <h2>Velkommen ny bruker </h2>
            <div id="usersPannel">
            <p class="red">Fyll ut alle feltene nedenfor for å registrere en ny bruker</p>
            <br><h3>Profildata:</h3><br><label for="userName">Brukernavn:</label><br>
                <input name="userName" onchange="model.input.tempUserName = this.value" > <br>
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
                <br><h3>Kontakt:</h3><br><label for="email">Email:</label><br>
                <input name="email"  onchange="model.input.tempEmail = this.value"><br>
                <label for="tel">Telefon:</label><br>
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
                <br><h3>Persondata:</h3><br><label for="userName">Brukernavn:</label><br>
                <input name="userName" onchange="model.input.tempUserName = this.value" value="${model.users[model.page.current_user].username}"> <br>
                <label for="password">Passord:</label><br>
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
                <br><h3>Kontaktinformasjon:</h3><br><label for="email">Email:</label><br>
                <input name="email"  onchange="model.input.tempEmail = this.value" value="${model.users[model.page.current_user].personalia.email}"><br>
                <label for="tel">Telefon:</label><br>
                <input name="tel"  onchange="model.input.tempTel = this.value" value="${model.users[model.page.current_user].personalia.tel_num}"><br>
                <button style="    width: 159px;
                height: 38px; margin-top:20px;" onclick="storePersonalia()" class="btn">Lagre</button>
            </div>
            <div id="bookings">
            
            </div>
        </div>
       
            `;
            html += footerView(); 
    app.innerHTML = html;
}

function updateLoginView() {
    let page = model.page;
    let html = '';
    html += viewHeader();  
    html += `
        <div class="Login">    
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

    let html = ``;

   html += viewHeader();     
   html += searchBannerView();
    
        /* her må det skrives html */
    html +=  ` 
            <p>Her kommer søkeresultat</p>
        `;
        html += footerView(); 
    app.innerHTML = html;
}


function searchBannerView(){
    let html =``;
    html += `
        <div class="searchField">    
            <label for="startDato">Start Dato:</label>
            <input type="date" name="startDato" onchange="input_updater(this)">
            <label class="margin" for="sluttDato">Slutt Dato:</label>
            <input type="date" name="sluttDato" onchange="input_updater(this)">
            <label class="margin" for="antallPersoner">Antall personer:</label>  
            <input type="text" name="antallPersoner">
            <button class="btn small">Søk</button>
        </div>`;
        return html
}

function viewHeader(){
    let html = '';
    html += `<div id="header"><h1 onclick="setHomeView()">Hotell Stella - ${model.page.page_pos}</h1>`;
    if(model.page.current_user == '2'){
        html += `<span id="login" onclick="setLoginView()">login</span></div>`;
    }else{
        html += `<div class="logout"><span id="login" onclick="setUserPanel()">${model.users[model.page.current_user].personalia.first_name}</span><span onclick="logout()">logout</span></div></div>`;
    }
    return html
}

function footerView(){
    let html = ``;
    html += `<div id="footer">
    <h2>Stellas Hotel</h2>
    <p>informasjon om hotellet</p>
    </div>`;
    return html
}