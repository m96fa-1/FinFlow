import * as Recharts from 'recharts'

export function PieChart({ data }: { data: { name: string; value: number; fill: string; }[] }) {
	return (
		<Recharts.PieChart width='100%' height='100%' style={{ aspectRatio: '1/1' }} responsive>
			<Recharts.Pie
				data={data}
				dataKey='value'
				cx='50%'
				cy='50%'
				innerRadius='60%'
				outerRadius='100%'
			/>
      <Recharts.Tooltip formatter={(value) => `${value}%`} />
		</Recharts.PieChart>
	);
}

export function LineChart({ data, strokeWidth }: { data: { xv: string; yv: number; }[]; strokeWidth?: string | number; }) {
	return (
		<Recharts.AreaChart data={data} width='100%' height='100%'>
			<defs>
				<linearGradient id='gradient1' x1='0' y1='0' x2='0' y2='1'>
					<stop offset='0%' stopColor='#2B8DAE' stopOpacity={0.8} />
					<stop offset='70%' stopColor='#2B8DAE' stopOpacity={0} />
				</linearGradient>
			</defs>
			<Recharts.CartesianGrid stroke='#000' strokeOpacity='0.1' strokeDasharray='4' />
			<Recharts.Area
				type='monotone'
				dataKey='yv'
				fill='url(#gradient1)'
				tooltipType='none'
				animationBegin={0}
				animationMatchBy='index'
				animationEasing='ease'
			/>
			<Recharts.XAxis dataKey='xv' interval='preserveStartEnd' />
			<Recharts.YAxis width='auto' dataKey='yv' interval={0} tickFormatter={(value) => `$${value?.toLocaleString('en-US')}`} />
			<Recharts.Tooltip formatter={(value) => value?.toLocaleString('en-US', { style: 'currency', currency: 'USD' })} />
			<Recharts.Line
				type='monotone'
				dataKey='yv'
				name='Spendings'
				stroke='var(--color-bluish-cyan)'
				strokeWidth={strokeWidth ?? 1}
				dot={false}
			/>
		</Recharts.AreaChart>
	);
}