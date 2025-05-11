import { useRef, useState, useEffect } from "react";
import axios from "axios";
import checkLogin from "../api/Login";


const Account = () => {

  const [user, setUser] = useState(null); // Store user details
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null); 
  const [form, setForm] = useState({
    nom: "",
    description: "",
    date: "",
    lieu: "",
    catégorie: "",
    creator_id: "",
    imagePath: "",
  });

  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false); 

  // Fetch user details on mount
  useEffect(() => {
    const fetchUser = async () => {
      const authenticatedUser = await checkLogin();
      if (authenticatedUser) {
        setUser(authenticatedUser); // Store user in state
      }
    };

    const fetchEventsWithCount = async () => {
      try {
        // Fetch all events
        const eventsResponse = await axios.get("http://localhost:4000/all_events");
        const allEvents = eventsResponse.data;
  
        // Fetch event registration counts
        const countResponse = await axios.get("http://localhost:4000/count_user_register");
        const eventCounts = countResponse.data; // This should be an array like [{ _id: "eventId1", registrationCount: 5 }, { _id: "eventId2", registrationCount: 10 }]
  
        // Merge event details with registration count
        const mergedEvents = allEvents.map(event => {
          // Find matching registration count
          const countData = eventCounts.find(e => e._id === event._id);
          return {
            ...event,
            registerationCount: countData ? countData.registerationCount : 0, // Default to 0 if no count found
          };
        });
  
        setEvents(mergedEvents);
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    };


    fetchUser();
    fetchEventsWithCount();
  }, []);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get("http://localhost:4000/count_user_register");
        console.log("count fetch:", response.data); // Log response correctly
        setEvents(response.data);
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    };

    fetchEvents();
  }, []);

  useEffect(() => {
    console.log("Updated events:", events);
  }, [events]);

  const handleButtonClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file ? file.name : null);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
  
    if (!user) {
      setError("User not authenticated");
      return;
    }

    setLoading(true);

    const formData = new FormData();
    formData.append("nom", form.nom);
    formData.append("description", form.description);
    formData.append("date", form.date);
    formData.append("lieu", form.lieu);
    formData.append("categorie", form.catégorie);
  
    if (fileInputRef.current.files[0]) {
      formData.append("image", fileInputRef.current.files[0]);
    }
      
    try {
      let response;
      if (selectedEvent) {
        console.log(selectedEvent);
        // If editing an event, send a PUT request to the correct endpoint
        response = await axios.put(
          `http://localhost:4000/update_event/${selectedEvent}`, // Updated URL
          formData, // Send form data as JSON (remove FormData for this request)
          { 
            withCredentials: true ,
            headers: { "Content-Type": "multipart/form-data" },
          }
          
        );
      } else {
        // Otherwise, create a new event with POST request
        response = await axios.post( 
          `http://localhost:4000/event_post/${user._id}`,
          formData,
          {
            withCredentials: true,
            headers: { "Content-Type": "multipart/form-data" },
          }
        );        
      }
      
      console.log("Request successful:", response.data);
      window.location.href = "/account";
    } catch (error) {
      console.error("Request failed:", error.response?.data || error.message);
      setError(error.response?.data?.message || "Request failed");
    }finally {
      setLoading(false);
    }
  };
  
  
  
  const handleEdit = (event) => {
    setSelectedEvent(event._id);
    setForm({
      nom: event.nom,
      description: event.description,
      date: event.date,
      lieu: event.lieu,
      catégorie: event.catégorie,
      creator_id: event.creator_id,
      imagePath: event.imagePath,
    });
  };

  const handleDelete = async (event) => {
      try {
        const response = await axios.delete(
          `http://localhost:4000/delete_event/${event._id}`, // Updated URL
          { withCredentials: true }
        );

        window.location.href = "/account";
      } catch(error) {
        console.error("Request to delete:", error.response?.data || error.message);
        setError(error.response?.data?.message || "Request to delete");
      }
    };

    if (loading) return <p className="text-green-600 font font-extrabold">En cours de publication ...</p>;

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-3 lg:gap-8 mt-10">
      <div className="rounded-lg bg-gray-200">
        <div className="mx-auto max-w-screen-xl px-4 py-16 sm:px-6 lg:px-8 shadow-md shadow-black">
          <div className="mx-auto max-w-lg text-center">
            <h1 className="text-2xl font-bold sm:text-3xl underline">Postez vos Événements!</h1>
          </div>

          <form onSubmit={handleSubmit} className="mx-auto mt-8 mb-0 max-w-md space-y-4">
            <div>
              <input
                type="text"
                className="w-full rounded-lg border-gray-200 p-4 pe-12 text-sm shadow-xs"
                placeholder="Entrez Nom"
                value={form.nom}
                onChange={(e) => setForm({ ...form, nom: e.target.value })}
                required
              />
            </div>

            <div>
              <input
                type="text"
                className="w-full rounded-lg border-gray-200 p-4 pe-12 text-sm shadow-xs"
                placeholder="Entrez la description"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                required
              />
            </div>

            <div>
              <input
                type="date"
                className="w-full rounded-lg border-gray-200 p-4 pe-12 text-sm shadow-xs"
                value={form.date}
                onChange={(e) => setForm({ ...form, date: e.target.value })}
                required
              />
            </div>

            <div>
              <input
                type="text"
                className="w-full rounded-lg border-gray-200 p-4 pe-12 text-sm shadow-xs"
                placeholder="Entrez le lieu"
                value={form.lieu}
                onChange={(e) => setForm({ ...form, lieu: e.target.value })}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900">Catégorie</label>
              <select
                className="mt-1.5 w-full rounded-lg border-gray-300 text-gray-700 sm:text-sm"
                value={form.catégorie}
                onChange={(e) => setForm({ ...form, catégorie: e.target.value })}
                required
              >
                <option value="">Sélectionnez la catégorie</option>
                <option value="Sports">Sports</option>
                <option value="Music">Music</option>
                <option value="Journal">Journal</option>
                <option value="Politiques">Politiques</option>
                <option value="Arts">Arts</option>
              </select>
            </div>

            <div>
              <button
                type="button"
                className="rounded-lg bg-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-400"
                onClick={handleButtonClick}
              >
                Sélectionnez une image
              </button>
              <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
                required
              />
              {selectedFile && (
                <p className="mt-2 text-sm text-gray-600">Fichier sélectionné: {selectedFile}</p>
              )}
            </div>

            <div className="flex items-center justify-between">
              <button
                type="submit"
                className="inline-block rounded-lg bg-blue-500 px-5 py-3 text-sm font-medium text-white cursor-pointer"
              >
                {selectedEvent ? "Modifier l'événement" : "Poster l'événement"}
              </button>
            </div>

            {error && <p className="text-red-500">{error}</p>}
          </form>
        </div>
      </div>
      <div className=" rounded-lg bg-gray-200 lg:col-span-2 shadow-md shadow-black">
        <h2 className="text-xl font-bold mb-4 underline">Liste des Événements</h2>
          
          {error && <p className="text-red-500">{error}</p>}

          {events.length > 0 ? (
            <table className="min-w-full bg-white border border-gray-100">
              <thead>
                <tr className="bg-gray-300 border shadow-md shadow-black">
                  <th className="p-2">Titre</th>
                  <th className="p-2 ">Description</th>
                  <th className="p-2 ">Date</th>
                  <th className="p-2 ">Lieu</th>
                  <th className="p-2 ">Catégorie</th>
                  <th className="p-2 ">Image</th>
                  <th className="p-2 ">Personnes Inscrits</th>
                  <th className="p-2 ">Edit</th>
                  <th className="p-2 ">Delete</th>
                </tr>
              </thead>
              <tbody>
                {events
                .filter(event => user && event.creator_id === user._id)
                .map((event) => (
                  <tr key={event._id} className="border">
                    <td className="p-2 border">{event.nom}</td>
                    <td className="p-2 border">{event.description}</td>
                    <td className="p-2 border">
                      {new Date(event.date).toLocaleDateString("fr-FR", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "2-digit",
                      })}
                    </td>
                    <td className="p-2 border">{event.lieu}</td>
                    <td className="p-2 border">{event.categorie}</td>
                    <td className="p-2 border">
                      {event.imagePath ? (
                        <img src={`http://localhost:4000${event.imagePath}`} alt="Event" className="w-16 h-16 object-cover rounded" />
                      ) : (
                        "No Image"
                      )}
                    </td>

                    <td className="p-2 border">{event.registerationCount}</td>

                    <td className="p-2 border">
                      <svg onClick={() => handleEdit(event)} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 text-orange-500 cursor-pointer">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                      </svg>


                    </td>

                    <td className="p-2 border">
                      <svg onClick={() => handleDelete(event)} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 text-red-600 cursor-pointer">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                      </svg>

                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="text-gray-700">Aucun événement trouvé.</p>
          )}
      </div>
    </div>
  );
};

export default Account;
