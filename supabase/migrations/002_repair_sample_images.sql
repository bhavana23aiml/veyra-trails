update public.treks
set image = 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1600&q=85',
    updated_at = now()
where is_sample = true
  and image = 'https://images.unsplash.com/photo-1469817805249-72b7df7d0db3?auto=format&fit=crop&w=1400&q=85';
