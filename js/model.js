let model = {
    input : {
        tempUser: '',
        tempPassw: '',
    },
    rooms: [
        {
            room_id:100,
            room_type: "standart", //or business, premium
            beds : 2,
            kids : 1,
        }
    ],
    prices : {
        standart : 1000,
        business: 1200,
        premium: 1500,
    },
    bookings: [
        {
        room_id: 100,
        userId: 2, /// user id eller epost! 
        date: '24/12/2021',
        endDate: '25/12/2021',
        num_pers: 2,
        booking_number: 1,
        },
    ],
    booking_overview:[
        {
            room_id: 100,
            booked_dates:[]
        }
    ],
    users:  [
        {
            
            username: 'test',
            password: 'test',
            role: 'admin',
            userId: 1,
            personalia: {}

        },
        {

            username: 'bruker',
            password: 'bruker',
            role: 'user',
            userId: 2,
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
            userId: 3,
            personalia: {}

        },
        
        ],
    page: {
        current_user: 'guest',
        page_pos: 'home',
        search_results: [],
    }
}



