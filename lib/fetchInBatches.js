export async function fetchInBatches(items, fetcher, batchSize = 5) {
  const results = [];
  for (let i = 0; i < items.length; i += batchSize) {
    const batch = items.slice(i, i + batchSize);
    const res = await Promise.all(batch.map(fetcher));
    results.push(...res);
  }
  return results;
}
