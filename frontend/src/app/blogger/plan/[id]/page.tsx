import { BloggerPlanDetailContent } from './content';

export function generateStaticParams() {
  return Array.from({ length: 10 }, (_, i) => ({ id: String(i + 1) }));
}

export default async function BloggerPlanDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <BloggerPlanDetailContent id={id} />;
}
