// import { Component } from '@angular/core';
// import { Cloudinary, CloudinaryImage } from '@cloudinary/url-gen';
// import { fill } from '@cloudinary/url-gen/actions/resize';

// @Component({
//   selector: 'app-home',
//   templateUrl: './dashboard-ui.component.html',
// })
// export class HomeComponent {
//   private cloudinary: Cloudinary;

//   constructor() {
//     this.cloudinary = new Cloudinary({
//       cloud: {
//         cloudName: 'YOUR_CLOUD_NAME', // Get from Cloudinary dashboard
//         apiKey: 'YOUR_API_KEY',       // Get from Cloudinary dashboard
//         apiSecret: 'YOUR_API_SECRET', // Optional (needed for server-side uploads)
//       },
//     });
//   }

//   async captureDiary() {
//     const element = document.getElementById('diary-content');
//     if (!element) return;

//     try {
//       const canvas = await html2canvas(element);
//       const imageData = canvas.toDataURL('image/jpeg');

//       // Upload to Cloudinary
//       const cloudinaryUrl = await this.uploadToCloudinary(imageData);
      
//       // Now you can share this URL
//       console.log('Cloudinary URL:', cloudinaryUrl);
//       return cloudinaryUrl;
//     } catch (error) {
//       console.error('Error capturing or uploading:', error);
//     }
//   }

//   async uploadToCloudinary(imageData: string): Promise<string> {
//     const formData = new FormData();
//     formData.append('file', imageData);
//     formData.append('upload_preset', 'YOUR_UPLOAD_PRESET'); // Create one in Cloudinary settings

//     const response = await fetch(
//       `https://api.cloudinary.com/v1_1/YOUR_CLOUD_NAME/image/upload`,
//       {
//         method: 'POST',
//         body: formData,
//       }
//     );

//     const data = await response.json();
//     return data.secure_url; // Returns the public URL of the uploaded image
//   }
// }