import "./WorkoutChart.css";

import {
    ResponsiveContainer,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
} from "recharts";

function WorkoutChart({ data }) {
    return (
        <div className="chartCard">

            <h2>Workout Trend</h2>

            <ResponsiveContainer width="100%" height={300}>

                <BarChart data={data}>

                    <CartesianGrid strokeDasharray="3 3" />

                    <XAxis dataKey="week" />

                    <YAxis />

                    <Tooltip />

                    <Bar
                        dataKey="minutes"
                        fill="#047857"
                        radius={[8, 8, 0, 0]}
                    />

                </BarChart>

            </ResponsiveContainer>

        </div>
    );
}

export default WorkoutChart;