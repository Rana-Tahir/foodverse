'use server';

import { createClient } from '@/lib/supabase/server';

export interface Address {
  id: string;
  user_id: string;
  street_address: string;
  area: string;
  city: string;
  postal_code: string | null;
  label: string | null;
  is_default: boolean;
}

export async function getUserAddresses(): Promise<Address[]> {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return [];

  const { data, error } = await supabase
    .from('addresses')
    .select('*')
    .eq('user_id', user.id)
    .order('is_default', { ascending: false });

  if (error || !data) {
    return [];
  }

  return data as Address[];
}

export interface CheckoutValidationInput {
  restaurantId: string;
  cartItems: { id: string; quantity: number; price_pkr: number }[];
  deliveryAddressId: string;
}

export async function validateAndCreateOrder({
  restaurantId,
  cartItems,
  deliveryAddressId,
}: CheckoutValidationInput) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error('Unauthorized: Please sign in to checkout');
  }

  // 1. Validate restaurant
  const { data: restaurant, error: restError } = await (supabase as any)
    .from('restaurants')
    .select('*')
    .eq('id', restaurantId)
    .eq('is_approved', true)
    .single();

  if (restError || !restaurant || !restaurant.is_available) {
    throw new Error('Restaurant is currently unavailable or not found');
  }

  // 2. Validate delivery address belongs to user
  const { data: address, error: addrError } = await supabase
    .from('addresses')
    .select('*')
    .eq('id', deliveryAddressId)
    .eq('user_id', user.id)
    .single();

  if (addrError || !address) {
    throw new Error('Invalid delivery address selected');
  }

  // 3. Re-fetch menu items to verify prices and availability server-side
  const menuItemIds = cartItems.map((i) => i.id);
  const { data: dbItems, error: itemsError } = await (supabase as any)
    .from('menu_items')
    .select('*')
    .in('id', menuItemIds)
    .eq('restaurant_id', restaurantId);

  if (itemsError || !dbItems || dbItems.length !== cartItems.length) {
    throw new Error('Some items in your cart are no longer available');
  }

  let subtotal = 0;
  const verifiedOrderItems = [];

  for (const cartItem of cartItems) {
    const dbItem = (dbItems as any[]).find((i) => i.id === cartItem.id);
    if (!dbItem || !dbItem.is_available) {
      throw new Error(`Item ${dbItem?.name || ''} is currently sold out`);
    }

    // Verify price tampering prevention
    if (dbItem.price_pkr !== cartItem.price_pkr) {
      throw new Error(`Price mismatch detected for ${dbItem.name}. Please refresh your cart.`);
    }

    const itemTotal = dbItem.price_pkr * cartItem.quantity;
    subtotal += itemTotal;

    verifiedOrderItems.push({
      menu_item_id: dbItem.id,
      name_snapshot: dbItem.name,
      price_snapshot: dbItem.price_pkr,
      quantity: cartItem.quantity,
      total_price: itemTotal,
    });
  }

  const deliveryFee = 150; // Base delivery fee in PKR
  const totalAmount = subtotal + deliveryFee;

  // Generate order reference
  const timestamp = new Date().toISOString().replace(/[-:T.]/g, '').slice(0, 14);
  const randomSuffix = Math.floor(1000 + Math.random() * 9000);
  const orderReference = `FV-${timestamp}-${randomSuffix}`;

  // 4. Create Order
  const { data: order, error: orderError } = await (supabase as any)
    .from('orders')
    .insert({
      customer_id: user.id,
      restaurant_id: restaurantId,
      order_reference: orderReference,
      current_status: 'pending_confirmation',
      subtotal_pkr: subtotal,
      delivery_fee_pkr: deliveryFee,
      total_amount_pkr: totalAmount,
      delivery_address_snapshot: address,
      payment_method: 'cash_on_delivery',
      payment_status: 'pending',
    })
    .select()
    .single();

  if (orderError || !order) {
    throw new Error(orderError?.message || 'Failed to create order');
  }

  // 5. Create Order Items
  const orderItemsPayload = verifiedOrderItems.map((vi) => ({
    order_id: order.id,
    menu_item_id: vi.menu_item_id,
    name_snapshot: vi.name_snapshot,
    price_snapshot: vi.price_snapshot,
    quantity: vi.quantity,
    total_price: vi.total_price,
  }));

  const { error: itemsInsertError } = await (supabase as any)
    .from('order_items')
    .insert(orderItemsPayload);

  if (itemsInsertError) {
    throw new Error('Failed to save order items');
  }

  // 6. Create initial status history
  await (supabase as any).from('order_status_history').insert({
    order_id: order.id,
    status: 'pending_confirmation',
    changed_by_user_id: user.id,
    notes: 'Order placed by customer',
  });

  return {
    orderId: order.id,
    orderReference: order.order_reference,
    totalAmount,
  };
}
