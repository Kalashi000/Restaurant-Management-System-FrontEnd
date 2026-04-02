// --- 1. Filter Logic ---
const filterButtons = document.querySelectorAll('.filter-btn');
const foodCards = document.querySelectorAll('.food-card');

filterButtons.forEach(button => {
    button.addEventListener('click', () => {
        filterButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
        const filterValue = button.getAttribute('data-filter');
        foodCards.forEach(card => {
            if (filterValue === 'all' || card.getAttribute('data-category') === filterValue) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });
    });
});

// --- 2. Search Logic ---
const searchInput = document.getElementById('menu-search');
if (searchInput) {
    searchInput.addEventListener('keyup', (e) => {
        const searchText = e.target.value.toLowerCase();
        foodCards.forEach(card => {
            const foodName = card.querySelector('h3').innerText.toLowerCase();
            if (foodName.includes(searchText)) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });
    });
}

// --- 3. Order Logic ---
const orderButtons = document.querySelectorAll('.order-btn');
const checkoutSection = document.getElementById('checkout-section');
const selectedFoodText = document.getElementById('selected-food');

orderButtons.forEach(button => {
    button.addEventListener('click', () => {
        const foodCard = button.closest('.food-card');
        const foodName = foodCard.querySelector('h3').innerText;
        const foodPrice = foodCard.querySelector('.price').innerText;
        
        if(checkoutSection) {
            checkoutSection.style.display = 'block';
            selectedFoodText.innerHTML = "<strong>" + foodName + "</strong> - <strong>" + foodPrice + "</strong>";
            window.location.href = "#checkout-section";
        }
    });
});

// --- 4. Final Order Placement ---
function placeFinalOrder() {
    const name = document.getElementById('cus-name').value;
    const address = document.getElementById('cus-address').value;
    const phone = document.getElementById('cus-phone').value;
    const paymentElement = document.querySelector('input[name="payment"]:checked');
    
    if (!paymentElement) return;
    const paymentMethod = paymentElement.value;
    
    const fullDetails = selectedFoodText.innerText;
    const foodName = fullDetails.split(" - ")[0];
    const rawPrice = fullDetails.split(" - ")[1]; 

    if(name === "" || address === "" || phone === "") {
        showSuccess("Please fill all the details!");
        return;
    }

    const phonePattern = /^(?:0|94|\+94)?7(0|1|2|4|5|6|7|8)\d{7}$/;
    if(!phonePattern.test(phone)) {
        showSuccess("Please enter a valid phone number!");
        return;
    }

    if(paymentMethod === 'card') {
        document.getElementById('fake-payhere').style.display = 'flex';
        document.getElementById('pay-amount').innerText = "Amount: " + rawPrice;
    } else {
        showSuccess("Thank you!\nYour order for " + foodName + " is confirmed.");
    }
}

// --- 5. Mock Payment Logic ---
function finishMockPayment() {
    const popup = document.getElementById('fake-payhere');
    const cardInput = popup.querySelector('input[placeholder="Card Number"]');
    const expiryInput = document.getElementById('card-expiry');
    const cvcInput = popup.querySelector('input[placeholder="CVC"]');

    const cardNumber = cardInput.value.trim();
    const expiry = expiryInput.value.trim();
    const cvc = cvcInput.value.trim();

    if (cardNumber === "" || expiry === "" || cvc === "") {
        showSuccess("Please fill all card details!");
        return;
    }

    if (cardNumber.length !== 16 || isNaN(cardNumber)) {
        showSuccess("Invalid Card Number!");
        return;
    }

    if (cvc.length < 3 || isNaN(cvc)) {
        showSuccess("Invalid CVC!");
        return;
    }

    const payBtn = event.target;
    payBtn.innerText = "Processing...";
    payBtn.disabled = true;

    setTimeout(function() {
        payBtn.innerText = "Success";
        payBtn.style.background = "#27ae60"; 
        
        setTimeout(function() {
            showSuccess("Payment Successful!");
            document.getElementById('fake-payhere').style.display = 'none';
        }, 1000); 
    }, 2000); 
}

