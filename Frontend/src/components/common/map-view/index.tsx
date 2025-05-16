'use client'

import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";


interface MapViewProps {
	latitude: number;
	longitude: number;
	name: string;
}

export function MapView({ latitude, longitude, name }: MapViewProps) {
	return (
		<MapContainer
			center={[latitude, longitude]}
			zoom={13}
			className="h-full w-full rounded-xl shadow-md"
			scrollWheelZoom={false}
		>
			<TileLayer
				attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
				url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
			/>
			<Marker position={[latitude, longitude]}>
				<Popup>
					<strong>{name}</strong>
				</Popup>
			</Marker>
		</MapContainer>
	);
}
