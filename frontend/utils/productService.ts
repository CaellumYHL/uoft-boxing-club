import fs from 'fs';
import path from 'path';
import { Product } from './data';

const dataFilePath = path.join(process.cwd(), 'data', 'products.json');

export function getProducts(): Product[] {
    try {
        const fileContents = fs.readFileSync(dataFilePath, 'utf8');
        return JSON.parse(fileContents);
    } catch (error) {
        console.error("Failed to read products.json", error);
        return [];
    }
}

export function getProductBySlug(slug: string): Product | undefined {
    const products = getProducts();
    return products.find((p) => p.id === slug);
}
