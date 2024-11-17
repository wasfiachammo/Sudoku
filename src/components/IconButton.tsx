import { FC } from 'react';

type IconButtonProps = {
	icon: React.ReactNode;
	title: string;
	color?: string;
	reversed?: boolean;
	style?: React.CSSProperties;
	onClick: () => void;
};
export const IconButton: FC<IconButtonProps> = ({ icon, title, color, reversed, style, onClick, ...props }) => {
	return (
		<button onClick={onClick} className={`flex items-center px-3 py-2 border-none rounded-md focus:outline-none ${color}`} style={style} {...props}>
			{!reversed && <span className='mr-2'>{icon}</span>}
			<span className='font-normal'>{title}</span>
			{reversed && <span className='ml-2'>{icon}</span>}
		</button>
	);
};
