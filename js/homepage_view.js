/*borgar lager homepageview*/
let app = document.getElementById("app");
homepageview();
function homepageview() {
    let page = model.page;
    let html = '';
    html += '<div id="header"><h1>Hotell Stella</h1><span id="login" onclick="login()">login</span></div>';
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