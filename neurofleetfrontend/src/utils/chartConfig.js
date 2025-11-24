import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';

// ✅ Register all components globally
ChartJS.register(
  CategoryScale,    // For x-axis labels
  LinearScale,      // For y-axis linear scale
  BarElement,       // For bar charts
  LineElement,      // For line charts
  PointElement,     // For line chart points
  ArcElement,       // For doughnut/pie charts (FIXES "arc" error)
  Title,
  Tooltip,
  Legend,
  Filler           // For area charts
);

// ✅ Default chart options
ChartJS.defaults.responsive = true;
ChartJS.defaults.maintainAspectRatio = false;

export default ChartJS;