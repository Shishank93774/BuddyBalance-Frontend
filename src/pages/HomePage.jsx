import { Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';
import reviews from '../data/reviews';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import { useAuth } from '../context/AuthContext';

const Homepage = () => {
    const { user } = useAuth();

    return (
        <div className="flex flex-col bg-gray-100 mb-32">
            {/* Hero Section: Welcome message and authentication links */}
            <section className="flex-1 bg-white text-center py-12 px-6">
                <div className="container mx-auto">
                    <h1 className="text-4xl font-bold text-gray-800 mb-4">
                        Welcome to BuddyBalance
                    </h1>
                    <p className="text-lg text-gray-600 mb-8">
                        Your friendly loan tracker made simple and intuitive.
                    </p>
                    <div className="flex justify-center space-x-4">
                        {user ? (
                            <p className="text-lg text-gray-600">
                                Welcome back, <span className="font-medium">{user.username}!</span>
                            </p>
                        ) : (
                            <>
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
                            </>
                        )}
                    </div>
                </div>
            </section>

            {/* What We Do Section: Explanation of the platform's purpose */}
            <section className="bg-gray-200 py-12 px-6">
                <div className="container mx-auto text-center">
                    <h2 className="text-3xl font-bold text-gray-800 mb-8">What We Do</h2>
                    <p className="text-lg text-gray-600 mb-4">
                        At BuddyBalance, we simplify the management of friendly loans within your groups. Whether splitting bills or tracking personal loans, our platform keeps you organized and transparent.
                    </p>
                    <p className="text-lg text-gray-600 mb-4">
                        Our user-friendly interface lets you add, track, and settle loans effortlessly, eliminating the need for confusing spreadsheets and manual calculations!
                    </p>
                </div>
            </section>

            {/* Reviews Section: Display user reviews */}
            <section className="bg-white py-12 px-6">
                <div className="container mx-auto text-center">
                    <h2 className="text-3xl font-bold text-gray-800 mb-8">What Our Users Say</h2>
                    <Swiper
                        spaceBetween={30}
                        slidesPerView={3}
                        autoplay={{
                            delay: 5000,
                            disableOnInteraction: false,
                        }}
                        pagination={{ clickable: true }}
                        navigation={true}
                        modules={[Autoplay, Pagination, Navigation]}
                    >
                        {reviews.map((review, index) => (
                            <SwiperSlide key={index} className="bg-gray-100 p-6 rounded-lg shadow-lg">
                                <p className="text-gray-600 min-h-32">
                                    “{review.msg}” <br /> <span className="font-semibold">- {review.user}</span>
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
