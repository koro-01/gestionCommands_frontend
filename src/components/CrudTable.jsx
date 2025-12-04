export default function CrudTable({ data, onEdit, onDelete }) {
  if (!data.length) return <p>No data found.</p>;

  const headers = Object.keys(data[0]);

  return (
    <table border="1" cellPadding="6">
      <thead>
        <tr>
          {headers.map((h) => (
            <th key={h}>{h}</th>
          ))}
          <th>Actions</th>
        </tr>
      </thead>

      <tbody>
        {data.map((row) => (
          <tr key={row.id}>
            {headers.map((h) => (
              <td key={h}>{row[h]}</td>
            ))}
            <td>
              <button onClick={() => onEdit(row)}>Edit</button>
              <button onClick={() => onDelete(row.id)}>Delete</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
