export function StarRating({ value, size = "1em" }: { value: number; size?: string }) {
  return (
    <span aria-label={`${value.toFixed(1)} de 5 estrellas`} style={{ fontSize: size }}>
      {[1, 2, 3, 4, 5].map((n) => (
        <span key={n} className={n <= Math.round(value) ? "text-mustard" : "text-line-strong"}>
          ★
        </span>
      ))}
    </span>
  );
}
