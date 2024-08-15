import { Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

const Homepage = () => {

    const reviews = [
        { user: "Alex M.", msg: "BuddyBalance has been a game-changer for our group. Managing our loans is now straightforward and hassle-free. Highly recommended!" },
        { user: "Jamie L.", msg: "The app’s minimal design is perfect for what we need. We can easily track who owes what and settle up without any confusion." },
        { user: "Morgan T.", msg: "I love how intuitive BuddyBalance is. It’s made keeping track of my personal loans so much easier!" },
        { user: "Taylor R.", msg: "A fantastic app! It’s so easy to use and really helps to keep everyone in the loop with their loans." },
        { user: "Jordan W.", msg: "Excellent tool for managing group finances. The interface is clean and user-friendly, making loan tracking a breeze." },
        { user: "Casey H.", msg: "BuddyBalance has simplified our group expenses so much. We no longer have to worry about who owes what. It’s a must-have!" },
        { user: "Sydney K.", msg: "The best part about BuddyBalance is how it cuts down on unnecessary transactions. It’s efficient and super easy to use." },
        { user: "Robin P.", msg: "Great app for managing group loans! The design is sleek, and it makes everything so much more transparent and manageable." }
    ];


    return (
        <div className="flex flex-col bg-gray-100 mb-32">
            {/* Hero Section */}
            <section className="flex-1 bg-white text-center py-12 px-6">
                <div className="container mx-auto">
                    <h1 className="text-4xl font-bold text-gray-800 mb-4">
                        Welcome to BuddyBalance
                    </h1>
                    <p className="text-lg text-gray-600 mb-8">
                        Your friendly loan tracker made simple and intuitive.
                    </p>
                    <div className="flex justify-center space-x-4">
                        <Link
                            to="/auth?mode=login"
                            className="bg-blue-500 text-white px-6 py-3 rounded-lg shadow hover:bg-blue-600 transition duration-300"
                        >
                            Login
                        </Link>
                        <Link
                            to="/auth?mode=signup"
                            className="bg-green-500 text-white px-6 py-3 rounded-lg shadow hover:bg-green-600 transition duration-300"
                        >
                            Sign Up
                        </Link>
                    </div>
                </div>
            </section>

            {/* What We Do Section */}
            <section className="bg-gray-200 py-12 px-6">
                <div className="container mx-auto">
                    <h2 className="text-3xl font-bold text-gray-800 text-center mb-8">
                        What We Do
                    </h2>
                    <div className="text-center">
                        <p className="text-lg text-gray-600 mb-4">
                            At BuddyBalance, we make it easy to manage friendly loans within your groups. Whether you’re splitting bills or tracking personal loans, our platform helps you stay organized and transparent.
                        </p>
                        <p className="text-lg text-gray-600 mb-4">
                            Our simple and user-friendly interface lets you add, track, and settle loans effortlessly. Say goodbye to confusing spreadsheets and manual calculations!
                        </p>
                    </div>
                </div>
            </section>

            {/* Reviews Section */}
            <section className="bg-white py-12 px-6">
                <div className="container mx-auto">
                    <h2 className="text-3xl font-bold text-gray-800 text-center mb-8">
                        What Our Users Say
                    </h2>
                    <Swiper
                        spaceBetween={30}
                        slidesPerView={3}
                        autoplay={{
                            delay: 5000,
                            disableOnInteraction: false,
                        }}
                        pagination={{
                            clickable: true,
                        }}
                        navigation={true}
                        modules={[Autoplay, Pagination, Navigation]}
                    >
                        {reviews.map((review, index) => (
                            <SwiperSlide key={index} className="bg-gray-100 p-6 rounded-lg shadow-lg">
                                <p className="text-gray-600 min-h-32">
                                    “{review.msg}” <br /> <span className="justify-end font-semibold text-nowrap"> - {review.user}</span>
                                </p>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </div>
            </section>
        </div>
    );
};

export default Homepage;
