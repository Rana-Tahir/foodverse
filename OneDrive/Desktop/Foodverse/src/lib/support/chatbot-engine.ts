export interface ChatMessage {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  timestamp: string;
  action?: {
    label: string;
    href: string;
  };
}

export interface IntentResponse {
  text: string;
  action?: {
    label: string;
    href: string;
  };
}

const intents: Array<{
  keywords: string[];
  response: IntentResponse;
}> = [
  {
    keywords: ['restaurant', 'find', 'show', 'cuisine', 'food', 'eat', 'browse'],
    response: {
      text: 'You can explore our top-rated restaurants, search by cuisine, or browse popular dishes on the home page.',
      action: {
        label: 'Browse Restaurants',
        href: '/',
      },
    },
  },
  {
    keywords: ['order', 'place', 'steps', 'buy', 'cart', 'checkout'],
    response: {
      text: 'Placing an order is easy! 1) Browse and select a restaurant, 2) Add items to your cart, 3) Proceed to checkout and confirm your delivery address.',
      action: {
        label: 'Go to Cart',
        href: '/checkout',
      },
    },
  },
  {
    keywords: ['fee', 'delivery charge', 'cost', 'shipping', 'charges'],
    response: {
      text: 'Standard delivery fee is Rs. 150 across most service areas in Karachi. Delivery fees are clearly displayed at checkout before you place your order.',
    },
  },
  {
    keywords: ['pay', 'payment', 'cash', 'card', 'cod', 'wallet'],
    response: {
      text: 'Currently, Foodverse supports Cash on Delivery (COD) for all orders. Pay securely in cash when your food arrives at your doorstep.',
    },
  },
  {
    keywords: ['cancel', 'cancellation', 'modify', 'change order'],
    response: {
      text: 'You can cancel your order before the restaurant accepts it. Once preparation begins, cancellations are no longer available.',
    },
  },
  {
    keywords: ['status', 'track', 'where', 'delivery time', 'arrive'],
    response: {
      text: 'You can check your active order status and track your delivery in real-time from your order confirmation page or dashboard.',
    },
  },
  {
    keywords: ['rider', 'delivery driver', 'join', 'work'],
    response: {
      text: 'Want to deliver with Foodverse? Sign up as a rider on our registration page to access available assignments and start earning.',
      action: {
        label: 'Rider Signup',
        href: '/auth/signup',
      },
    },
  },
  {
    keywords: ['owner', 'restaurant partner', 'list restaurant', 'partner'],
    response: {
      text: 'Are you a restaurant owner? Register your restaurant on Foodverse to reach thousands of hungry customers in your city.',
      action: {
        label: 'Restaurant Signup',
        href: '/auth/signup',
      },
    },
  },
  {
    keywords: ['contact', 'support', 'help', 'human', 'issue', 'problem'],
    response: {
      text: 'Need direct assistance? You can reach our support team at support@foodverse.pk or call +92-21-1234-5678.',
    },
  },
];

export function getBotResponse(userMessage: string): IntentResponse {
  const lowerMessage = userMessage.toLowerCase();

  for (const intent of intents) {
    if (intent.keywords.some((kw) => lowerMessage.includes(kw))) {
      return intent.response;
    }
  }

  // Fallback response
  return {
    text: "I'm not quite sure I understand. You can ask about restaurants, ordering steps, payment methods, delivery fees, or contact support at support@foodverse.pk.",
    action: {
      label: 'Browse Restaurants',
      href: '/',
    },
  };
}
