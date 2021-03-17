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
