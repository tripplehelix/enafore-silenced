export function peek (arr) {
  const result = []
  for (let i = 0; i < arr.length; i++) {
    result.push([arr[i - 1], arr[i], arr[i + 1]])
  }
  return result
}
