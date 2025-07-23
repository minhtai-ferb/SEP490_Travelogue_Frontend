import React from 'react'

interface CardPlaceProps {
	i: number
}

function CardPlace({ i }: CardPlaceProps) {
	return (
		<div
			key={i}
			className="bg-white rounded-lg shadow p-4 space-y-2 border"
		>
			<h2 className="text-xl font-semibold">ngày #{i + 1} ở Tây Ninh </h2>
			<p className="text-gray-500">
				Lorem ipsum dolor sit amet, consectetur adipisicing elit. Reiciendis, recusandae. Distinctio ex quia voluptate tempore dolore amet ab? Atque fuga, assumenda suscipit esse sapiente reprehenderit soluta. Iure dolores rerum sunt laborum quaerat minus illum et totam. Officia necessitatibus aliquid ipsum quas incidunt laboriosam soluta veritatis porro culpa. Facilis, facere quis.
			</p>
		</div>
	)
}

export default CardPlace