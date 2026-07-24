import { useState } from "react";
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import './Dashboard.css';
import SummaryCard from "../../components/SummaryCard";
import WeightChart from "../../components/WeightChart";
import NutritionCard from "../../components/NutritionCard";
import MetricCard from "../../components/MetricCard";
import WorkoutCarousel from "../../components/WorkoutCarousel";
import WorkoutChart from "../../components/WorkoutChart";

const Dashboard = () => {
    const [activeTab, setActiveTab] = useState("stats");

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

    const dashboardData = {
        summary: {
            calories: {
                current: 1850,
                goal: 2000,
            },
            weight: {
                current: 72.8,
                goal: 70,
            },
            steps: {
                current: 8214,
                goal: 10000,
            },
            protein: {
                current: 132,
                goal: 150,
            },
            water: {
                current: 2.1,
                goal: 3.0,
            },
        },

        weightHistory: [
            { date: "Jun 1", weight: 74.2 },
            { date: "Jun 5", weight: 73.9 },
            { date: "Jun 10", weight: 73.4 },
            { date: "Jun 15", weight: 73.1 },
            { date: "Jun 20", weight: 72.9 },
            { date: "Jun 25", weight: 72.8 },
        ],

        nutrition: {
            calories: {
                current: 1850,
                goal: 2000,
            },

            protein: {
                current: 132,
                goal: 150,
            },

            carbs: {
                current: 180,
                goal: 250,
            },

            fat: {
                current: 58,
                goal: 70,
            },
        },

        workout: {

            summary: {
                totalWorkouts: 14,
                totalMinutes: 620,
                averageDuration: 44,
                caloriesBurned: 3850,
                favouriteExercise: "Running"
            },

            history: [

                {
                    id:1,
                    exercise:"Running",
                    date:"2026-06-24",
                    duration:45,
                    calories:480
                },

                {
                    id:2,
                    exercise:"Strength",
                    date:"2026-06-22",
                    duration:60,
                    calories:620
                },

                {
                    id:3,
                    exercise:"Cycling",
                    date:"2026-06-20",
                    duration:90,
                    calories:760
                },

                {
                    id:4,
                    exercise:"Swimming",
                    date:"2026-06-18",
                    duration:40,
                    calories:390
                },

                {
                    id:5,
                    exercise:"Walking",
                    date:"2026-06-15",
                    duration:30,
                    calories:170
                }

            ],
        
        trend: [

            {
                week: "Week 1",
                minutes: 180
            },

            {
                week: "Week 2",
                minutes: 135
            },

            {
                week: "Week 3",
                minutes: 220
            },

            {
                week: "Week 4",
                minutes: 165
            }

        ]
        }
    };

    return (
        <div className = "DashboardPage">
            <div className = "headerRow">
                        <h1 className = "pageName"> Personal Dashboard </h1>
                        <h3> 📆 {currentDate} </h3>
                    </div>

            <div className = "loggerContainer">
                <div className="tabSelection">
                    <button className={activeTab === "stats" ? "activeTab" : "tabBtn"}
                    onClick={() => setActiveTab("stats")}>
                        Stats
                    </button>

                    <button className={activeTab === "calendar" ? "activeTab" : "tabBtn"}
                    onClick={() => setActiveTab("calendar")}>
                        Calendar
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
                    <div className="statsContainer">

                        <h2>Today's Summary</h2>

                        <div className="summaryGrid">
                            <SummaryCard
                                icon="🔥"
                                title="Calories"
                                current={dashboardData.summary.calories.current}
                                goal={dashboardData.summary.calories.goal}
                                unit=" kcal"
                            />

                            <SummaryCard
                                icon="⚖️"
                                title="Weight"
                                current={dashboardData.summary.weight.current}
                                goal={dashboardData.summary.weight.goal}
                                unit=" kg"
                            />

                            <SummaryCard
                                icon="👟"
                                title="Steps"
                                current={dashboardData.summary.steps.current}
                                goal={dashboardData.summary.steps.goal}
                                unit=""
                            />

                            <SummaryCard
                                icon="🥩"
                                title="Protein"
                                current={dashboardData.summary.protein.current}
                                goal={dashboardData.summary.protein.goal}
                                unit=" g"
                            />

                            <SummaryCard
                                icon="💧"
                                title="Water"
                                current={dashboardData.summary.water.current}
                                goal={dashboardData.summary.water.goal}
                                unit=" L"
                            />
                        </div>

                        <WeightChart data={dashboardData.weightHistory} />

                        <div className="nutritionSection">

                            <h2>Nutrition Overview</h2>

                            <NutritionCard
                                title="Calories"
                                {...dashboardData.nutrition.calories}
                                unit="kcal"
                            />

                            <NutritionCard
                                title="Protein"
                                {...dashboardData.nutrition.protein}
                                unit="g"
                            />

                            <NutritionCard
                                title="Carbohydrates"
                                {...dashboardData.nutrition.carbs}
                                unit="g"
                            />

                            <NutritionCard
                                title="Fat"
                                {...dashboardData.nutrition.fat}
                                unit="g"
                            />

                        </div>

                        <div className="metricGrid">

                            <MetricCard
                                icon="🏋️"
                                title="Workouts"
                                value={dashboardData.workout.summary.totalWorkouts}
                            />

                            <MetricCard
                                icon="⏱"
                                title="Minutes"
                                value={dashboardData.workout.summary.totalMinutes}
                                unit="min"
                            />

                            <MetricCard
                                icon="🔥"
                                title="Calories Burned"
                                value={dashboardData.workout.summary.caloriesBurned}
                                unit="kcal"
                            />

                            <MetricCard
                                icon="🏃"
                                title="Favourite Exercise"
                                value={dashboardData.workout.summary.favouriteExercise}
                            />

                        </div>

                        <WorkoutCarousel
                            workouts={dashboardData.workout.history}
                        />

                        <WorkoutChart
                            data = {dashboardData.workout.trend}
                        />    
                        
                    </div>
                )}
            </div>
        </div>
    )
}
export default Dashboard;