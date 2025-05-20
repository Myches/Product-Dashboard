
# Product Dashboard

A React-based product management interface that allows users to view, create, edit, delete, search,sort and filter products from a RESTful API


## 📋 Features
  **Product Display** : View products with name, price, category, and rating information
  
  **CRUD Operations** : 
  - create new products
  - View product details
  - Update existing products
  - Delete products

  **Favorites System** : Mark products as favorites and persist them across sessions
  
  **Search & Filtering**:
  - Search products by name
  - Filter by category
  - Sort by price (ascending/descending)

  **Modal Details**: Click on any product to view full details.
  
  **Pagination**: Navigate through large product lists with ease.
  
  **Toast Notifications**: Receive feedback on actions like create, update, delete.
  
  **Responsive Design**: Optimized for both desktop and mobile viewing

## 🛠️ Tech Stack

- **React**: UI library for building the interface
- **Vite**: For building and running the app
- **Typescript**: For Type safety during development
- **Axios**: For API requests
- **Lucide React**: For icons
- **Shadcn**: For reusable UI components
- **Tailwind CSS**: For styling components
- **Vitest and React Testing Library**: For Unit Testing
- **React Query**: For fetching and mutation of API data

## 🔧 Setup and Installation

### Prerequisites
- Node.js (v14.0.0 or later)
- npm or yarn

### Installation Steps

1. ####  Clone the Repository

- Open your terminal or command prompt.
- Navigate to the directory where you want to clone the project.
- Run the following command to clone the repository:

   ```bash
   git clone https://github.com/Myches/Product-Dashboard.git
   ```

2. Navigate to the cloned project directory:

   ```bash
   cd product-management-app
   ```

3. Checkout to the master branch:

   ```bash
   git checkout master
    ```
  

4. **Install dependencies**:
   ```bash
   npm install
   ```

5. **Start the development server**:

   ```bash
   npm run dev
   ```
6.  Open your browser and go to the specified URL (e.g., `http://localhost:5173`).

## 📱 Usage

### Navigation Flow

#### Main Dashboard:
- View all products in a paginated table format
- Use the search bar to find products by name
- Filter by category using the dropdown
- Sort by price using the sort buttons
- Click the heart icon to add/remove from favorites

#### Creating a Product:
- Click the "Add New Product" button
- Fill in the product details in the form
- Submit to create a new product
- Receive a success toast notification

#### Viewing Product Details:
- Click on any product row to view full details in a modal
- See name, price, description, and category

#### Editing a Product:
- Click the "Edit" button on the product details modal
- Modify details in the populated form
- Submit to update the product
- Receive a success toast notification

#### Deleting a Product:
- Click the "Delete" button on the product details modal
- Confirm deletion in the confirmation dialog
- Product is removed from the list
- Receive a success toast notification

#### Managing Favorites:
- Click on the heart icon to toggle favorite status
- Favorites persist even after closing the browser

#### Testing Components:
```bash
npm run test
```

## 📝 Design Decisions & Assumptions

- **API Handling**: Implemented comprehensive data fetching and mutation logic using React Query with established robust error handling and loading state for all API calls
- **Responsive Design**: Prioritized mobile responsiveness
- **Performance Optimizations**: Implemented pagination to limit the number of products loaded at once
- **Local Storage**: Used for favorites persistence as it provides a simple solution without requiring backend modifications

## 🔮 Future Improvements

With more time, I would add:
- **Unit Tests**: Expand the coverage of the tests
