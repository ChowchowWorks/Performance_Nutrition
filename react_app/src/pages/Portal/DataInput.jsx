import { useState, useEffect } from "react";
import './DataInput.css';
import { db, auth } from '../../firebase';
import { supabase } from '../../supabase';
import { collection, getDocs } from 'firebase/firestore';

// Main Data Input Component 
const DataInput = () => {

    const [activeTab, setActiveTab] = useState("exercise");

    const [duration, setDuration] = useState("");
    const [stepCount, setStepCount] = useState("");

    const [caloriesBurned, setCaloriesBurned] = useState("");

    const [calorieCount, setCalorieCount] = useState("");
    const [mealType, setMealType] = useState("Breakfast");

    const [carbs, setCarbs] = useState("");
    const [protein, setProtein] = useState("");
    const [fat, setFat] = useState("");
    const [water, setWater] = useState("");

    const [exerciseType, setExerciseType] = useState("");
    const [weight, setWeight] = useState("");
    const [weightError, setWeightError] = useState("");

    const saveExercise = async () => {
        const user = auth.currentUser;

        if (!user) {
            alert("You must be logged in to save an exercise.");
            return;
        }

        // Required fields
        if (
            !exerciseType ||
            duration === "" ||
            caloriesBurned === ""
        ) {
            alert(
                "Please enter the exercise type, duration and calories burned."
            );
            return;
        }

        const durationValue = Number(duration);
        const caloriesValue = Number(caloriesBurned);
        const stepsValue = stepCount === "" ? 0 : Number(stepCount);

        // Validate numeric values
        if (
            !Number.isFinite(durationValue) ||
            durationValue <= 0 ||
            !Number.isInteger(durationValue)
        ) {
            alert("Duration must be a positive whole number.");
            return;
        }

        if (
            !Number.isFinite(caloriesValue) ||
            caloriesValue < 0 ||
            !Number.isInteger(caloriesValue)
        ) {
            alert("Calories burned must be a non-negative whole number.");
            return;
        }

        if (
            !Number.isFinite(stepsValue) ||
            stepsValue < 0 ||
            !Number.isInteger(stepsValue)
        ) {
            alert("Step count must be a non-negative whole number.");
            return;
        }

        const { error } = await supabase
            .from("workouts")
            .insert({
                exercise_type: exerciseType,
                duration: durationValue,
                calories: caloriesValue,
                step_count: stepsValue,
                user_id: user.uid
            });

        if (error) {
            console.error("Error saving exercise:", error);
            alert("Unable to save exercise.");
            return;
        }

        alert("Exercise saved!");

        setDuration("");
        setCaloriesBurned("");
        setStepCount("");
    };

    const saveFood = async () => {
        const user = auth.currentUser;

        if (!user) {
            alert("You must be logged in to save food information.");
            return;
        }

        // At least one nutrition field must contain something
        const hasAnyValue =
            calorieCount !== "" ||
            carbs !== "" ||
            protein !== "" ||
            fat !== "" ||
            water !== "";

        if (!hasAnyValue) {
            alert("Please enter at least one nutrition value.");
            return;
        }

        const caloriesValue =
            calorieCount === "" ? 0 : Number(calorieCount);

        const carbsValue =
            carbs === "" ? 0 : Number(carbs);

        const proteinValue =
            protein === "" ? 0 : Number(protein);

        const fatValue =
            fat === "" ? 0 : Number(fat);

        const waterValue =
            water === "" ? 0 : Number(water);

        const values = [
            caloriesValue,
            carbsValue,
            proteinValue,
            fatValue,
            waterValue
        ];

        if (
            values.some(
                value =>
                    !Number.isFinite(value) ||
                    value < 0
            )
        ) {
            alert("Nutrition values must be valid non-negative numbers.");
            return;
        }

        const { error } = await supabase
            .from("nutrition_stats")
            .insert({
                user_id: user.uid,
                meal_type: mealType,

                calories: caloriesValue,
                carbs: carbsValue,
                protein: proteinValue,
                fat: fatValue,
                water: waterValue,

                // These aren't being logged by the Food tab
                steps: 0,

                // nutrition_stats.date has NO default
                date: new Date().toISOString()
            });

        if (error) {
            console.error("Error saving food:", error);
            alert("Unable to save nutrition information.");
            return;
        }

        alert("Nutrition information saved!");

        setCalorieCount("");
        setCarbs("");
        setProtein("");
        setFat("");
        setWater("");
        setMealType("Breakfast");
    };

    const saveWeight = async () => {
        setWeightError("");
        const user = auth.currentUser;

        if (!user) {
            setWeightError("You must be logged in to save your weight.");
            return;
        }

        if (weight === "") {
            setWeightError("Please enter your weight.");
            return;
        }

        const weightValue = Number(weight);

        if (
            !Number.isFinite(weightValue) ||
            weightValue <= 0
        ) {
            setWeightError("Please enter a valid weight.");
            return;
        }

        const { error } = await supabase
            .from("nutrition_stats")
            .insert({
                user_id: user.uid,
                weight: weightValue,
                calories: 0,
                steps: 0,
                water: 0,
                protein: 0,
                carbs: 0,
                fat: 0,
                date: new Date().toISOString()
            });

        if (error) {
            console.error("Error saving weight:", error);
            setWeightError(`Unable to save weight: ${error.message}`);
            return;
        }

        alert("Weight saved!");
        setWeight("");
    };

    const [exerciseTypes, setExerciseTypes] = useState([]);
    
    useEffect(() => {
        const getExerciseTypes = async () => {
        try {
            const coll = collection(db, "exercise-types");
            const collSnap = await getDocs(coll);

            const types = collSnap.docs.map(doc => doc.data().name);

            setExerciseTypes(types); 

            if (types.length > 0) {
                setExerciseType(types[0]);
            }
        } catch (error) {
            console.error("Error fetching exercise types:", error);
        }};

        getExerciseTypes();
    }, []);

    const currentDate = new Date().toLocaleDateString("en-GB", {
        year: "numeric",
        month: "long",
        day: "numeric",
        weekday: "long"
    });

    return(
        <div className="DataInputPage">
            <div className="DataInputContent">
                <div className = "explanationContainer">
                    <div className = "headerRow">
                        <h1 className = "pageName"> Data Logger </h1>
                        <h3> 📆 {currentDate} </h3>
                    </div>

                    <p> Input your information here! This page consists of three tabs: </p>
                    <ul>
                        <li> <b> Exercise Tab: </b> Record details about your exercise activities. </li>
                        <li> <b> Food Tab: </b> Record info about the food you consumed. You may refer to the <i>MyFitnessPal</i> app to obtain calorie information.</li>
                        <li> <b> Weight Tab: </b> Record your current body weight. </li>
                    </ul>

                </div>

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

                        <button className={activeTab === "weight" ? "activeTab" : "tabBtn"}
                        onClick={() => setActiveTab("weight")}
                        >
                        Weight
                        </button>
                    </div>

                    <div className="loggerCard">
                        {activeTab === "exercise" && (
                            <div className="FormFill">
                                
                                <div className="formRow">
                                <label>Exercise Type</label>
                                <select value={exerciseType} onChange={(e) => setExerciseType(e.target.value)}>
                                    {exerciseTypes.map((t) => (
                                        <option key={t} value={t}>
                                            {t}
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
                                    <label>Calories Burned</label>
                                    <input
                                        type="number"
                                        min="0"
                                        placeholder="kcal"
                                        value={caloriesBurned}
                                        onChange={(e) => setCaloriesBurned(e.target.value)}
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

                                <div className="formRow">
                                    <label>Carbohydrates</label>
                                    <input
                                        type="number"
                                        min="0"
                                        step="0.1"
                                        placeholder="grams"
                                        value={carbs}
                                        onChange={(e) => setCarbs(e.target.value)}
                                    />
                                </div>

                                <div className="formRow">
                                    <label>Protein</label>
                                    <input
                                        type="number"
                                        min="0"
                                        step="0.1"
                                        placeholder="grams"
                                        value={protein}
                                        onChange={(e) => setProtein(e.target.value)}
                                    />
                                </div>

                                <div className="formRow">
                                    <label>Fat</label>
                                    <input
                                        type="number"
                                        min="0"
                                        step="0.1"
                                        placeholder="grams"
                                        value={fat}
                                        onChange={(e) => setFat(e.target.value)}
                                    />
                                </div>

                                <div className="formRow">
                                    <label>Water</label>
                                    <input
                                        type="number"
                                        min="0"
                                        step="0.1"
                                        placeholder="litres"
                                        value={water}
                                        onChange={(e) => setWater(e.target.value)}
                                    />
                                </div>

                                <button className="SaveBtn"
                                    onClick={saveFood}>
                                    Save
                                </button>
                            </div>
                        )}

                        {activeTab === "weight" && (
                            <div className="weightForm">
                                <div className="formRow">
                                    <label htmlFor="weight">Current Weight</label>
                                    <input
                                        id="weight"
                                        type="number"
                                        min="0"
                                        step="0.1"
                                        placeholder="Enter weight in kg"
                                        value={weight}
                                        onChange={(e) => setWeight(e.target.value)}
                                    />
                                </div>

                                <button className="SaveBtn" onClick={saveWeight}>
                                    Save
                                </button>
                                {weightError && (
                                    <p className="weightError" role="alert">
                                        {weightError}
                                    </p>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default DataInput;