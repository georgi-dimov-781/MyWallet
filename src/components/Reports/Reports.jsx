
import { useState, useEffect } from 'react';
import { getCategorySpendingReport, getUserTransactions } from '../../services/DataService';
import { Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title
} from 'chart.js';

// Register ChartJS components
ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title
);

const Reports = ({ user }) => {
  const [spendingReport, setSpendingReport] = useState([]);
  const [totalSpent, setTotalSpent] = useState(0);
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: []
  });

  useEffect(() => {
    if (user) {
      // Get spending report data
      const report = getCategorySpendingReport(user.id);
      const filteredReport = report.filter(item => item.totalSpent > 0);
      setSpendingReport(filteredReport);
      
      // Calculate total spent
      const total = filteredReport.reduce((sum, item) => sum + item.totalSpent, 0);
      setTotalSpent(total);
      
      // Prepare chart data
      const labels = filteredReport.map(item => item.categoryName);
      const data = filteredReport.map(item => item.totalSpent);
      
      // Generate colors
      const colors = generateColors(filteredReport.length);
      
      setChartData({
        labels,
        datasets: [
          {
            label: 'Spending by Category',
            data,
            backgroundColor: colors,
            borderColor: colors.map(color => color.replace('0.6', '1')),
            borderWidth: 1
          }
        ]
      });
    }
  }, [user]);

  // Function to generate random colors
  const generateColors = (count) => {
    const colors = [];
    for (let i = 0; i < count; i++) {
      const hue = (i * 137) % 360; // Use golden angle to distribute colors evenly
      colors.push(`hsla(${hue}, 70%, 60%, 0.6)`);
    }
    return colors;
  };

  return (
    <div className="container">
      <h1>Spending Reports</h1>
      
      <div className="card">
        <h2>Spending by Category</h2>
        
        {totalSpent > 0 ? (
          <>
            <div style={{ display: 'flex', gap: '20px' }}>
              <div style={{ flex: '1' }}>
                <div style={{ height: '300px', position: 'relative' }}>
                  <Pie 
                    data={chartData}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: {
                        legend: {
                          position: 'right'
                        }
                      }
                    }}
                  />
                </div>
              </div>
              
              <div style={{ flex: '1' }}>
                <h3>Summary</h3>
                <div>
                  <p><strong>Total Spent:</strong> ${totalSpent.toFixed(2)}</p>
                  <table style={{ marginTop: '10px' }}>
                    <thead>
                      <tr>
                        <th>Category</th>
                        <th>Amount</th>
                        <th>Percentage</th>
                      </tr>
                    </thead>
                    <tbody>
                      {spendingReport.map(item => (
                        <tr key={item.categoryId}>
                          <td>{item.categoryName}</td>
                          <td>${item.totalSpent.toFixed(2)}</td>
                          <td>{((item.totalSpent / totalSpent) * 100).toFixed(1)}%</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </>
        ) : (
          <p>No spending data available. Make some purchases to see your spending report.</p>
        )}
      </div>
    </div>
  );
};

export default Reports;
