import { cn } from "@/lib/utils";
export function Btn({
  className = "",
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...props}
      className={cn(
        "rounded-full border-2 border-black px-5 py-2 inline-flex items-center gap-2 transition hover:bg-black hover:text-white",
        className
      )}
    />
  );
}
export function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={cn("border rounded-xl px-3 py-2", props.className)}
    />
  );
}
export function Select(props: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      {...props}
      className={cn("border rounded-xl px-3 py-2", props.className)}
    />
  );
}
export function Field({
  label,
  children,
  className,
}: {
  label: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("grid gap-1", className)}>
      <label className="text-xs opacity-70">{label}</label>
      {children}
    </div>
  );
}
