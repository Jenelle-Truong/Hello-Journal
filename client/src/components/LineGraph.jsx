import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip } from "recharts";

const LineGraph = () => {
    const user = useSelector((state) => state.user);
    const token = useSelector((state) => state.token);
    const [data, setData] = useState(undefined);

    useEffect(() => {
        fetch( 
            `${process.env.REACT_APP_API_URL}/api/analytics/${user._id}`,
            {
                method: "GET",
                headers: { Authorization: `Bearer ${token}` }
            })
        .then((res) => res.json())
        .then((res) => {
            res.sort((a, b) => {
                console.log(`${a.date} - ${b.date} =  ${new Date(a.date) - new Date(b.date)}`)
                return new Date(a.date) - new Date(b.date)});
            setData(res);
        })
        .catch((err) => console.log(err))
    }, []);

    return (
        <ResponsiveContainer width="100%" height={800}>
            <LineChart 
                width={500}
                height={300}
                data={data}
                margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5
                }}
                options = {{
                    scales: {
                        y: {
                            min: 1,
                            max: 5, 
                            step: 1 
                        }
                    }
                }}
            > 
                <XAxis dataKey="date" type="category" tick={{fontSize: 13, fill: "#82ca9d"}} tickFormatter={(date) => {
                        return new Date(date).toLocaleDateString("en-us", {month: "2-digit", day: "2-digit"})
                    }}/>
                <YAxis domain={[1, 5]}/>
                <Tooltip />
                <Line type="monotone" dataKey="rank" stroke="#82ca9d" activeDot={{ r: 8 }} />
            </LineChart>
        </ResponsiveContainer>
    )
}

export default LineGraph;