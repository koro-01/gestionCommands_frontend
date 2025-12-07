import "../../styles/components/chart-card.css"
"use client"

import { 
  BarChart, Bar, LineChart, Line, AreaChart, Area, ComposedChart, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell 
} from "recharts"

export default function ChartCard({ title, data = [], type = "bar", dataKey = "", colors = [] }) {
  if (!data || data.length === 0) return <div className="chart-card"><p>No data</p></div>

  const defaultColors = [
    "#6366F1", "#10B981", "#3B82F6", "#F97316", "#D946EF",
    "#F59E0B", "#8B5CF6", "#14B8A6", "#F43F5E", "#EAB308"
  ]

  return (
    <div className="chart-card">
      <h3>{title}</h3>
      <ResponsiveContainer width="100%" height={300}>
        {type === "bar" && (
          <BarChart data={data}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip  labelStyle={{ color: "#1f2937" }} />
            <Legend />
            <Bar dataKey={dataKey}>
              {data.map((entry, index) => (
                <Cell key={index} fill={entry.color || colors[index % colors.length] || defaultColors[index % defaultColors.length]} />
              ))}
            </Bar>
          </BarChart>
        )}

        {type === "line" && (
          <LineChart data={data}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip   labelStyle={{ color: "#1f2937" }}    />
            <Legend />
            <Line type="monotone" dataKey={dataKey} stroke={colors[0] || defaultColors[0]} strokeWidth={3} />
          </LineChart>
        )}

        {type === "area" && (
          <AreaChart data={data}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip  labelStyle={{ color: "#1f2937" }} />
            <Legend />
            <Area type="monotone" dataKey={dataKey} stroke={colors[0] || defaultColors[0]} fill={colors[0] || defaultColors[0]} />
          </AreaChart>
        )}

        {type === "composed" && (
          <ComposedChart data={data}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip  labelStyle={{ color: "#1f2937" }} />
            <Legend />
            <Bar dataKey={dataKey} fill={colors[0] || defaultColors[0]} />
            <Line type="monotone" dataKey={dataKey} stroke={colors[1] || defaultColors[1]} strokeWidth={2} />
          </ComposedChart>
        )}

        {type === "pie" && (
          <PieChart>
            <Pie data={data} dataKey={dataKey} nameKey="name" outerRadius={100} label>
              {data.map((entry, index) => (
                <Cell key={index} fill={entry.color || colors[index % colors.length] || defaultColors[index % defaultColors.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        )}
      </ResponsiveContainer>
    </div>
  )
}
