let model = {
    input : {
        tempUser: '',
        tempPassw: '',
        start_date: '',
        end_date: '',
        num_of_pers: 0,
        num_of_rooms: 1,
        adminSeachDate:"",
        adminSearchBookingNr:"",
    },
    rooms: [
        {
            room_id:101,
            room_type: "Standart", //or business, premium
            room_prices: "1000kr",
            beds : 2,
            kids : 1,
            booked_dates: [],
            img_url:"https://amorgoshotel.com/wp-content/uploads/2014/12/Amorgos-Standard-Room1-e1464286427430.jpg",

        },
        {
            room_id:201,
            room_type: "Business", //or business, premium
            room_prices: "1200kr",
            beds : 2,
            kids : 1,
            booked_dates: [],
            img_url:"https://t-cf.bstatic.com/images/hotel/max1280x900/557/55724294.jpg",
        },
        {
            room_id:301,
            room_type: "Premium", //or business, premium
            room_prices:"1500kr",
            beds : 2,
            kids : 1,
            booked_dates:  [],
            img_url:"https://www.kidsquest.com/wp-content/uploads/2017/06/Soaring-Hotel-room.jpg",
        }
    ],
    prices : {
        standart : 1000,
        business: 1200,
        premium: 1500,
    },
    booking_numbers: ["start",],
    bookings: [
        {
            room_id: 201,
            userId: 0, /// user id eller epost! 
            dates: [],           
            num_pers: 2,
            booking_number: 1,
        },
        
    ],
    users:  [
        {
            
            username: 'test',
            password: 'test',
            role: 'admin',
            userId: 0,
            personalia: {
                first_name: "Christoffer",
                last_name: "Superstar",
                street: "Superstreet 7",
                city: "Larvik",
                country: "Norway",
                email: "chr.superstart@gmail.com",
                tel_num: "+47 91166669",
            },
            cart: []

        },
        {

            username: 'bruker',
            password: 'bruker',
            role: 'user',
            userId: 1,
            personalia: {
                first_name: "Christoffer",
                last_name: "Superstar",
                street: "Superstreet 7",
                city: "Larvik",
                country: "Norway",
                email: "chr.superstart@gmail.com",
                tel_num: "+47 91166669",
            },
            list_of_bookings: [],
            cart: []

        },
        {

            username: 'Guest',
            password: '',
            role: 'guest',
            userId: 2,
            personalia: {
                first_name: "Guest",
                last_name: "Superstar",
                street: "Superstreet 7",
                city: "Larvik",
                country: "Norway",
                email: "chr.superstart@gmail.com",
                tel_num: "+47 91166669",
            },
            cart: []

        },
        
        ],
    page: {
        current_user: 2,
        page_pos: 'home',
        search_results: [],
        error: '',
    }
}


//Temp for test

function writeData(){
    var list = []
    for (i=0; i<6; i++){
        list.push(Date(`2021-03-2`+i+'T01:00:00'))
    }
    database.ref('bookings/0/dates').set(list)
    database.ref('rooms/1/booked_dates').set(list)
}
//writeData()


