export const loadRazorpay = (): Promise<any | false> => {
  return new Promise((resolve) => {
    const existingScript = document.getElementById('razorpay-checkout-js');
    
    // Check if the script is already present in the DOM
    if (existingScript) {
      resolve((window as any).Razorpay);
      return;
    }

    // Create and append the script
    const script = document.createElement('script');
    script.id = 'razorpay-checkout-js'; // Add the id attribute here
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => {
      resolve((window as any).Razorpay);
    };
    script.onerror = () => {
      resolve(false);
    };
    document.body.appendChild(script);
  });
};
