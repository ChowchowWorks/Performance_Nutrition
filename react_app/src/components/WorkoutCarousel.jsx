import "./WorkoutCarousel.css";
import WorkoutCard from "./WorkoutCard";

function WorkoutCarousel({ workouts }) {

    return (

        <div className="workoutSection">

            <h2>Workout History</h2>

            <div className="workoutCarousel">

                {workouts.map((workout) => (

                    <WorkoutCard
                        key={workout.id}
                        exercise={workout.exercise}
                        date={workout.date}
                        duration={workout.duration}
                        calories={workout.calories}
                    />

                ))}

            </div>

        </div>

    );

}

export default WorkoutCarousel;