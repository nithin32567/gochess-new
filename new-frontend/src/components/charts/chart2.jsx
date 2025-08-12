import { Chart, registerables } from "chart.js";
import { useEffect, useRef } from "react";

Chart.register(...registerables);

export default function Chart2() {
 const chartRef = useRef(null);
 useEffect(() => {
  if (chartRef.current) {
   chartRef.current.destroy();
  }
  const ctx3 = document.getElementById("chart3").getContext('2d');
  chartRef.current = new Chart(ctx3, {
   type: 'doughnut',
   data: {
    labels: ["rice", "yam", "tomato", "potato", "beans",
     "maize", "oil"
    ],
    datasets: [{
     label: 'food Items',
     data: [30, 40, 20, 50, 80, 90, 20],
     backgroundColor: ["#0074D9", "#FF4136", "#2ECC40",
      "#FF851B", "#7FDBFF", "#B10DC9", "#FFDC00",
      "#001f3f", "#39CCCC", "#01FF70", "#85144b",
      "#F012BE", "#3D9970", "#111111", "#AAAAAA"
     ]
    }]
   },
   options: {
    responsive: true,
    maintainAspectRatio: false, // Allows full use of height
   }
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
     <canvas id="chart3" />
    </div>
   </div>
  </div>
 );
}