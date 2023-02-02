export const formatOrders = (orders: any) => {
  if (!orders?.length) return;

  return orders.map((order: any, index: number) => {
    return {
      key: `${order.Id}-${index}`,
      ...order
    };
  });
};

export const getFlagEmoji = (countryCode: string) => {
  if (!countryCode) return;

  const codePoints = countryCode
    .trim()
    .toUpperCase()
    .split("")
    .map((char: string) => 127397 + char.charCodeAt(0));
  return String.fromCodePoint(...codePoints);
};

export const filterByCharacter = (sortingCriteriaA: any, sortingCriteriaB: any) => {
  
  let aLen = sortingCriteriaA.length;
  let bLen = sortingCriteriaB.length;

  for (let i = 0; (i < aLen && i < bLen); i++){
    if (sortingCriteriaA[i] != sortingCriteriaB[i]){
      return (sortingCriteriaA.charCodeAt(i) - sortingCriteriaB.charCodeAt(i));
    }
  }
  return (0);
}