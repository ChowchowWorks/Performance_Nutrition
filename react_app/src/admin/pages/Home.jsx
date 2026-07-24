import { useMemo, useState } from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import MetricCard from '../../components/MetricCard';
import '../admin.css';
import './Home.css';

const businessKpis = [
  {
    icon: '💰',
    title: 'Monthly Revenue',
    value: '$48.2k',
    subtitle: '+12.4% vs last month',
  },
  {
    icon: '🧍',
    title: 'Active Members',
    value: '1,284',
    subtitle: '73 new this week',
  },
  {
    icon: '📈',
    title: 'Conversion Rate',
    value: '18.6%',
    subtitle: 'Trial to paid',
  },
  {
    icon: '📅',
    title: 'Bookings Today',
    value: '42',
    subtitle: '11 pending approvals',
  },
];

const statusCards = [
  {
    label: 'New Leads',
    value: 96,
    note: 'Captured from landing pages and referrals',
  },
  {
    label: 'Retention',
    value: '92%',
    note: 'Members retained over the last 90 days',
  },
  {
    label: 'Avg. Session',
    value: '31 min',
    note: 'Average coaching engagement time',
  },
  {
    label: 'Open Tickets',
    value: 7,
    note: 'Support and admin items awaiting review',
  },
];

const revenueRangeOptions = [
  { value: 'last4weeks', label: 'Last 4 weeks' },
  { value: 'weektodate', label: 'Week to Date' },
  { value: 'yeartodate', label: 'Year to Date' },
];

const revenueSeriesByRange = {
  last4weeks: [34200, 38800, 42300, 48200],
  weektodate: [3200, 4100, 3750, 4900, 5300, 6200, 7100],
  yeartodate: [21800, 24700, 26100, 28900, 32200, 36100, 40200, 43800, 44900, 46300, 47600, 48200],
};

const getStartOfWeek = (date) => {
  const start = new Date(date);
  const day = start.getDay();
  const diff = day === 0 ? 6 : day - 1;
  start.setDate(start.getDate() - diff);
  return start;
};

const formatRevenueDateLabel = (date) => {
  return date.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
};

const formatMonthYearLabel = (date) => {
  return date.toLocaleDateString('en-GB', {
    month: 'short',
    year: 'numeric',
  });
};

const acquisitionTrend = [
  { channel: 'Instagram', signups: 28 },
  { channel: 'Google', signups: 34 },
  { channel: 'Referral', signups: 21 },
  { channel: 'Walk-in', signups: 13 },
];

const pipelineStages = [
  { stage: 'Lead', count: 124 },
  { stage: 'Trial', count: 86 },
  { stage: 'Member', count: 71 },
  { stage: 'Renewal', count: 54 },
];

const activityFeed = [
  { time: '09:30', event: 'New enterprise enquiry from Acme Group' },
  { time: '10:15', event: '12 membership renewals processed' },
  { time: '12:00', event: 'Staff roster updated for Friday' },
  { time: '15:45', event: 'Campaign performance review completed' },
];

