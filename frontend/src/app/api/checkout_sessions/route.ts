import { NextResponse } from 'next/server';
import Stripe from 'stripe';

  const STRIPE_SECRET_KEY = "sk_test_51QTtdYIcvWpTvnodpB1UjGeytPF4grF5AlhJADQpRBZGb0ojqelnheZiizqF3m1yFU5wcG8trCEeq1oEiWGKHTUT004zOsP3Eb"

// Initialize Stripe with your secret key
const stripe = new Stripe(STRIPE_SECRET_KEY!, {
  apiVersion: '2024-11-20.acacia'
});

// Define the POST handler for creating the checkout session
export async function POST(req: Request) {
  try {
    // Create Checkout Sessions from body params.
    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          price: 'price_1QTu0dIcvWpTvnod35susO5L',
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${req.headers.get('origin')}/?success=true`, // Adjust the success URL as needed
      cancel_url: `${req.headers.get('origin')}/?canceled=true`, // Adjust the cancel URL as needed
    });

    return NextResponse.redirect(session.url!, { status: 303 });
  } catch (err: any) {
    console.error('Error creating checkout session:', err);
    return new NextResponse(err.message, { status: 500 });
  }
}
