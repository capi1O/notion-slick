import React, { useState, useEffect } from 'react';

// Custom hook to watch an element's offsetTop value
export const useOffsetTop = (ref: React.RefObject<HTMLDivElement>) => {
	const [offsetTop, setOffsetTop] = useState(0);

	useEffect(() => {
		const handleResize = () => {
			if (ref.current) setOffsetTop(ref.current.offsetTop);
		};

		// Call once immediately to set initial offsetTop
		handleResize();

		// Update offsetTop on window resize
		window.addEventListener('resize', handleResize);
		// Optionally, adjust to handle scroll or other events that may change offsetTop

		// Cleanup
		return () => window.removeEventListener('resize', handleResize);
	}, [ref]);

	return offsetTop;
};
