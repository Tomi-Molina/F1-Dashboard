export default function LoadingSpinner({ message = "Loading..." }) {
  return (
    <div className="flex flex-col items-center justify-center py-24 gap-4">
      <div className="relative w-10 h-10">
        <div className="absolute inset-0 border-2 border-border rounded-full" />
        <div className="absolute inset-0 border-2 border-transparent border-t-f1-red rounded-full animate-spin" />
      </div>
      <p className="text-neutral-500 text-sm font-mono">{message}</p>
    </div>
  );
}
