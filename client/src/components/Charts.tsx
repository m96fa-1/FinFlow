import * as Recharts from 'recharts'

export function PieChart({ data }: { data: { name: string; value: number; fill: string; }[] }) {
	return (
		<Recharts.PieChart responsive className='w-full h-full aspect-square'>
			<Recharts.Pie
				data={data}
				dataKey='value'
				cx='50%'
				cy='50%'
				innerRadius='60%'
				outerRadius='100%'
			/>
      <Recharts.Tooltip />
		</Recharts.PieChart>
	);
}

export function LineChart({ data }: { data: { xv: string; yv: number; }[] }) {
	return (
		<Recharts.LineChart
			data={data}
			responsive
			className='w-full h-full'
		>
			<Recharts.CartesianGrid strokeWidth='1' />
			<Recharts.XAxis dataKey='xv' />
			<Recharts.YAxis width='auto' dataKey='yv' tickFormatter={(value) => `$${value}`} />
			<Recharts.Tooltip formatter={(value) => `$${value}`} />
			<Recharts.Line
				type='linear'
				dataKey='yv'
				name='Spendings'
			/>
		</Recharts.LineChart>
	);
}