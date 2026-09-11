import { useState, useEffect } from "react";
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import './Dashboard.css';
import SummaryCard from "../../components/SummaryCard";
import WeightChart from "../../components/WeightChart";
import NutritionCard from "../../components/NutritionCard";
import MetricCard from "../../components/MetricCard";
import WorkoutCarousel from "../../components/WorkoutCarousel";
import WorkoutChart from "../../components/WorkoutChart";

import { supabase } from "../../supabase.js";
import { auth } from "../../firebase.js";

const Dashboard = () => {
    const [activeTab, setActiveTab] = useState("stats");

    const [calendarEvents, setCalendarEvents] = useState([]);

    const toTitleCase = (text) => {
        if (!text) return "";

        return text
            .split(" ")
            .map(word => 
                word.charAt(0).toUpperCase() +
                word.slice(1).toLowerCase()
            ).join(" ");
    };

    const getCalendarWorkouts = async (start, end) => {
        const { data, error } = await supabase
            .from("workouts")
            .select(`
                date, 
                duration,
                exercise_type
            `)
            .gte("date", start.toISOString())
            .lt("date", end.toISOString())
            .order("date", { ascending: true });
        
        if (error) {
            console.error("Error fetching calendar workouts:", error);
            return;
        }

        const workoutsByDay = {};

        (data ?? []).forEach((workout) => {
            const workoutDate = new Date(workout.date);
            
            const dateKey = workoutDate.toLocaleDateString("en-CA");

            if (!workoutsByDay[dateKey]) {
                workoutsByDay[dateKey] = [];
            }

            workoutsByDay[dateKey].push({
                type: toTitleCase(workout.exercise_type),
                duration: workout.duration
            });
        });

        const events = [];

            Object.entries(workoutsByDay).forEach(
            ([date, workouts]) => {

                if (workouts.length <= 3) {
                    workouts.forEach((workout) => {
                        events.push({
                            title:
                                `⭐ ${workout.duration} min ${workout.type}`,
                            date
                        });
                    });
                } else {
                    const totalDuration = workouts.reduce(
                        (sum, workout) =>
                            sum + workout.duration,
                        0
                    );

                    events.push({
                        title:
                            `⭐ ${workouts.length} workouts · ${totalDuration} min`,
                        date
                    });
                }
            }
        );

        setCalendarEvents(events);
    }

    const currentDate = new Date().toLocaleDateString("en-GB", {
        year: "numeric",
        month: "long",
        day: "numeric",
        weekday: "long"
    });
    
    // States for Stats and Goals
    const [todayStats, setTodayStats] = useState(null);
    const [nutritionGoals, setNutritionGoals] = useState(null);

    // Obtain Today's Information
    // Calories, Weight, Steps, Protein, Water
    useEffect(() => {
        const getTodayStats = async () => {
            const now = new Date();

            const start = new Date(
                now.getFullYear(),
                now.getMonth(),
                now.getDate()
            );

            const end = new Date(
                now.getFullYear(),
                now.getMonth(),
                now.getDate() + 1
            );

            const { data: stepData, error: stepError } = await supabase
                .from("workouts")
                .select(`
                    steps:step_count.sum()
                `)
                .gte("date", start.toISOString())
                .lt("date", end.toISOString())
                .maybeSingle();

            if (stepError) {
                console.error("Error fetching today's steps:", stepError);
                return;
            }

            const { data: aggregateData, error: aggregateError } = await supabase
            .from("nutrition_stats")
            .select(`
                calories:calories.sum(),
                water:water.sum(),
                protein:protein.sum(),
                carbs:carbs.sum(),
                fat:fat.sum()
                `)
            .gte("date", start.toISOString())
            .lt("date", end.toISOString())
            .maybeSingle();

            if (aggregateError) {
                console.error("Error featching today's nutrition:", aggregateError);
                return;
            }

            let weightData = null;
            let weightDate = null;
            let isPreviousWeight = false;

            // First: try to get today's latest weight
            const { data: todayWeight, error: todayWeightError } = await supabase
                .from("nutrition_stats")
                .select("weight, date")
                .gte("date", start.toISOString())
                .lt("date", end.toISOString())
                .not("weight", "is", null)
                .order("date", { ascending: false })
                .limit(1)
                .maybeSingle();

            if (todayWeightError) {
                console.error("Error fetching today's weight:", todayWeightError);
                return;
            }

            if (todayWeight) {
                weightData = todayWeight.weight;
                weightDate = todayWeight.date;
            } else {
                // No weight today → get most recent recorded weight
                const { data: previousWeight, error: previousWeightError } = await supabase
                    .from("nutrition_stats")
                    .select("weight, date")
                    .not("weight", "is", null)
                    .order("date", { ascending: false })
                    .limit(1)
                    .maybeSingle();

                if (previousWeightError) {
                    console.error(
                        "Error fetching most recent weight:",
                        previousWeightError
                    );
                    return;
                }

                if (previousWeight) {
                    weightData = previousWeight.weight;
                    weightDate = previousWeight.date;
                    isPreviousWeight = true;
                }
            }

            setTodayStats({
                calories: aggregateData?.calories ?? 0,
                weight: weightData,
                weightDate: weightDate,
                isPreviousWeight: isPreviousWeight,

                steps: stepData?.steps ?? 0,

                water: aggregateData?.water ?? 0,
                protein: aggregateData?.protein ?? 0,
                carbs: aggregateData?.carbs ?? 0,
                fat: aggregateData?.fat ?? 0
            });
        };

        getTodayStats();
        }, [])

    // Obtain Nutrition Goals
    // Calorie, Protein, Carb, Fat, Weight, Step, Water Goals
    useEffect(() => {
        const getGoals = async () => {
            const user = auth.currentUser;

            if (!user) {
                return;
            }

            const { data, error } = await supabase
            .from("nutrition_goals")
            .select(`
                calorie_goal,
                protein_goal,
                carbs_goal,
                fat_goal,
                weight_goal,
                step_goal,
                water_goal
                `)
            .eq("user_id", user.uid)
            .maybeSingle();

            if (error) {
                console.error("Error fetching nutrition goals:", error);
                return;
            }

            setNutritionGoals(data);
        };

        getGoals();
        }, [])

    // Set Workout State
    const [workoutSummary, setWorkoutSummary] = useState(null);
    const [favouriteExercise, setFavouriteExercise] = useState(null);
    const [workoutHistory, setWorkoutHistory] = useState([]);

    // Obtain Workout Information
    // workoutAllTime: Aggregation of ALl Workouts
    // favouriteExercise: Frequency of favourite kind of exercise for that particular user
    // workoutHistory: Each workout history is displayed using a forEach (not implemented yet) 
    useEffect(() => {

        const workoutAllTime = async () => {

            const { data, error } = await supabase
            .from("workouts")
            .select(`
                totalWorkouts:id.count(),
                totalMinutes:duration.sum(),
                averageDuration:duration.avg(),
                caloriesBurned:calories.sum()
                `)
            .maybeSingle();

            if (error) {
                console.error("Error fetching workout summary:", error);
                return;
            }

            setWorkoutSummary({
                totalWorkouts: data?.totalWorkouts ?? 0,
                totalMinutes: data?.totalMinutes ?? 0,
                averageDuration: Math.round((data?.averageDuration ?? 0) * 10) / 10,
                caloriesBurned: data?.caloriesBurned ?? 0
            });
        };

        const getFavouriteExercise = async () => {
            const { data, error } = await supabase
                .from("workouts")
                .select(`
                    exercise_type,
                    count:id.count()
                `)
                .not("exercise_type", "is", null);

            if (error) {
                console.error("Error fetching favourite exercise:", error);
                return;
            }

            // No workouts yet
            if (!data || data.length === 0) {
                setFavouriteExercise(null);
                return;
            }

            // Find the highest frequency
            const maxCount = Math.max(
                ...data.map((exercise) => exercise.count)
            );

            // Get all exercises tied for highest frequency,
            // but display at most 3
            const favourites = data
                .filter((exercise) => exercise.count === maxCount)
                .map((exercise) => exercise.exercise_type)
                .filter(Boolean)
                .slice(0, 3);

            let displayValue = null;

            if (favourites.length === 1) {
                displayValue = toTitleCase(favourites[0]);
            } else if (favourites.length === 2) {
                displayValue = `${toTitleCase(favourites[0])} and ${toTitleCase(favourites[1])}`;
            } else if (favourites.length === 3) {
                displayValue =
                    `${toTitleCase(favourites[0])}, ${toTitleCase(favourites[1])} and ${toTitleCase(favourites[2])}`;
            }

            setFavouriteExercise(displayValue);
        }

        const getWorkoutHistory = async () => {
            const { data, error } = await supabase
            .from("workouts")
            .select(`
                id,
                exercise:exercise_type,
                date,
                duration,
                calories
                `)
            .order("date", { ascending: false })
            .limit(5);
            
            if (error) {
                console.error("Error fetching workout history:", error);
                return;
            }

            const formattedData = (data ?? []).map((workout) => ({
                ...workout,

                exercise: toTitleCase(workout.exercise),

                date: new Date(workout.date).toLocaleDateString("en-GB", {
                    day: "numeric",
                    month: "short",
                    year: "numeric"
                })
            }));

            setWorkoutHistory(formattedData);
        };

        workoutAllTime();
        getFavouriteExercise();
        getWorkoutHistory();
        }, [])

    // Weight State Info
    const [weightHistory, setWeightHistory] = useState([]);

    // Get Weight Info
    useEffect(() => {
        const getWeightHistory = async () => {
            const now = new Date();

            // get 30 calendar days ago date
            const start = new Date(
                now.getFullYear(),
                now.getMonth(),
                now.getDate() - 29
            )

            // get tomorrow's date
            const end = new Date(
                now.getFullYear(),
                now.getMonth(),
                now.getDate() + 1
            );

            // altogether, past 30 day weight info
            const { data, error } = await supabase
                .from("nutrition_stats")
                .select(`
                    date,
                    weight
                `)
                .gte("date", start.toISOString())
                .lt("date", end.toISOString())
                .not("weight", "is", null)
                .order("date", { ascending: true });
            
            if (error) {
                console.error("Error fetching weight history:", error);
                return;
            }

            const latestByDay = {};

            // get the lastest weight for each day
            data.forEach((record) => {
                const recordDate = new Date(record.date);

                const dateKey = recordDate.toLocaleDateString("en-CA");

                latestByDay[dateKey] = {
                    date: recordDate.toLocaleDateString("en-GB", {
                        day: "numeric",
                        month: "short"
                    }),
                    weight: record.weight
                };
            });

            const formattedHistory = Object.values(latestByDay);
            setWeightHistory(formattedHistory);
        }

        getWeightHistory();
    }, [])

    // Workout Trend Cards
    const [workoutTrend, setWorkoutTrend] = useState([]);

    useEffect(() => {
        const getWorkoutTrend = async () => {
            const now = new Date();

            const startOfMonth = new Date(
                now.getFullYear(),
                now.getMonth(),
                1
            );

            const startOfNextMonth = new Date(
                now.getFullYear(),
                now.getMonth() + 1,
                1
            );

            const { data, error } = await supabase
                .from("workouts")
                .select(`
                    date,
                    duration
                `)
                .gte("date", startOfMonth.toISOString())
                .lt("date", startOfNextMonth.toISOString())
                .order("date", { ascending: true });
            
            if (error) {
                console.error("Error fetching workout trend:", error);
                return;
            }

            const daysInMonth = new Date(
                now.getFullYear(),
                now.getMonth() + 1,
                0
            ).getDate();

            const numberOfWeeks = Math.ceil(daysInMonth / 7);

            const weeklyTotals = {};
            
            for (let week = 1; week <= numberOfWeeks; week++) {
                weeklyTotals[`Week ${week}`] = 0;
            }

            data.forEach((workout) => {
                const workoutDate = new Date(workout.date);

                const dayOfMonth = workoutDate.getDate();

                const weekNumber = Math.ceil(dayOfMonth / 7);

                const weekKey = `Week ${weekNumber}`;

                weeklyTotals[weekKey] = 
                    (weeklyTotals[weekKey] ?? 0) +
                    workout.duration;
            });

            const formattedTrend = Object.entries(weeklyTotals)
                .map(([week, minutes]) => ({
                    week,
                    minutes
                }));
            
            setWorkoutTrend(formattedTrend);
        };

        getWorkoutTrend();
    }, [])

    const weightCaption =
        todayStats?.isPreviousWeight && todayStats?.weightDate
            ? `Last recorded on ${new Date(
                todayStats.weightDate
            ).toLocaleDateString("en-GB", {
                day: "numeric",
                month: "short",
                year: "numeric"
            })}`
            : null;

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
                            events = {calendarEvents}
                            datesSet = {(info) => {
                                getCalendarWorkouts(info.start, info.end);
                            }}
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
                                current={todayStats?.calories ?? 0}
                                goal={nutritionGoals?.calorie_goal ?? 0}
                                unit=" kcal"
                            />

                            <SummaryCard
                                icon="⚖️"
                                title="Weight"
                                current={todayStats?.weight ?? "-"}
                                goal={nutritionGoals?.weight_goal ?? 0}
                                unit=" kg"
                                caption={weightCaption}
                            />

                            <SummaryCard
                                icon="👟"
                                title="Steps"
                                current={todayStats?.steps ?? 0}
                                goal={nutritionGoals?.step_goal ?? 0}
                                unit=""
                            />

                            <SummaryCard
                                icon="🥩"
                                title="Protein"
                                current={todayStats?.protein ?? 0}
                                goal={nutritionGoals?.protein_goal ?? 0}
                                unit=" g"
                            />

                            <SummaryCard
                                icon="💧"
                                title="Water"
                                current={todayStats?.water ?? 0}
                                goal={nutritionGoals?.water_goal ?? 0}
                                unit=" L"
                            />
                        </div>

                        <WeightChart data={weightHistory} />

                        <div className="nutritionSection">

                            <h2> Today's Nutrition Overview</h2>
                            
                            <NutritionCard
                                title="Calories"
                                current={todayStats?.calories ?? 0}
                                goal={nutritionGoals?.calorie_goal ?? 0}
                                unit="kcal"
                            />

                            <NutritionCard
                                title="Protein"
                                current={todayStats?.protein ?? 0}
                                goal={nutritionGoals?.protein_goal ?? 0}
                                unit="g"
                            />

                            <NutritionCard
                                title="Carbohydrates"
                                current={todayStats?.carbs ?? 0}
                                goal={nutritionGoals?.carbs_goal ?? 0}
                                unit="g"
                            />

                            <NutritionCard
                                title="Fat"
                                current={todayStats?.fat ?? 0}
                                goal={nutritionGoals?.fat_goal ?? 0}
                                unit="g"
                            />

                        </div>

                        <div className="metricGrid">

                            <MetricCard
                                icon="🏋️"
                                title="Workouts"
                                value={workoutSummary?.totalWorkouts ?? 0}
                            />

                            <MetricCard
                                icon="⚖️"
                                title="Minutes"
                                value={workoutSummary?.totalMinutes ?? 0}
                                unit="min"
                            />

                            <MetricCard
                                icon="⏱"
                                title="Average Workout Duration"
                                value={workoutSummary?.averageDuration ?? 0}
                                unit="min"
                            />

                            <MetricCard
                                icon="🔥"
                                title="Calories Burned"
                                value={workoutSummary?.caloriesBurned ?? 0}
                                unit="kcal"
                            />

                            <MetricCard
                                icon="🏃"
                                title="Favourite Exercise"
                                value={favouriteExercise ?? "—"}
                            />

                        </div>

                        <WorkoutCarousel
                            workouts={workoutHistory}
                        />

                        <WorkoutChart
                            data = {workoutTrend}
                        />    
                        
                    </div>
                )}
            </div>
        </div>
    )
}
export default Dashboard;