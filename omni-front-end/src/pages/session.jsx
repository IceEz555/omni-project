import { useNavigate } from "react-router-dom";
import "../css/session.css";

export const Sessions = () => { // Removed setPage prop
  const navigate = useNavigate();

  return (
    <table>
      <thead>
        <tr><th>Date</th><th>Duration</th><th>Summary</th><th>Action</th></tr>
      </thead>
      <tbody>
        {[1, 2, 3].map((i) => (
          <tr key={i}>
            <td>July {i + 10}, 2021</td>
            <td>20 min</td>
            <td>Tree Pose (60%)</td>
            <td><button onClick={() => navigate(`/sessions/${i}`)}>View</button></td>
          </tr>
        ))}
      </tbody>
    </table>
  )
};


