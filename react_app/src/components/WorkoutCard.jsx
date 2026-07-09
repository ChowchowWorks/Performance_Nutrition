import "./WorkoutCard.css";

function WorkoutCard({ exercise, date, duration, calories }) {
    return (
        <div className="workoutCard">

            <h3 className="workoutTitle">{exercise}</h3>

            <div className="workoutInfo">
                <p><strong>Date:</strong> {date}</p>
                <p><strong>Duration:</strong> {duration} min</p>
                <p><strong>Calories:</strong> {calories} kcal</p>
            </div>

        </div>
    );
}

export default WorkoutCard;