export default function AdminHome() {
  const [revenueRange, setRevenueRange] = useState('last4weeks');

  const currentDate = useMemo(() => {
    return new Date().toLocaleDateString('en-GB', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  }, [revenueRange]);

  const revenueTrend = useMemo(() => {
    const today = new Date();

    if (revenueRange === 'weektodate') {
      const startOfWeek = getStartOfWeek(today);
      const totalDays = Math.max(1, Math.floor((today - startOfWeek) / (1000 * 60 * 60 * 24)) + 1);

      return Array.from({ length: totalDays }, (_, index) => {
        const trendDate = new Date(startOfWeek);
        trendDate.setDate(startOfWeek.getDate() + index);

        return {
          date: formatRevenueDateLabel(trendDate),
          revenue: revenueSeriesByRange.weektodate[index],
        };
      });
    }

    if (revenueRange === 'yeartodate') {
      const currentMonthIndex = today.getMonth();

      return Array.from({ length: currentMonthIndex + 1 }, (_, index) => {
        const trendDate = new Date(today.getFullYear(), index, 1);

        return {
          date: formatMonthYearLabel(trendDate),
          revenue: revenueSeriesByRange.yeartodate[index],
        };
      });
    }

    return revenueSeriesByRange.last4weeks.map((revenue, index) => {
      const trendDate = new Date(today);
      trendDate.setDate(today.getDate() - (3 - index) * 7);

      return {
        date: formatRevenueDateLabel(trendDate),
        revenue,
      };
    });
  }, []);

  return (
    <div className="adminHomePage">
      <div className="adminHeaderRow">
        <div>
          <p className="adminEyebrow">Admin Overview</p>
          <h1 className="adminTitle">Business Analytics Dashboard</h1>
          <p className="adminSubtitle">
            Monitor revenue, member growth, bookings, and operational health at a glance.
          </p>
        </div>

        <div className="adminDatePill">📆 {currentDate}</div>
      </div>

      <div className="adminHeroPanel">
        <div>
          <p className="heroLabel">This Month</p>
          <h2>$48.2k revenue, 1,284 active members</h2>
          <p>
            The figures below are dummy data for the admin mock-up and can later be
            replaced with Firestore or SQL-backed analytics.
          </p>
        </div>
        <div className="heroStats">
          <div>
            <span>Goal completion</span>
            <strong>81%</strong>
          </div>
          <div>
            <span>Trial bookings</span>
            <strong>214</strong>
          </div>
          <div>
            <span>Net growth</span>
            <strong>+9.8%</strong>
          </div>
        </div>
      </div>

      <section className="kpiGrid">
        {businessKpis.map((card) => (
          <MetricCard key={card.title} {...card} />
        ))}
      </section>

      <section className="analyticsGrid">
        <div className="chartPanel widePanel">
          <div className="panelHeader panelHeaderWithControl">
            <div>
              <p className="panelEyebrow">Portfolio Performance</p>
              <h2>Revenue Performance</h2>
              <p className="panelHint">
                Review revenue movement across selected periods using real date labels.
              </p>
            </div>

            <div className="panelControl">
              <label className="srOnly" htmlFor="revenue-range-select">
                Revenue range
              </label>
              <select
                id="revenue-range-select"
                className="rangeSelect"
                value={revenueRange}
                onChange={(e) => setRevenueRange(e.target.value)}
              >
                {revenueRangeOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="chartBody">
            <ResponsiveContainer width="100%" height={320}>
              <LineChart data={revenueTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="#eadfd4" />
                <XAxis dataKey="date" stroke="#6b7280" />
                <YAxis tickFormatter={(value) => `$${Math.round(value / 1000)}k`} stroke="#6b7280" />
                <Tooltip formatter={(value) => [`$${value.toLocaleString()}`, 'Revenue']} />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke="#d16323"
                  strokeWidth={3}
                  dot={{ r: 4 }}
                  activeDot={{ r: 7 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="chartPanel">
          <div className="panelHeader">
            <div>
              <p className="panelEyebrow">Acquisition</p>
              <h2>Lead source signups</h2>
            </div>
          </div>

          <div className="chartBody">
            <ResponsiveContainer width="100%" height={320}>
              <BarChart data={acquisitionTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="#eadfd4" />
                <XAxis dataKey="channel" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip />
                <Bar dataKey="signups" fill="#e2834b" radius={[10, 10, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </section>

      <section className="lowerGrid">
        <div className="chartPanel">
          <div className="panelHeader">
            <div>
              <p className="panelEyebrow">Pipeline Health</p>
              <h2>Member funnel</h2>
            </div>
          </div>

          <div className="funnelList">
            {pipelineStages.map((stage) => (
              <div className="funnelRow" key={stage.stage}>
                <div>
                  <strong>{stage.stage}</strong>
                  <span>Stage count</span>
                </div>
                <div className="funnelValue">{stage.count}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="chartPanel">
          <div className="panelHeader">
            <div>
              <p className="panelEyebrow">Operations</p>
              <h2>Live activity feed</h2>
            </div>
          </div>

          <div className="activityFeed">
            {activityFeed.map((item) => (
              <div className="activityItem" key={item.time}>
                <span className="activityTime">{item.time}</span>
                <p>{item.event}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="statusGrid">
        {statusCards.map((status) => (
          <div className="statusCard" key={status.label}>
            <p>{status.label}</p>
            <h3>{status.value}</h3>
            <span>{status.note}</span>
          </div>
        ))}
      </section>
    </div>
  );
}
