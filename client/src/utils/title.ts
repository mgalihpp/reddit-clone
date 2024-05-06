export const dynamicTitle = (
  title: string,
  opt?: { slug?: string },
): string => {
  return `${title} - ${opt?.slug ?? 'Beddit'}`;
};
