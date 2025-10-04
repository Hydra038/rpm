// Debug script to check billing address issue
// Run this in your browser console on the checkout page

console.log('=== BILLING ADDRESS DEBUG ===');

// Check if billing address field exists
const billingField = document.querySelector('textarea[placeholder*="Street Address"]');
console.log('Billing address field found:', !!billingField);

if (billingField) {
  console.log('Billing address value:', billingField.value);
}

// Check the checkbox
const checkbox = document.querySelector('#same-as-shipping');
console.log('Same as shipping checkbox:', checkbox?.checked);

// Monitor form submission
const forms = document.querySelectorAll('form');
console.log('Forms found:', forms.length);

// Add event listener to debug form data
forms.forEach((form, index) => {
  form.addEventListener('submit', (e) => {
    console.log(`Form ${index} submitted with data:`, new FormData(form));
  });
});

// Check local storage for any saved data  
console.log('localStorage checkout data:', localStorage.getItem('checkout-data'));

console.log('=== END DEBUG ===');