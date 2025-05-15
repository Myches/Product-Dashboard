
 interface Product {
id:number,
name:string,
description:string,
price:number,
category:string,
rating:number,
}

export async function fetchProducts(): Promise<Product[]> {
  const response = await fetch('https://mock-data-josw.onrender.com/products');
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return response.json();
}