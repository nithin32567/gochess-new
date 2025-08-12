import { Chart, registerables } from "chart.js";
import { useEffect, useRef } from "react";

Chart.register(...registerables);

export default function Chart1() {
 const chartRef = useRef(null);
 useEffect(() => {
  if (chartRef.current) {
   chartRef.current.destroy();
  }
  const ctx = document.getElementById("chart1").getContext('2d');
  chartRef.current = new Chart(ctx, {
   type: 'line',
   data: {
    labels: ["Sunday", "Monday", "Tuesday",
     "Wednesday", "Thursday", "Friday", "Saturday"
    ],
    datasets: [{
     label: 'Last week',
     backgroundColor: 'rgba(161, 198, 247, 1)',
     borderColor: 'rgb(47, 128, 237)',
     data: [3000, 4000, 2000, 5000, 8000, 9000, 2000],
    }]
   },
   options: {
    scales: {
     y: {
      beginAtZero: true,
      ticks: {
      }
     }
    }
   },
  });
  return () => {
   if (chartRef.current) {
    chartRef.current.destroy();
   }
  }
 }, []);
 return (
  <div className="col-xl-4 col-lg-4 col-md-6 col-sm-6">
   <div className="graph-container-div">
    <h4>Heading Goes Here</h4>
    <div className="card chart-container">
     <canvas id="chart1" />
    </div>
   </div>
  </div>
 );
}