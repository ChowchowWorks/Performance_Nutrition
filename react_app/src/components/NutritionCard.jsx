import "./NutritionCard.css";

function NutritionCard({ title, current, goal, unit }) {

    const percentage = Math.min((current / goal) * 100, 100);

    return (
        <div className="nutritionCard">

            <div className="nutritionHeader">
                <h3>{title}</h3>

                <span>
                    {current} / {goal} {unit}
                </span>
            </div>

            <div className="nutritionBar">

                <div
                    className="nutritionFill"
                    style={{ width: `${percentage}%` }}
                />

            </div>

        </div>
    );
}

export default NutritionCard;