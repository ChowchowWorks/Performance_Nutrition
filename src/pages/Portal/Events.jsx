import React, { useState, useEffect } from "react";
import './Events.css';
import { db } from '../../firebase';
import { collection, getDocs } from 'firebase/firestore';

const Events = () => {

    const [events, setEvents] = useState([]);

    useEffect(() => {
        const getEvents = async () => {
        try {
            const coll = collection(db, "events");
            const collSnap = await getDocs(coll);

            const fetchedEvents = collSnap.docs.map(doc => ({
                id: doc.id, 
                ...doc.data()
            }));

            setEvents(fetchedEvents);

        } catch (error) {
            console.error("Error fetching events:", error);
        }};

        getEvents();
    }, []);

    const displayDuration = (duration) => {
        if (duration >= 60) {
            const hours = Math.floor(duration / 60);
            const mins = duration % 60;

            if (mins == 0) {
                return `${hours} hour${hours > 1 ? "s" : ""}`
            } else {
                return `${hours} hour${hours > 1 ? "s" : ""} ${mins} mins`;
            }
        } else {
            return duration + " mins";
        }
    }

    const displayDate = (timestamp) => {
        return timestamp.toDate().toLocaleDateString("en-GB", {
            day: "numeric",
            month: "short",
            year: "numeric",
            weekday: "long"
        });
    };

    const currentDate = new Date().toLocaleDateString("en-GB", {
        year: "numeric",
        month: "long",
        day: "numeric",
        weekday: "long"
    });

    return (
        <div className = "EventsPage">
            <div className = "headerRow">
                <h1 className = "pageName"> Upcoming Events! </h1>
                <h3> 📆 {currentDate} </h3>
            </div>

            <div className = "eventsList">
                {events.map(event => (
                    <div key = {event.id} className = "eventCard">
                        <img src = {event.link} alt = {event.eventName}/>
                        <h1> <span style = {{ fontWeight: 'bold'}}> {event.eventName} </span> </h1>
                        <h3> <span style = {{ fontWeight: 'bold'}}> 📆 {displayDate(event.eventDate)} </span> </h3>
                        <h3> <span style = {{ fontWeight: 'bold'}}> ⏱️ {displayDuration(event.duration)} </span> </h3>
                        <h3> 📍 <span style = {{ fontWeight: 'bold'}}> {event.location} </span> </h3>
                        <h3> 🔥 <span style = {{ fontWeight: 'bold'}}> Difficulty: </span> {event.difficulty} </h3>
                        <h3> <span style = {{ fontWeight: 'bold'}}> Spaces Left: </span> {event.spaces} </h3>
                        <h3> 🎒 <span style = {{ fontWeight: 'bold'}}> Packing List: </span> {event.packingList} </h3>
                        <p> {event.description} </p>

                        <button className = "registerButton"> Register Interest </button>
                    </div>
                ))}
            </div>
        </div>
    )
};

export default Events;