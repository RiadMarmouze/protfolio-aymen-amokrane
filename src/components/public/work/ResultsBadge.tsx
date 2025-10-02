import { memo } from "react";

export const ResultsBadge = memo(function ResultsBadge({
  count,
}: {
  count: number;
}) {
  return <span aria-live="polite">{count} results</span>;
});
