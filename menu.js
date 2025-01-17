document.addEventListener('DOMContentLoaded', () => {
    const cartItems = [];
    const cartList = document.getElementById('cart-items');
    const cart = document.querySelector('.cart');
    const overlay = document.createElement('div');
    overlay.classList.add('cart-overlay');
    document.body.appendChild(overlay);
    const toggleCartButton = document.getElementById('toggle-cart-button');
    const searchBar = document.getElementById('search-bar');
    const menuItems = document.querySelectorAll('.menu-item');

    // Handle quantity increase/decrease
    document.querySelectorAll('.quantity-increase').forEach(button => {
        button.addEventListener('click', (event) => {
            const quantitySpan = event.target.previousElementSibling;
            let quantity = parseInt(quantitySpan.textContent);
            quantity += 1;
            quantitySpan.textContent = quantity;
        });
    });

    document.querySelectorAll('.quantity-decrease').forEach(button => {
        button.addEventListener('click', (event) => {
            const quantitySpan = event.target.nextElementSibling;
            let quantity = parseInt(quantitySpan.textContent);
            if (quantity > 1) {
                quantity -= 1;
                quantitySpan.textContent = quantity;
            }
        });
    });

    // Handle "Add to Cart" buttons
    const addToCartButtons = document.querySelectorAll('.add-to-cart');
    addToCartButtons.forEach(button => {
        button.addEventListener('click', (event) => {
            const dishName = event.target.closest('.menu-item').querySelector('h2').textContent;
            const quantity = parseInt(event.target.closest('.menu-item').querySelector('.quantity').textContent);
            addToCart(dishName, quantity);
        });
    });

    function addToCart(dish, quantity) {
        // Check if the dish already exists in the cart
        const existingDishIndex = cartItems.findIndex(item => item.dish === dish);
        if (existingDishIndex !== -1) {
            // Update quantity if the dish is already in the cart
            cartItems[existingDishIndex].quantity += quantity;
        } else {
            // Add new dish to the cart
            cartItems.push({ dish,quantity });
        }
        updateCart();
    }

    function updateCart() {
        cartList.innerHTML = '';  // Clear current cart
        cartItems.forEach(item => {
            const listItem = document.createElement('li');
            listItem.textContent = `${item.dish} x ${item.quantity}`;

            // Create a remove button (X button)
            const removeButton = document.createElement('button');
            removeButton.textContent = 'x';
            removeButton.classList.add('remove-item');

            // Append the remove button next to the item
            listItem.appendChild(removeButton);

            // Add event listener for remove button
            removeButton.addEventListener('click', () => {
                removeFromCart(item.dish);
            });

            cartList.appendChild(listItem);
        });
        updateCartButton();
    }

    function updateCartButton() {
        const itemCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
        toggleCartButton.textContent = `Cart (${itemCount})`;
    }

    // Handle checkout button
    const checkoutButton = document.getElementById('checkout-button');
    checkoutButton.addEventListener('click', () => {
        if (cartItems.length > 0) {
            alert('Order is placed!');
        } else {
            alert('Your cart is empty!');
        }
    });

    // Remove item from cart
    function removeFromCart(itemName) {
        const index = cartItems.findIndex(item => item.dish === itemName);
        if (index !== -1) {
            cartItems.splice(index, 1);
            updateCart();
        }
    }

    // Toggle cart visibility
    toggleCartButton.addEventListener('click', () => {
        const isCartVisible = cart.style.display === 'block';
        if (!isCartVisible) {
            cart.style.display = 'block';
            overlay.style.display = 'block'; // Show overlay
            toggleCartButton.textContent = `Cart (${cartItems.length})`;
        } else {
            cart.style.display = 'none';
            overlay.style.display = 'none'; // Hide overlay
            toggleCartButton.textContent = `Cart (${cartItems.length})`;
        }
    });

    // Close cart when the overlay is clicked
    overlay.addEventListener('click', () => {
        cart.style.display = 'none';
        overlay.style.display = 'none';
        toggleCartButton.textContent = `Cart (${cartItems.length})`;
    });

    // Close cart with X button
    const closeCartButton = document.getElementById('close-cart-button');
    closeCartButton.addEventListener('click', () => {
        cart.style.display = 'none';
        overlay.style.display = 'none';
        toggleCartButton.textContent = `Cart (${cartItems.length})`;
    });

    // Search functionality
    searchBar.addEventListener('input', () => {
        const searchTerm = searchBar.value.toLowerCase();
        menuItems.forEach(item => {
            const dishName = item.getAttribute('data-dish').toLowerCase();
            if (dishName.includes(searchTerm)) {
                item.style.display = '';
            } else {
                item.style.display = 'none';
            }
        });
    });
});
function dialPhoneNumber() {
    // For debugging purposes, log to check if it's being clicked
    console.log("Button clicked, attempting to dial number...");

    // Attempt to open the phone dialer with the specified number
    const phoneNumber = 'tel:+9238023903';

    // Check if the phone dialer is available in the current environment
    if (navigator.userAgent.match(/Android|iPhone|iPad|iPod/i)) {
      // If the user is on a mobile device, use the 'tel:' protocol
      window.location.href = phoneNumber;
    } else {
      // If not on a mobile device, display a message or handle it differently
      alert('This functionality is only available on mobile devices.');
    }
  }
  document.querySelector('#checkout-button').addEventListener('click', function() {
    // Get selected dishes and their quantities
    let dishes = [];
    document.querySelectorAll('.menu-item').forEach(function(item) {
        let name = item.querySelector('h2').textContent;
        let quantity = parseInt(item.querySelector('.quantity').textContent);

        if (quantity > 0) {
            dishes.push({ name: name, quantity: quantity });
        }
    });

    // Get phone number and table number
    let phoneNumber = document.querySelector('#phone-number').value;
    let tableNumber = document.querySelector('#table-number').value;
    let suggestions = document.querySelector('#suggestion-text').value;

    // Validate fields
    if (dishes.length === 0 || !phoneNumber || !tableNumber) {
        alert("Please select dishes, enter your phone number, and select a table.");
        return;
    }

    // Prepare data for sending
    let orderData = {
        dishes: dishes,
        phone_number: phoneNumber,
        table_number: tableNumber,
        suggestions: suggestions
    };

    // Send data via AJAX to the PHP script
    let xhr = new XMLHttpRequest();
    xhr.open("POST", "submit_order.php", true);
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4 && xhr.status === 200) {
            alert(xhr.responseText);
        }
    };

    xhr.send("dishes=" + JSON.stringify(orderData.dishes) +
             "&phone_number=" + encodeURIComponent(orderData.phone_number) +
             "&table_number=" + encodeURIComponent(orderData.table_number) +
             "&suggestions=" + encodeURIComponent(orderData.suggestions));
});
