import SummaryCards from '../components/Dashboard/SummaryCards';
import BalanceTrendChart from '../components/Dashboard/BalanceTrendChart';
import SpendingBreakdownChart from '../components/Dashboard/SpendingBreakdownChart';
import InsightsPanel from '../components/Dashboard/InsightsPanel';
import FinanceLottie from '../components/Animations/FinanceLottie';

const DASHBOARD_LOTTIE_SRC =
  'https://lottie.host/0cd47589-d79f-4ddc-883a-1147896e21c5/IwyFru234j.lottie';

const Dashboard = () => {
  return (
    <div className="space-y-5 md:space-y-8">
      {/* Page Header */}
      <div>
        <div className="flex items-center gap-2 md:gap-3">
          <h1 className="text-xl md:text-3xl font-bold text-slate-800 dark:text-white tracking-tight">
            Hyy Sakshi !
          </h1>
          <div className="h-10 w-10 md:h-14 md:w-14 animate-fade-in">
            <FinanceLottie
              src={DASHBOARD_LOTTIE_SRC}
              className="h-full w-full"
              speed={1.1}
            />
          </div>
        </div>
        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 md:text-sm">
          Welcome back! Here's your financial overview.
        </p>
      </div>

      {/* Summary Cards */}
      <SummaryCards />

      {/* Charts Row */}
      <div className="dashboard-chart-mobile-grid grid grid-cols-1 gap-3 md:grid-cols-2 md:gap-5">
        <BalanceTrendChart />
        <SpendingBreakdownChart />
      </div>

      {/* Insights */}
      <InsightsPanel />
    </div>
  );
};

export default Dashboard;
