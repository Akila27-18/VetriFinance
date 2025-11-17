// Map category name string to an asset path (place images in src/assets/categories/)
const map = {
Housing: '/src/assets/categories/housing.png',
Food: '/src/assets/categories/food.png',
Utilities: '/src/assets/categories/utilities.png',
Transport: '/src/assets/categories/transport.png',
Shopping: '/src/assets/categories/shopping.png',
Entertainment: '/src/assets/categories/entertainment.png',
};


export default function getCategoryIcon(category) {
if (!category) return '/src/assets/categories/other.png';
return map[category] || '/src/assets/categories/other.png';
}