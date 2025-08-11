type StatusBadgeProps = {
  online: boolean;
};

export default function StatusBadge({ online }: StatusBadgeProps) {
  return (
    <span
      className={
        "inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs " +
        (online
          ? "border-emerald-800/40 bg-emerald-900/30 text-emerald-200"
          : "border-amber-800/40 bg-amber-900/30 text-amber-200")
      }
      title={online ? "Canlı bağlantı" : "Bağlantı sorunlu"}
    >
      <span
        className={
          "h-1.5 w-1.5 rounded-full " + (online ? "bg-emerald-400" : "bg-amber-400")
        }
      />
      {online ? "Online" : "Reconnecting"}
    </span>
  );
}


