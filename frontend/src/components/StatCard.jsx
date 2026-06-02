export default function StatCard({ label, value, sub, accent = false, className = "" }) {
  return (
    <div
      className={`card p-5 animate-fade-in-up opacity-0 ${
        accent ? "card-red" : ""
      } ${className}`}
    >
      <p className="text-xs font-body text-neutral-500 uppercase tracking-widest mb-2">
        {label}
      </p>
      <p
        className={`font-display font-bold text-3xl leading-none mb-1 ${
          accent ? "text-f1-red" : "text-white"
        }`}
      >
        {value}
      </p>
      {sub && (
        <p className="text-xs font-body text-neutral-500 mt-1">{sub}</p>
      )}
    </div>
  );
}
