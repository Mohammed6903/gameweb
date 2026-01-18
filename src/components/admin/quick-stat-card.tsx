import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { memo } from 'react';

export const QuickStatsCard = memo(({ stat }: { stat: QuickStat }) => (
  <Card className={`${stat.bg} border-none`}>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
      <stat.icon className={`h-5 w-5 ${stat.color}`} />
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">{stat.value.toLocaleString()}</div>
    </CardContent>
  </Card>
));

QuickStatsCard.displayName = 'QuickStatsCard';