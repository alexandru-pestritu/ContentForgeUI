# ContentForge UI 🎨

ContentForge UI is a web application built using Angular that serves as the front-end interface for the [ContentForge API](https://github.com/alexandru-pestritu/ContentForgeAPI). This application provides a user-friendly interface for managing articles, products, stores, and prompts associated with affiliate marketing.

## Features 🌟

ContentForge UI is designed to provide a seamless user experience for managing and creating content for affiliate marketing. Below are the key features:

### Store Management 🏬
- **Add Affiliate Stores**: Users can easily add new affiliate stores to the database.
- **Store List**: View a comprehensive list of all registered stores, including details like name, base URL, and favicon.
- **Edit and Delete Stores**: Users can update store information or remove stores from the system.

### Product Management 📦
- **Add Products**: Users can add new products by providing affiliate URLs. Data scraping techniques are employed to automatically retrieve product details, including descriptions, specifications, images, and stock status.
- **View Products**: Users can browse through a list of products, including key details such as availability and rating.
- **Edit and Delete Products**: Easily update product information or remove products from the inventory.
- **Out of Stock Notifications**: The system can flag products that are out of stock and notify users accordingly.

### Article Creation ✍️
- **Create Articles**: Users can create new articles, specifying products to be included in the content.
- **AI Content Generation**: The application leverages AI to generate various content types, such as:
  - **Product Reviews**: Automatically generate comprehensive reviews, including pros and cons for each product.
  - **Article Components**: Generate key sections for articles, such as introductions, buyers’ guides, FAQs, and conclusions.
  
### Custom Prompt Management 💡
- **Custom Prompts**: Users can create and manage custom prompts for AI content generation, using placeholders that pull data from existing products and articles.
- **Prompt Types and Subtypes**: Easily categorize prompts for better organization and retrieval.

### WordPress Integration 🌐
- **Publish to WordPress**: Articles can be published directly to a WordPress site. The application automatically generates Gutenberg blocks based on the article's content and the associated products and stores.
- **Manage WordPress Users and Categories**: Users can view existing WordPress users and categories directly from the UI.

### Dashboard & Analytics 📊
- **Dashboard Overview**: A user-friendly dashboard that displays key statistics and analytics related to articles and products.
- **Stock Check Logs**: Users can view logs detailing stock checks, including timestamps and results.

### Tailwind CSS & PrimeNG Integration 🎨
- **Stylish UI**: The application uses Tailwind CSS for styling, providing a consistent and aesthetically pleasing interface.
- **Component Library**: Integration with PrimeNG for a rich set of UI components, enhancing functionality and user experience.

### Real-Time Updates 🔄
- **Live Data**: The application can fetch and display live data from the API, ensuring users always have access to the most current information.

With these features, ContentForge UI empowers users to efficiently manage their affiliate marketing content and streamline the process of creating valuable articles that drive traffic and conversions.


## Prerequisites 🔧

Before you begin, ensure you have met the following requirements:

- Node.js (version 14.x or later)
- Angular CLI (version 17.x or later)
- Docker (optional, for containerized deployment)

## Setup Instructions 🛠️

Follow these steps to set up the project locally:

1. **Clone the Repository**:

   ```bash
   git clone https://github.com/alexandru-pestritu/ContentForgeUI.git
   cd contentforge-ui
   ```

2. Install Dependencies:
   
   ```bash
   npm install
   ```

3. Environment Configuration:
   
   Create a ```.env``` file in the root of your project with the following variables:

   ```bash
   API_URL=http://localhost:8000/api/v1
   ```
   Ensure that the ```API_URL``` points to your running [ContentForge API](https://github.com/alexandru-pestritu/ContentForgeAPI).
   
5. Run the Development Server:
   ```bash
   ng serve
   ```
   Open your browser and navigate to ```http://localhost:4200``` to view the application.

## Deployment 🚀

### Docker

This project includes a Dockerfile for easy deployment. Follow the steps below to deploy the application using Docker:

1. **Build the Docker Image**:

   Navigate to the root directory of the project and run the following command:

   ```bash
   docker build -t contentforge-ui .
   ```

2. Run the Docker Container:

   Before running the container, ensure that the API_URL environment variable is set. You can use the following command to run the container:

   ```bash
   docker run -d -p 4200:4200 --env API_URL=http://your-api-url contentforge-ui
   ```
   Replace ```http://your-api-url``` with the URL of your running [ContentForge API](https://github.com/alexandru-pestritu/ContentForgeAPI).
    
