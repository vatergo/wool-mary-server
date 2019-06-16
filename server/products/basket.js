const basket = {};

export function getAllProducts(userId) {
    return basket[userId];
};

export function deleteAllProducts(userId) {
    basket[userId] = undefined;
};

export function addProduct(userId, itemId) {
    if (!basket[userId]) basket[userId] = [];
    if (!basket[userId].includes(itemId))
        basket[userId].push(itemId);
    return basket[userId];
};

export function deleteProduct(userId, itemId) {
    basket[userId].splice(basket[userId].indexOf(itemId), 1);
    return basket[userId];
}

