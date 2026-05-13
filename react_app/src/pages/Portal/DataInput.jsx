import React , { useState, useEffect } from "react";
import './DataInput.css';

// Main Data Input Component 
const DataInput = () => {

    const [activeTab, setActiveTab] = useState("exercise");

    const [duration, setDuration] = useState("");
    const [stepCount, setStepCount] = useState("");

    const [calorieCount, setCalorieCount] = useState("");
    const [mealType, setMealType] = useState("Breakfast");
    const [exerciseType, setExerciseType] = useState("Outdoor Run");

    const saveExercise = () => {
        const data = {
            type: exerciseType,
            duration,
            stepCount: stepCount || null,
        };
        console.log("Exercise saved:", data); // Need to replace with api save
    };
    const saveFood = () => {
        const data = {
            meal: mealType,
            calories: calorieCount,
        };

        console.log("Food saved:", data); // Need to replace with api save
    };
    
    const EXERCISE_TYPES = [
        { label: "Outdoor Run", value: "OUTDOOR_RUN" },
        { label: "Indoor Run", value: "INDOOR_RUN" },
        { label: "Walk", value: "WALK" },
        { label: "Cycling", value: "CYCLING" }
    ];

    return(
        <div className="DataInputPage">
            <div className="DataInputContent">
                <div className = "loggerContainer">
                    <div className="tabSelection">
                        <button className={activeTab === "exercise" ? "activeTab" : "tabBtn"}
                        onClick={() => setActiveTab("exercise")}>
                            Exercise
                        </button>

                        <button className={activeTab === "food" ? "activeTab" : "tabBtn"}
                        onClick={() => setActiveTab("food")}
                        >
                        Food
                        </button>
                    </div>

                    <div className="loggerCard">
                        {activeTab === "exercise" && (
                            <div className="FormFill">
                                
                                <div className="formRow">
                                <label>Exercise Type</label>
                                <select value={exerciseType} onChange={(e) => setExerciseType(e.target.value)}>
                                    {EXERCISE_TYPES.map((t) => (
                                        <option key={t.value} value={t.value}>
                                            {t.label}
                                        </option>
                                    ))}
                                </select>
                                </div>
                                
                                <div className="formRow">
                                <label>Duration</label>
                                <input
                                    type="number"
                                    placeholder="Minutes"
                                    value={duration}
                                    onChange={(e) => setDuration(e.target.value)}
                                    />
                                </div>

                                <div className="formRow">
                                    <label>Step Count</label>

                                    <input
                                        type = "number"
                                        placeholder="Optional"
                                        value={stepCount}
                                        onChange={(e) => setStepCount(e.target.value)}
                                    />
                                </div>

                                <button className="SaveBtn"
                                    onClick={saveExercise}>
                                    Save
                                </button>
                            </div>
                        )}

                        {activeTab === "food" && (
                            <div className="foodForm">
                                
                                <div className="formRow">
                                    <label>Meal</label>
                                    <select value={mealType} onChange={(e) => setMealType(e.target.value)}>
                                        <option value= "Breakfast">Breakfast</option>
                                        <option value= "Lunch">Lunch</option>
                                        <option value= "Dinner">Dinner</option>
                                    </select>
                                </div>

                                <div className="formRow">
                                    <label>Kcal Consumed</label>
                                    <input
                                        type = "number"
                                        placeholder="Obtain from MyFitnessPal"
                                        value={calorieCount}
                                        onChange={(e) => setCalorieCount(e.target.value)}
                                    />
                                </div>

                                <button className="SaveBtn"
                                    onClick={saveFood}>
                                    Save
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default DataInput;