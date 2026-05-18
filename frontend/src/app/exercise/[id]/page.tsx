import { ExerciseDetailContent } from './content';

export function generateStaticParams() {
  return Array.from({ length: 30 }, (_, i) => ({ id: String(i + 1) }));
}

export default function ExerciseDetailPage({ params }: { params: Promise<{ id: string }> }) {
  return <ExerciseDetailContent params={params} />;
}
