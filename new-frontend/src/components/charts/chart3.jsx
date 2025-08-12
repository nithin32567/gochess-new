import { Chart, registerables } from "chart.js";
import { useEffect, useRef } from "react";

Chart.register(...registerables);

export default function Chart3() {
 const chartRef = useRef(null);
 useEffect(() => {
  if (chartRef.current) {
   chartRef.current.destroy();
  }
  const ctx2 = document.getElementById("chart2").getContext('2d');
  chartRef.current = new Chart(ctx2, {
   type: 'bar',
   data: {
    labels: ["rice", "yam", "tomato", "potato",
     "beans", "maize", "oil"],
    datasets: [{
     label: 'food Items',
     backgroundColor: 'rgba(161, 198, 247, 1)',
     borderColor: 'rgb(47, 128, 237)',
     data: [300, 400, 200, 500, 800, 900, 200],
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
     <canvas id="chart2" />
    </div>
   </div>
  </div>
 );
}