function closeMockPayment() {
    document.getElementById('fake-payhere').style.display = 'none';
}

// 6. Custom Alert Logic 

function showSuccess(message) {
    const modal = document.getElementById('custom-alert');
    const msgPara = document.getElementById('alert-message');
    const msgTitle = document.getElementById('alert-title');

    if (modal && msgPara) {
        msgPara.innerText = message;
        
        // Hide the title completely
        if (msgTitle) {
            msgTitle.style.display = 'none';
        }

        // Always Bold for all messages
        msgPara.style.fontWeight = "bold";

        // Logic for Colors:
        if (message.includes("Invalid") || message.includes("Please") || message.includes("fill")) {
            // ERROR MESSAGES - Bold Red Color
            msgPara.style.color = "#e74c3c"; 
        } else {
            // SUCCESS & ALL OTHER MESSAGES - Bold Black Color
            msgPara.style.color = "#000000"; 
        }
        
        modal.style.display = 'flex';
    }
}

function closeCustomAlert() {
    document.getElementById('custom-alert').style.display = 'none';
}

// --- 7. Nav Logic ---
const sections = document.querySelectorAll('section, header');
const navLi = document.querySelectorAll('.nav-links a');

window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        if (pageYOffset >= (sectionTop - 120)) {
            current = section.getAttribute('id');
        }
    });
    navLi.forEach(a => {
        a.classList.remove('active');
        if (a.getAttribute('href').includes(current)) {
            a.classList.add('active');
        }
    });
});

// --- 8. Expiry Auto-Format MM/YY with Auto-Focus ---
document.addEventListener("DOMContentLoaded", function () {
    const expiryField = document.getElementById('card-expiry');
    const cvcField = document.querySelector('input[placeholder="CVC"]');

    if (!expiryField) return;

    expiryField.addEventListener('input', function (e) {
        let value = e.target.value.replace(/\D/g, ''); 

        if (value.length > 4) value = value.substring(0, 4);

        if (value.length >= 3) {
            value = value.substring(0, 2) + '/' + value.substring(2);
        } else if (value.length >= 2) {
            value = value.substring(0, 2) + '/';
        }

        e.target.value = value;

        if (value.length >= 2) {
            const month = parseInt(value.substring(0, 2), 10);
            if (month < 1 || month > 12) {
                showSuccess("Invalid month!");
                e.target.value = '';
                return;
            }
        }

        if (value.replace('/', '').length === 4 && cvcField) {
            cvcField.focus();
        }
    });

    expiryField.addEventListener('keypress', function (e) {
        if (!/[0-9]/.test(e.key)) e.preventDefault();
    });

    expiryField.addEventListener('keydown', function (e) {
        if (e.key === 'Backspace') {
            let value = e.target.value.replace(/\D/g, '');
            value = value.substring(0, value.length - 1);

            if (value.length >= 3) {
                e.target.value = value.substring(0, 2) + '/' + value.substring(2);
            } else if (value.length >= 2) {
                e.target.value = value.substring(0, 2) + '/';
            } else {
                e.target.value = value;
            }
            e.preventDefault();
        }
    });
});
// --- Contact Form Logic (Safe Version) ---
const contactForm = document.getElementById('contact-form');

if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
        e.preventDefault(); 

        const name = contactForm.querySelector('input[name="name"]').value;
        const email = contactForm.querySelector('input[name="email"]').value;
        const message = contactForm.querySelector('textarea[name="message"]').value;

        if (name === "" || email === "" || message === "") {
            showSuccess("Please fill all the fields in the contact form!");
        } else {
            showSuccess("Thank you! Your message has been sent successfully.");
            contactForm.reset(); 
        }
    });
}
