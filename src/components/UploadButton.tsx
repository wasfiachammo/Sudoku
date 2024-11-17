import React, { useState } from 'react';
import { AiOutlineCloudUpload } from 'react-icons/ai'; // Icon for the button

interface ImageUploadButtonProps {
	onUpload: (file: File) => void; // Callback function when file is uploaded
	buttonText?: string; // Optional button text
}

const ImageUploadButton: React.FC<ImageUploadButtonProps> = ({ onUpload, buttonText = 'Click to Upload' }) => {
	const [imagePreview, setImagePreview] = useState<string | null>(null);

	const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files?.[0];
		if (file) {
			// Create a preview of the image
			const previewUrl = URL.createObjectURL(file);
			setImagePreview(previewUrl);
			onUpload(file); // Call the onUpload callback
		}
	};

	return (
		<>
			<div className='flex flex-col items-center justify-center p-4 border-2 border-dotted border-gray-400 rounded-md bg-gray-100 transition duration-200 cursor-pointer'>
				<label htmlFor='image-upload' className='flex items-center space-x-2 text-cyan-700'>
					<AiOutlineCloudUpload size={26} />
					<span className='text-lg'>{buttonText}</span>
				</label>
				<input id='image-upload' type='file' accept='image/*' onChange={handleImageChange} className='hidden' />
			</div>
			<div className='flex flex-col items-center justify-center p-2'>
				{imagePreview && (
					<div className='mt-4'>
						<img src={imagePreview} alt='Image preview' className='w-42 h-32 object-cover rounded-md border-2 border-gray-200' />
					</div>
				)}
			</div>
		</>
	);
};

export default ImageUploadButton;
