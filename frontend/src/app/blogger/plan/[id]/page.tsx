import { BloggerPlanDetailContent } from './content';

export function generateStaticParams() {
  return Array.from({ length: 10 }, (_, i) => ({ id: String(i + 1) }));
}

export default function BloggerPlanDetailPage({ params }: { params: Promise<{ id: string }> }) {
  return <BloggerPlanDetailContent params={params} />;
}
