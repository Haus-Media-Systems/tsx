import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';

const RoughCutOptimization = () => {
  // Baseline data
  const baseline = {
    deliverables: 12,
    roughCutHours: 4,
    feedbackHours: 2,
    qcHours: 1,
    totalHoursPerDeliverable: 7,
    totalHoursPerProject: 84
  };

  // Scenario data from provided structure, with focus on rough cut reduction
  const scenarios = [
    { 
      name: 'Conservative', 
      roughCutHours: 2, // 50% faster
      feedbackHours: 1.5,
      qcHours: 0.75,
      roughCutSaved: (baseline.roughCutHours - 2) * baseline.deliverables,
      timeSavedPerProject: 42,
      timeSaved4Projects: 168,
      workweeks: 4.2
    },
    { 
      name: 'Average', 
      roughCutHours: 1, // 75% faster
      feedbackHours: 1,
      qcHours: 0.5,
      roughCutSaved: (baseline.roughCutHours - 1) * baseline.deliverables,
      timeSavedPerProject: 63,
      timeSaved4Projects: 252,
      workweeks: 6.3
    },
    { 
      name: 'Best Case', 
      roughCutHours: 0.4, // 90% faster
      feedbackHours: 0.5,
      qcHours: 0.25,
      roughCutSaved: (baseline.roughCutHours - 0.4) * baseline.deliverables,
      timeSavedPerProject: 73,
      timeSaved4Projects: 292,
      workweeks: 7.3
    }
  ];

  // Prepare data for the rough cut focus chart
  const roughCutData = [
    {
      name: 'Baseline',
      roughCut: baseline.roughCutHours * baseline.deliverables,
      otherStages: (baseline.feedbackHours + baseline.qcHours) * baseline.deliverables
    },
    ...scenarios.map(scenario => ({
      name: scenario.name,
      roughCut: scenario.roughCutHours * baseline.deliverables,
      otherStages: (scenario.feedbackHours + scenario.qcHours) * baseline.deliverables
    }))
  ];

  // Prepare data for the waterfall chart focusing on rough cut impact
  const waterfallData = scenarios.map(scenario => {
    const roughCutSavings = (baseline.roughCutHours - scenario.roughCutHours) * baseline.deliverables;
    const otherSavings = scenario.timeSavedPerProject - roughCutSavings;
    
    return {
      name: scenario.name,
      roughCutSavings,
      otherSavings,
      totalSaved: scenario.timeSavedPerProject,
      roughCutPercentage: Math.round((roughCutSavings / scenario.timeSavedPerProject) * 100)
    };
  });

  // Prepare data for rough cut efficiency comparison
  const roughCutEfficiencyData = scenarios.map(scenario => {
    return {
      name: scenario.name,
      roughCutReduction: `${Math.round((1 - (scenario.roughCutHours / baseline.roughCutHours)) * 100)}%`,
      hoursPerDeliverable: scenario.roughCutHours,
      hoursSavedPerProject: scenario.roughCutSaved,
      totalTimeSaved: scenario.timeSavedPerProject,
      roughCutContribution: Math.round((scenario.roughCutSaved / scenario.timeSavedPerProject) * 100)
    };
  });

  // Prepare data for time distribution pie charts
  const baselinePieData = [
    { name: 'Rough Cut', value: baseline.roughCutHours * baseline.deliverables, color: '#8884d8' },
    { name: 'Feedback', value: baseline.feedbackHours * baseline.deliverables, color: '#82ca9d' },
    { name: 'QC & Rendering', value: baseline.qcHours * baseline.deliverables, color: '#ffc658' }
  ];

  const averagePieData = [
    { name: 'Rough Cut', value: scenarios[1].roughCutHours * baseline.deliverables, color: '#8884d8' },
    { name: 'Feedback', value: scenarios[1].feedbackHours * baseline.deliverables, color: '#82ca9d' },
    { name: 'QC & Rendering', value: scenarios[1].qcHours * baseline.deliverables, color: '#ffc658' }
  ];

  // Prepare data for time saved across projects
  const projectsData = [1, 2, 3, 4];
  const roughCutAcrossProjects = projectsData.map(projectCount => {
    return {
      projects: projectCount,
      Conservative: scenarios[0].roughCutSaved * projectCount,
      Average: scenarios[1].roughCutSaved * projectCount,
      'Best Case': scenarios[2].roughCutSaved * projectCount
    };
  });

  // Colors
  const colors = {
    roughCut: '#8884d8',
    otherStages: '#82ca9d',
    conservative: '#8884d8',
    average: '#82ca9d',
    bestCase: '#ffc658'
  };

  const RADIAN = Math.PI / 180;
  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index, name }) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central">
        {`${name} ${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  return (
    <div className="flex flex-col gap-8 p-4">
      <div>
        <h1 className="text-2xl font-bold mb-2 text-center">Rough Cut Optimization Analysis</h1>
        <p className="text-center text-gray-600 mb-8">Focus on eliminating rough cut editing time across 12 deliverables per project</p>
      </div>

      {/* 1. Rough Cut Reduction by Scenario */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-3">1. Rough Cut Hours: Baseline vs Tool-Assisted Scenarios</h2>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={roughCutData} barSize={60}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis label={{ value: 'Hours Per Project', angle: -90, position: 'insideLeft' }} />
              <Tooltip formatter={(value) => [`${value} hours`, '']} />
              <Legend />
              <Bar dataKey="roughCut" fill={colors.roughCut} name="Rough Cut Hours" />
              <Bar dataKey="otherStages" fill={colors.otherStages} name="Other Stages Hours" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 2. Contribution of Rough Cut Savings */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-3">2. Contribution of Rough Cut Savings to Total Time Saved</h2>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={waterfallData} barSize={60}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis label={{ value: 'Hours Saved', angle: -90, position: 'insideLeft' }} />
              <Tooltip formatter={(value, name) => [`${value} hours`, name]} />
              <Legend />
              <Bar dataKey="roughCutSavings" fill={colors.roughCut} name="Rough Cut Savings" stackId="a" />
              <Bar dataKey="otherSavings" fill={colors.otherStages} name="Other Stages Savings" stackId="a" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 3. Time Distribution Comparison */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-3">3. Time Distribution: Baseline vs Average Scenario</h2>
        <div className="flex flex-row h-72">
          <div className="w-1/2">
            <h3 className="text-center font-medium mb-2">Baseline</h3>
            <ResponsiveContainer width="100%" height="90%">
              <PieChart>
                <Pie
                  data={baselinePieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={renderCustomizedLabel}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {baselinePieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`${value} hours`, '']} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="w-1/2">
            <h3 className="text-center font-medium mb-2">Average Scenario</h3>
            <ResponsiveContainer width="100%" height="90%">
              <PieChart>
                <Pie
                  data={averagePieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={renderCustomizedLabel}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {averagePieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`${value} hours`, '']} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* 4. Rough Cut Time Saved Across Projects */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-3">4. Rough Cut Hours Saved Across Projects</h2>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={roughCutAcrossProjects}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="projects" 
                label={{ value: 'Number of Projects', position: 'insideBottom', offset: -5 }} 
              />
              <YAxis 
                label={{ value: 'Rough Cut Hours Saved', angle: -90, position: 'insideLeft' }} 
              />
              <Tooltip formatter={(value) => [`${value} hours`, '']} />
              <Legend />
              <Line type="monotone" dataKey="Conservative" stroke={colors.conservative} strokeWidth={2} />
              <Line type="monotone" dataKey="Average" stroke={colors.average} strokeWidth={2} />
              <Line type="monotone" dataKey="Best Case" stroke={colors.bestCase} strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Key Metrics Table */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-3">Rough Cut Efficiency Summary</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-300 p-2">Scenario</th>
                <th className="border border-gray-300 p-2">Rough Cut Reduction</th>
                <th className="border border-gray-300 p-2">Hours per Deliverable</th>
                <th className="border border-gray-300 p-2">Rough Cut Hours Saved</th>
                <th className="border border-gray-300 p-2">% of Total Time Saved</th>
              </tr>
            </thead>
            <tbody>
              {roughCutEfficiencyData.map((scenario, index) => (
                <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  <td className="border border-gray-300 p-2 font-medium">{scenario.name}</td>
                  <td className="border border-gray-300 p-2">{scenario.roughCutReduction}</td>
                  <td className="border border-gray-300 p-2">{scenario.hoursPerDeliverable} hrs</td>
                  <td className="border border-gray-300 p-2">{scenario.hoursSavedPerProject} hrs/project</td>
                  <td className="border border-gray-300 p-2">{scenario.roughCutContribution}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default RoughCutOptimization;