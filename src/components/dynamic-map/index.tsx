import React from 'react'

interface MapCommonProps {
	region: string;
}

function MapDynamic({ region }: MapCommonProps) {

	return (
		<svg xmlns="http://www.w3.org/2000/svg" version="1.2" baseProfile="tiny" width="300" height="300" viewBox="0 0 800 958" strokeLinecap="round" strokeLinejoin="round">
			<g id="gadm41_VNM_2" className="fill-white">
				<path
					className=""
					d={region}
				/>
			</g>
		</svg>
	)
}

export default MapDynamic
