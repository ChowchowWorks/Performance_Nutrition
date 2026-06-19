import React, { useState } from "react";
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import './Dashboard.css';

const Dashboard = () => {
    const [activeTab, setActiveTab] = useState("calendar");

    const exerciseDateList = [
    { date: "2026-06-03", type: "Running", duration: 30 },
    { date: "2026-06-07", type: "Cycling", duration: 45 },
    { date: "2026-06-12", type: "Swimming", duration: 60 },
    { date: "2026-06-19", type: "Gym", duration: 50 },
    { date: "2026-06-23", type: "Walking", duration: 40 },
    ];

    const [exerciseDates] = useState(() => {
    const stickers = {};

    exerciseDateList.forEach((exercise) => {
        stickers[exercise.date] = {
        type: exercise.type,
        duration: exercise.duration,
        rotate: -15 + Math.random() * 30,
        };
    });

    return stickers;
    });

    const addSticker = (info) => {
        const dateStr = info.date.toLocaleDateString("en-CA");
        const sticker = exerciseDates[dateStr];

        if (!sticker) return;

        const frame = info.el.querySelector(".fc-daygrid-day-frame");
        if (!frame) return;

        const existingStar = frame.querySelector(".exercise-star");
        if (existingStar) existingStar.remove();

        const existingInfo = frame.querySelector(".exercise-info");
        if (existingInfo) existingInfo.remove();

        const star = document.createElement("span");

        star.className = "exercise-star";
        star.innerText = "⭐";

        star.style.position = "absolute";
        star.style.top = "4px";
        star.style.left = "4px";
        star.style.fontSize = "1.3rem";
        star.style.transform = `rotate(${sticker.rotate}deg)`;
        star.style.pointerEvents = "none";
        star.style.zIndex = "2";

        frame.style.position = "relative";
        frame.appendChild(star);

        const exerciseInfo = document.createElement("div");

        exerciseInfo.className = "exercise-info";
        exerciseInfo.innerText = `${sticker.duration} min ${sticker.type}`;

        exerciseInfo.style.position = "absolute";
        exerciseInfo.style.top = "45px";
        exerciseInfo.style.left = "4px";
        exerciseInfo.style.right = "4px";
        exerciseInfo.style.padding = "5px 7px";
        exerciseInfo.style.borderRadius = "4px";
        exerciseInfo.style.fontSize = "0.9rem";
        exerciseInfo.style.backgroundColor = "#047857";
        exerciseInfo.style.color = "white";
        exerciseInfo.style.overflow = "hidden";
        exerciseInfo.style.whiteSpace = "nowrap";
        exerciseInfo.style.textOverflow = "ellipsis";
        exerciseInfo.style.zIndex = "2";

        frame.appendChild(exerciseInfo);
    };

    const currentDate = new Date().toLocaleDateString("en-GB", {
        year: "numeric",
        month: "long",
        day: "numeric",
        weekday: "long"
    });


    return (
        <div className = "DashboardPage">
            <div className = "headerRow">
                        <h1 className = "pageName"> Personal Dashboard </h1>
                        <h3> 📆 {currentDate} </h3>
                    </div>

            <div className = "loggerContainer">
                <div className="tabSelection">
                    <button className={activeTab === "calendar" ? "activeTab" : "tabBtn"}
                    onClick={() => setActiveTab("calendar")}>
                        Calendar
                    </button>

                    <button className={activeTab === "stats" ? "activeTab" : "tabBtn"}
                    onClick={() => setActiveTab("stats")}>
                        Stats
                    </button>
                </div>
            </div>

            <div className = "loggerCard"> 
                {activeTab === "calendar" && (
                    <>
                        <FullCalendar
                            plugins = {[ dayGridPlugin ]}
                            initialView = "dayGridMonth"
                            dayCellDidMount = {addSticker}
                        />
                    </>
                )}
            </div>

            <div className = "loggerCard"> 
                {activeTab === "stats" && (
                    <p>Stats page!</p>
                )}
            </div>
        </div>
    )
}
export default Dashboard;