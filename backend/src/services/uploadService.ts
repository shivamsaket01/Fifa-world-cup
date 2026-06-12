// Mock Cloudinary upload service

export interface UploadResponse {
  url: string;
  publicId?: string;
}

export const uploadImage = async (fileBuffer: Buffer, folder: string): Promise<UploadResponse> => {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 1000));
  
  // Return a mock URL for now as requested
  return {
    url: `https://via.placeholder.com/800x600?text=Mock+Upload+(${folder})`,
    publicId: `mock_${Date.now()}`,
  };
};
