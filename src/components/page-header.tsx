export function PageHeader({ title, description }: { title: string; description: string }) {
  return (
    <div className="mb-5 flex flex-col gap-1 border-b border-blue-100 pb-4">
      <h1 className="text-2xl font-semibold text-slate-900 md:text-3xl">{title}</h1>
      <p className="max-w-2xl text-sm leading-6 text-slate-500">{description}</p>
    </div>
  );
}
