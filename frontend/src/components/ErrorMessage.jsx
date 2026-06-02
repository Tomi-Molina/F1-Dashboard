export default function ErrorMessage({ message }) {
  return (
    <div className="flex flex-col items-center justify-center py-24 gap-3">
      <div className="w-10 h-10 rounded-full bg-f1-red/10 border border-f1-red/20 flex items-center justify-center">
        <span className="text-f1-red font-mono font-bold text-lg">!</span>
      </div>
      <p className="text-neutral-400 text-sm font-body">{message}</p>
      <p className="text-neutral-600 text-xs font-mono">
        Make sure the backend is running
      </p>
    </div>
  );
}
