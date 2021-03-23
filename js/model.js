let model = {
    shopping_cart: {},
    input : {
        tempUser: '',
        tempPassw: '',
        start_date: '',
        end_date: '',
        num_of_pers: 0,
        num_of_rooms: 1,

    },
    rooms: [
        {
            room_id:101,
            room_type: "standart", //or business, premium
            room_prices: "1000kr",
            beds : 2,
            kids : 1,
            booked_dates: [],

        },
        {
            room_id:201,
            room_type: "business", //or business, premium
            room_prices: "1200kr",
            beds : 2,
            kids : 1,
            booked_dates: [],
        },
        {
            room_id:301,
            room_type: "premium", //or business, premium
            room_prices:"1500kr",
            beds : 2,
            kids : 1,
            booked_dates:[],
        }
    ],
    prices : {
        standart : 1000,
        business: 1200,
        premium: 1500,
    },
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
            }

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
            list_of_bookings: []

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
            }

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


