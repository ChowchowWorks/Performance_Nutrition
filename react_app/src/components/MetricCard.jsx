import "./MetricCard.css";

function MetricCard({ icon, title, value, unit = "", subtitle = "" }) {
    return (
        <div className="metricCard">

            <div className="metricHeader">
                <span className="metricIcon">{icon}</span>
                <h3>{title}</h3>
            </div>

            <div className="metricValue">
                {value}
                <span className="metricUnit">{unit}</span>
            </div>

            {subtitle && (
                <p className="metricSubtitle">
                    {subtitle}
                </p>
            )}

        </div>
    );
}

export default MetricCard;