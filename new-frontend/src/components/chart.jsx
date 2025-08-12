import Chart1 from "./charts/chart1";
import Chart2 from "./charts/chart2";
import Chart3 from "./charts/chart3";

export default function ChartSlide() {
 return (
  <section className="graph-wrapper">
   <div className="container-fluid">
    <div className="row">
     <Chart1 />
     <Chart2 />
     <Chart3 />
    </div>
   </div>
  </section>
 );
}