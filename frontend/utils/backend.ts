/**
 * This file acts as the contract between the Frontend (Next.js) and the Backend (Python/Firebase).
 * Your friend should implement the backend endpoints based on these interfaces.
 */

// ==========================================
// Data Types
// ==========================================

export interface UserProfile {
    uid: string;
    email: string;
    displayName: string;
    studentNumber?: string;
    membershipStatus: 'active' | 'expired' | 'none';
}

export interface OrderItem {
    productId: string;
    variant?: string; // e.g., "M", "L"
    quantity: number;
    priceAtPurchase: number;
}

export interface Order {
    userId?: string; // Optional for guest checkout?
    items: OrderItem[];
    totalAmount: number;
    currency: 'CAD';
    status: 'pending' | 'paid' | 'failed';
    createdAt: string; // ISO Date string
}

// ==========================================
// API Constants
// ==========================================

export const API_BASE_URL = "https://your-firebase-function-url.com/api";

// ==========================================
// Function Stubs (To be implemented or connected)
// ==========================================

/**
 * Sends order details to the backend to initiate checkout.
 * Expected Backend Action: Validate stock, create Stripe session, return payment URL.
 */
export async function createCheckoutSession(order: Order): Promise<{ url: string } | null> {
    console.log("Mock: Creating checkout session for order:", order);

    // Example fetch call implementation:
    /*
    const response = await fetch(`${API_BASE_URL}/checkout`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(order),
    });
    return response.json();
    */

    return { url: "https://checkout.stripe.com/mock-url" };
}

/**
 * Validates if a student number is eligible for membership.
 */
export async function validateStudentEligibility(studentNumber: string): Promise<boolean> {
    console.log("Mock: Validating student number:", studentNumber);
    return true;
}

/**
 * Fetches dynamic events from Google Calendar or Firestore.
 */
export async function getUpcomingEvents(): Promise<any[]> {
    console.log("Mock: Fetching events...");
    return [];
}
