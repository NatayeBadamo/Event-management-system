import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import checkLogin from "../api/Login";

const EventDetails = () => {
    const { id } = useParams(); // Get event ID from URL
    const [user, setUser] = useState(null);
    const [event, setEvent] = useState(null);
    const [error, setError] = useState(null);
    const [isRegistered, setIsRegistered] = useState(false);
    const [form, setForm] = useState({
        nom_user: "",
        email_user: "",
        phone_user: "",
        event_id: ""
    });

    // Fetch user details on mount
    useEffect(() => {
        const fetchUser = async () => {
            const authenticatedUser = await checkLogin();
            if (authenticatedUser) {
                setUser(authenticatedUser); // Store user in state
            }
        };
        fetchUser();
    }, []);

    useEffect(() => {
        const fetchEvent = async () => {
            try {
                const response = await axios.get(`http://localhost:4000/event_details/${id}`);
                setEvent(response.data);
                console.log(response.data);
            } catch (error) {
                console.error("Error fetching event details:", error);
                setError("Event not found");
            }
        };

        fetchEvent();
    }, [id]);

    // Update event_id in form when event is fetched
    useEffect(() => {
        if (event) {
            setForm(prevForm => ({ ...prevForm, event_id: event._id }));
        }
    }, [event]);

    useEffect(() => {
        const fetchRegisterEvent = async () => {
            try {
                const response = await axios.get("http://localhost:4000/register");
                console.log("Register response:", response.data);
    
                if (user && event && response.data.length > 0) {
                    const isUserRegistered = response.data.some(
                        (registeredUser) => 
                            registeredUser.user_id === user._id && 
                            registeredUser.event_id === event._id // Ensure it's for this specific event
                    );
    
                    console.log("User ID:", user._id);
                    console.log("Event ID:", event._id);
                    console.log("Is user registered for this event:", isUserRegistered);
    
                    setIsRegistered(isUserRegistered);
                }
            } catch (error) {
                console.error("Error fetching registered events:", error);
            }
        };
    
        if (user && event) { // Ensure both user and event are available
            fetchRegisterEvent();
        }
    }, [user, event]); // Re-run when user or event changes
     // Runs again when `user` is set
     // Add `user` as a dependency so it runs when user is set
    

    const handleSubmit = async (event) => {
        event.preventDefault(); // Prevent page reload

        if (!user || !user._id) {
            setError("User not authenticated");
            return;
        }

        if (!form.event_id) {
            setError("Event ID is missing");
            return;
        }

        try {
            const response = await axios.post(
                `http://localhost:4000/register_event/${user._id}`,
                form,
                { withCredentials: true }
            );

            console.log("Register successful:", response.data);
            window.location.href = "/"; // Redirect after success
        } catch (error) {
            console.error("Register failed:", error.response?.data || error.message);
            setError(error.response?.data?.message || "Register failed");
        }
    };

    if (error) return <p className="text-red-500">{error}</p>;
    if (!event) return <p className="text-gray-900">Loading event details...</p>;

    return (
        <>
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-8 mt-24">
                {/* Event Details */}
                <div className="h-32 rounded-lg bg-gray-200">
                    <article className="overflow-hidden rounded-lg shadow-md transition hover:shadow-lg shadow-black">
                        {event.imagePath ? (
                            <img src={`http://localhost:4000${event.imagePath}`} alt="Event" className="w-72 h-56 object-cover rounded" />
                        ) : (
                            <p className="text-gray-500">Image non disponible</p>
                        )}

                        <div className="bg-white p-4 sm:p-6">
                            <time className="block text-xs text-gray-500 underline font-extrabold">
                                {new Date(event.date).toLocaleDateString("fr-FR", {
                                    day: "2-digit",
                                    month: "2-digit",
                                    year: "2-digit",
                                })}
                            </time>

                            <h3 className="mt-0.5 text-lg text-gray-900 font-bold mb-2">Titre : {event.nom}</h3>
                            <p className="mt-0.5 text-lg text-gray-900 font-bold">Description : <span className="shadow-md shadow-black p-2 rounded">{event.description}</span></p>
                        </div>
                    </article>
                </div>

                {/* Registration Form */}
                <div className="h-32 rounded-lg bg-gray-200 shadow-md shadow-black">
                    <div className="mx-auto max-w-screen-xl px-4 py-16 sm:px-6 lg:px-8 shadow-md shadow-black">
                        <div className="mx-auto max-w-lg text-center">
                            <h1 className="text-2xl font-bold sm:text-3xl">Inscrivez vous à cette événement</h1>
                        </div>

                        <form onSubmit={handleSubmit} className="mx-auto mt-8 mb-0 max-w-md space-y-4">
                            <div>
                                <input
                                    type="text"
                                    className="w-full rounded-lg border-gray-200 p-4 pe-12 text-sm mt-3 outline-none shadow-md shadow-black"
                                    placeholder="Entrez votre nom"
                                    value={form.nom_user}
                                    onChange={(e) => setForm({ ...form, nom_user: e.target.value })}
                                    required
                                />
                            </div>

                            <div>
                                <input
                                    type="email"
                                    className="w-full rounded-lg border-gray-200 p-4 pe-12 text-sm outline-none shadow-md shadow-black"
                                    placeholder="Enter email"
                                    value={form.email_user}
                                    onChange={(e) => setForm({ ...form, email_user: e.target.value })}
                                    required
                                />
                            </div>

                            <div>
                                <input
                                    type="number"
                                    className="w-full rounded-lg border-gray-200 p-4 pe-12 text-sm outline-none shadow-md shadow-black"
                                    placeholder="Numéro de tel"
                                    value={form.phone_user}
                                    onChange={(e) => setForm({ ...form, phone_user: e.target.value })}
                                    required
                                />
                            </div>

                            <div className="flex items-center justify-between">
                                <button
                                    type="submit"
                                    className={`inline-block rounded-lg px-5 py-3 text-sm font-medium text-white ${
                                        isRegistered
                                            ? "bg-gray-500 cursor-not-allowed"
                                            : "bg-blue-500 cursor-pointer"
                                    }`}
                                    disabled={isRegistered}
                                >
                                    {isRegistered ? "Déjà inscrit" : "S'inscrire"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
};

export default EventDetails;
