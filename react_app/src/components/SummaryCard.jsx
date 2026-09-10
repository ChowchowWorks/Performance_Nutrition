import "./SummaryCard.css";

function SummaryCard({ icon, title, current, goal, unit, caption }) {

    const percentage = Math.min((current / goal) * 100, 100);

    return (
        <div className="summaryCard">

            <div className="summaryHeader">
                <span>{icon}</span>
                <h3>{title}</h3>
            </div>

            <h2>
                {current}
                {unit}
            </h2>

            {caption && (
                <p className="summaryCaption">
                    {caption}
                </p>
            )}

            <p>
                Goal: {goal}
                {unit}
            </p>

            <div className="progressBar">
                <div
                    className="progressFill"
                    style={{ width: `${percentage}%` }}
                />
            </div>

        </div>
    );
}

export default SummaryCard;