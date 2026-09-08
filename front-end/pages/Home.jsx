import React, { useMemo } from 'react';
import { useInventory } from '@/hooks/useInventory';
import DashboardGrid from '../components/dashboard/DashboardGrid';
import SalesKpiGrid from '../components/dashboard/SalesKpiGrid';
import Earnings from '../components/dashboard/Earnings';
import LevelChart from '../components/dashboard/LevelChart';
import VisitorInsights from '../components/dashboard/VisitorInsights';
import CustomerFulfilment from '../components/dashboard/CustomerFulfilment';
import TopProducts from '../components/dashboard/TopProducts';
import DemandForecastSection from '../components/dashboard/DemandForecastSection';
import { buildLevelChartData, buildForecasts, buildMonthlyUnits, buildWeeklyFulfilment } from '../lib/dashboardMetrics';

export default function Home() {
  const { products, categories, demandRecords, metrics } = useInventory();

  const levelData = useMemo(() => buildLevelChartData(products), [products]);
  const forecasts = useMemo(() => buildForecasts(products, demandRecords), [products, demandRecords]);
  const monthlyUnits = useMemo(() => buildMonthlyUnits(demandRecords), [demandRecords]);
  const weekly = useMemo(() => buildWeeklyFulfilment(demandRecords), [demandRecords]);

  // `rows` é o número de trilhas de 120px (auto-rows-[minmax(120px,auto)]) que o
  // widget reserva por padrão no grid de 12 colunas — é o hint que permite ao
  // grid-flow-dense encaixar cards menores nas lacunas ao lado de cards altos.
  const widgets = [
    { id: 'kpis', span: 'full', rows: 2, render: () => <SalesKpiGrid metrics={metrics} /> },
    { id: 'earnings', span: '1/3', rows: 2, render: () => <Earnings value={metrics.value} health={metrics.health} alerts={metrics.alerts} /> },
    { id: 'level', span: '2/3', rows: 3, render: () => <LevelChart data={levelData} /> },
    { id: 'visitors', span: '1/2', rows: 3, render: () => <VisitorInsights data={monthlyUnits} /> },
    { id: 'fulfilment', span: '1/2', rows: 2, render: () => <CustomerFulfilment data={weekly.data} current={weekly.current} previous={weekly.previous} /> },
    { id: 'top-products', span: '1/3', rows: 3, render: () => <TopProducts products={products} forecasts={forecasts} /> },
    { id: 'forecast', span: '2/3', rows: 4, render: () => <DemandForecastSection products={products} records={demandRecords} forecasts={forecasts} categories={categories} /> },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold tracking-tight">Visão Geral do Painel</h1>
      <DashboardGrid widgets={widgets} />
    </div>
  );
}
