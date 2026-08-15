# Kalakunj Catalogue

Browse products in a flipbook-style catalogue and send inquiries directly via WhatsApp.

## Public Catalogue

Open the app in your browser (usually at `http://localhost:5173/`).

### Browsing products
- **Flip through pages** using the left/right arrows or swipe on touch devices.
- Each product fills the entire page with its photo and details overlaid on top.
- The page counter below the book shows your current position (e.g., `Page 2 / 5`).

### Product actions
- **Zoom**: Tap any product image to view it full-screen.
- **Add to inquiry**: Tap **Add to inquiry** to add the product to your cart.
- **Share**: Tap the share button to send the product details via WhatsApp.

### Sending an inquiry
1. Browse the catalogue and add products you're interested in to the inquiry cart.
2. Tap the **Inquiry** button at the bottom to open your cart.
3. Review the items, then tap **Send inquiry via WhatsApp**.
4. A WhatsApp message will open with all selected products and their image links pre-filled.
5. Add any additional details (quantity, delivery location, etc.) and send.

---

## Admin Dashboard

Open `http://localhost:5173/admin` in your browser.

### Logging in
- Enter your username and password on the login screen.
- Your session is stored for the duration of the browser tab.

### Managing products
- **Add product**: Fill in the title, description, upload an image, and tap **Add to catalogue**.
- **Remove product**: In the **Current products** list, tap **Remove** next to any product.
- **Reorder products**: Drag and drop rows using the `⋮⋮` handle, or use the up/down arrows to change the display order. This order is reflected in the public flipbook.

### Current products list
Shows all products currently in the catalogue, in the order customers will see them.

---

## Notes
- Image uploads require valid backend credentials (Cloudinary) configured on the server.
- For any issues, contact the site administrator.

---

## API Documentation (Swagger)

Swagger docs are available at:
`http://localhost:3000/api/docs`

Use this to explore all available endpoints, request/response schemas, and test API calls directly from the browser.
"# kalakunj-nestjs-project" 
