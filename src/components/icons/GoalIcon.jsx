// src/components/icons/GoalIcon.jsx
export default function GoalIcon(props) {
	return (
		<svg
			{...props}
			xmlns="http://www.w3.org/2000/svg"
			fill="none"
			viewBox="0 0 24 24"
			strokeWidth={2}
			stroke="currentColor"
		>
			<circle cx="12" cy="12" r="7" />
			<circle cx="12" cy="12" r="4" />
			<circle cx="12" cy="12" r="1.5" fill="currentColor" />
			<path d="M19 5l-3 2v6" strokeLinecap="round" strokeLinejoin="round" />
		</svg>
	);
}