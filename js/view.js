function updateView() {
    
    if (model.page.page_pos == 'home') {
        homepageview();
    } else if (model.page.page_pos == 'searchResults') {
        updateSearchView();
    }
}

function setSearchView() {
    model.page.page_pos = 'searchResults';
        console.log('test');
    console.log(model.page.page_pos);
    updateView();
}


function updateSearchView() {

    let html = ``;


    html += '<div id="header"><h1>Hotell Stella</h1><span id="login" onclick="login()">login</span></div>';
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
            <div class="searchResultWrapper"><img src="https://pix6.agoda.net/hotelImages/1198373/-1/f9583757bde8c4dec85d5fcc570ca86b.jpg?s=1024x768"> <h2>Dette er søkerresultat</h2> <p>søker resultat"</p></div>
        `;
    html += `
        <div id="footer">
            <h2>Stellas Hotel</h2>
            <p>informasjon om hotellet</p>
        </div>
    `;
    app.innerHTML = html;
}