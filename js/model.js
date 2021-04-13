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
    rooms:{
        101: {
            room_id:101,
            room_type: "Standart", //or business, premium
            room_prices: "1000kr",
            beds : 2,
            kids : 1,
            booked_dates: [],
            img_url:"https://amorgoshotel.com/wp-content/uploads/2014/12/Amorgos-Standard-Room1-e1464286427430.jpg",

        },
        201: {
            room_id:201,
            room_type: "Business", //or business, premium
            room_prices: "1200kr",
            beds : 2,
            kids : 1,
            booked_dates: [],
            img_url:"https://t-cf.bstatic.com/images/hotel/max1280x900/557/55724294.jpg",
        },
        301: {
            room_id:301,
            room_type: "Premium", //or business, premium
            room_prices:"1500kr",
            beds : 2,
            kids : 1,
            booked_dates:  [],
            img_url:"https://www.kidsquest.com/wp-content/uploads/2017/06/Soaring-Hotel-room.jpg",
        }
    },
    prices: {
        'Standart' : 1000,
        'Business': 1200,
        'Premium': 1500,
    },
    booking_numbers:["start",],
    bookings:{
        //example booking
        aaaaa:{
            room_id: 101,
            userId: 3,
            dates: [],
            num_of_pers: 2,
            booking_number: 'aaaaa',
        }
    },
    users: {
        0: {
            userId: 0,
            password: 'test',
            role:'admin',
            personalia:{
                first_name: "Christoffer",
                last_name: "Superstar",
                street: "Superstreet 7",
                city: "Larvik",
                country: "Norway",
                email: "chr.superstart@gmail.com",
                tel_num: "+47 91166669",
            },
        },
        //example-user
        1:{
            userId:1,
            password:'bruker',
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
            cart: [],
        },
        //standart Guest User (everybody who enters the site is first this)
        2:{
            userId:2,
            password: '',
            role: 'guest',
            personalia: {
                first_name: "Guest",
                last_name: "",
                street: "",
                city: "",
                country: "",
                email: "guest",
                tel_num: "",
            },
            cart:[],
        }
    },
    page:{
        current_user:2, //upon first entering you are a guest
        page_pos: 'home',
        search_results: [],
        error: '',
    },
    userId_counter: 3,
}