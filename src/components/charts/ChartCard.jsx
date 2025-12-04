import "../../styles/components/chart-card.css"

"use client"

import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from "recharts"

export default function ChartCard({ title, data = [], type = "bar", dataKey = "", colors = [] }) {
  if (!data || data.length === 0) return <div className="chart-card"><p>No data</p></div>

  // Fallback colors if none provided
  const defaultColors = [
    "#8884d8", "#82ca9d", "#ffc658", "#ff8042", "#8dd1e1",
    "#a4de6c", "#d0ed57", "#ffc0cb", "#d88884", "#8458d8"
  ]

  return (
    <div className="chart-card">
      <h3>{title}</h3>
      <ResponsiveContainer width="100%" height={300}>
        {type === "bar" ? (
          <BarChart data={data}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey={dataKey}>
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color || colors[index % colors.length] || defaultColors[index % defaultColors.length]} />
              ))}
            </Bar>
          </BarChart>
        ) : (
          <PieChart>
            <Pie data={data} dataKey={dataKey} nameKey="name" outerRadius={100} label>
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color || colors[index % colors.length] || defaultColors[index % defaultColors.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        )}
      </ResponsiveContainer>
    </div>
  )
}
