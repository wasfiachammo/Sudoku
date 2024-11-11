import React from 'react';

interface BaseButtonProps {
	title: string;
	color: string;
	style?: React.CSSProperties;
	onClick: () => void;
}

export const BaseButton: React.FC<BaseButtonProps> = ({ title, color, style, onClick }) => {
	return (
		<button style={style} onClick={onClick} className={`px-4 py-2 my-1 mx-2 ${color} text-white rounded-lg focus:outline-none border-none hover:opacity-65 transition-opacity duration-200`}>
			{title}
		</button>
	);
};
