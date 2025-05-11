import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import axios from "axios";
import checkLogin from "../api/Login";
import myImage from "../assets/upcoming-events-neon-text-sign-vector-22241374.jpg";

const Home = () => {
    const [user, setUser] = useState(null);
    const [events, setEvents] = useState([]);
    const [tendance, setTendance] = useState([]);
    const [error, setError] = useState(null);
    const navigate = useNavigate(); // Initialize useNavigate
    const [filteredEvents, setFilteredEvents] = useState([]);
    const [categories, setCategories] = useState([]); 
    const [selectedCategory, setSelectedCategory] = useState("");

    useEffect(() => {
        const fetchUser = async () => {
            const authenticatedUser = await checkLogin();
            if (authenticatedUser) {
                setUser(authenticatedUser);
            }
        };

        const fetchEvents = async () => {
            try {
                const response = await axios.get("http://localhost:4000/all_events");
                setEvents(response.data);        
                setFilteredEvents(response.data);    
                
                const uniqueCategories = [...new Set(response.data.map(event => event.categorie))];
                setCategories(uniqueCategories);
            } catch (error) {
                console.error("Error fetching events:", error);
                setError("Failed to load events");
            }
        };

        const fetchTendance = async () => {
            try {
                const response = await axios.get("http://localhost:4000/trending");
                setTendance(response.data);                
            } catch (error) {
                console.error("Error fetching events:", error);
                setError("Failed to load events");
            }
        };

        fetchUser();
        fetchEvents();
        fetchTendance();
    }, []);


    const handleCategoryChange = (event) => {
        const selected = event.target.value;
        setSelectedCategory(selected);

        if (selected) {
            const filtered = events.filter(e => e.categorie === selected);
            setFilteredEvents(filtered);
        } else {
            setFilteredEvents(events); // Show all events if no category is selected
        }
    };

    // Handle "Voir plus" button click
    const handleVoir = (eventId) => {
        navigate(`/details/${eventId}`); // Redirect to event details page
    };

    return (
        <div>
            <div className="mt-10">
                <label htmlFor="categoryFilter" className="block text-sm font-medium text-gray-900 shadow-md shadow-violet-900 p-2 rounded-2xl mb-2">
                    Filtrer par Catégorie
                </label>

                <select
                    id="categoryFilter"
                    className="mt-1.5 w-full rounded-lg border-gray-300 text-gray-700 sm:text-sm outline-none"
                    value={selectedCategory}
                    onChange={handleCategoryChange}
                >
                    <option value="">Toutes les catégories</option>
                    {categories.map((category, index) => (
                        <option key={index} value={category}>{category}</option>
                    ))}
                </select>
            </div>
            
            <h1 className="mb-5 underline">Evenement Populaire</h1>

            <div className="grid grid-cols-1 gap-48 lg:grid-cols-4 lg:gap-8 w-[800px] mx-auto mb-16">
                        {tendance.map((event) => (
                            <div key={event._id} className="h-64 rounded-lg bg-gray-200">
                                <article className="overflow-hidden rounded-lg shadow-md transition hover:shadow-lg shadow-black">
                                    {event.imagePath ? (
                                        <img src={`http://localhost:4000${event.imagePath}`} alt="Event" className="w-72 h-32 object-cover rounded" />
                                    ) : (
                                        "No Image"
                                    )}

                                    <div className="bg-white p-4 sm:p-6">
                                        <time className="block text-xs text-gray-500 underline font-extrabold">
                                            {new Date(event.date).toLocaleDateString("fr-FR", {
                                                day: "2-digit",
                                                month: "2-digit",
                                                year: "2-digit",
                                            })}
                                        </time>

                                        <h3 className="mt-0.5 text-lg text-gray-900 font-bold">Titre : {event.nom}</h3>

                                        <button
                                            onClick={() => handleVoir(event._id)} // Pass event ID
                                            className="bg-violet-800 w-32 rounded-2xl text-white font-bold shadow-md shadow-black cursor-pointer"
                                        >
                                            Voir plus
                                        </button>
                                    </div>
                                </article>
                            </div>
                        ))}
            </div>


            <h1 className="mb-5 underline">Événements</h1>

            <div className="grid grid-cols-1 gap-48 lg:grid-cols-4 lg:gap-8 w-[800px] mx-auto mb-14">
                {filteredEvents.length > 0 ? (
                    filteredEvents.map((event) => (
                        <div key={event._id} className="h-64 rounded-lg bg-gray-200 mt-5">
                            <article className="overflow-hidden rounded-lg shadow-md transition hover:shadow-lg shadow-black">
                                {event.imagePath ? (
                                    <img src={`http://localhost:4000${event.imagePath}`} alt="Event" className="w-72 h-32 object-cover rounded" />
                                ) : (
                                    "No Image"
                                )}

                                <div className="bg-white p-4 sm:p-6">
                                    <time className="block text-xs text-gray-500 underline font-extrabold">
                                        {new Date(event.date).toLocaleDateString("fr-FR", {
                                            day: "2-digit",
                                            month: "2-digit",
                                            year: "2-digit",
                                        })}
                                    </time>

                                    <h3 className="mt-0.5 text-lg text-gray-900 font-bold">Titre : {event.nom}</h3>
                                    <p className="text-sm text-gray-600">Catégorie: {event.categorie}</p>

                                    <button
                                        onClick={() => handleVoir(event._id)}
                                        className="bg-violet-800 w-32 rounded-2xl text-white font-bold shadow-md shadow-black cursor-pointer"
                                    >
                                        Voir plus
                                    </button>
                                </div>
                            </article>
                        </div>
                    ))
                ) : (
                    <p className="text-gray-700">Aucun événement trouvé.</p>
                )}
            </div>

            {error && <p className="text-red-500">{error}</p>}

            <footer className="bg-gray-900 rounded-3xl shadow-2xl shadow-black">
                <div className="mx-auto max-w-screen-xl px-4 py-8 sm:px-6 lg:px-8">
                    <div className="sm:flex sm:items-center sm:justify-between">
                    <div className="flex justify-center text-teal-600 sm:justify-start">
                        <img src={myImage} alt="My Image" className="w-32 h-16 object-cover rounded-2xl shadow-black shadow-xl mt-4" />
                    </div>

                    <p className="mt-4 text-center text-sm text-gray-500 lg:mt-0 lg:text-right">
                        Copyright &copy; 2025. <span className="font font-extrabold text-gray-300 underline">By Na'taye Badamo Odrien Yuhana</span> . All rights reserved.
                    </p>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Home;
