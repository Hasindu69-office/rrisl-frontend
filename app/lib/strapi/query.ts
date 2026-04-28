export function buildQueryString(params: Record<string, string | undefined>): string {
  const queryParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      queryParams.append(key, value);
    }
  });

  return queryParams.toString();
}

export function buildPopulateQuery(fields: string[]): string {
  return fields
    .map((field, index) => `populate[${index}]=${encodeURIComponent(field)}`)
    .join('&');
}
