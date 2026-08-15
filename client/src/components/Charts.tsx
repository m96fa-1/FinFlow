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

export function LineChart({ data }: { data: { xv: string; yv: number; }[] }) {
	return (
		<Recharts.LineChart
			data={data}
			width='100%'
			height='100%'
		>
			<Recharts.CartesianGrid strokeWidth='1' />
			<Recharts.XAxis dataKey='xv' />
			<Recharts.YAxis width='auto' dataKey='yv' tickFormatter={(value) => `$${value}`} />
			<Recharts.Tooltip formatter={(value) => `$${value}`} />
			<Recharts.Line
				type='linear'
				dataKey='yv'
				name='Spendings'
				stroke='var(--color-bluish-cyan)'
			/>
		</Recharts.LineChart>
	);
}