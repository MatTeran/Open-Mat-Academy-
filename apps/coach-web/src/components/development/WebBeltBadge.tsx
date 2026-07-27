const BELT_COLORS: Record<
  string,
  { fill: string; stripe: string; border: string; label: string }
> = {
  white: {
    fill: '#F2F2F0',
    stripe: '#101C2E',
    border: 'rgba(212,175,55,0.55)',
    label: '#FFFFFF',
  },
  blue: {
    fill: '#1A4F9C',
    stripe: '#F4F4F4',
    border: 'rgba(212,175,55,0.4)',
    label: '#FFFFFF',
  },
  purple: {
    fill: '#5A2D82',
    stripe: '#F4F4F4',
    border: 'rgba(212,175,55,0.4)',
    label: '#FFFFFF',
  },
  brown: {
    fill: '#6B3F24',
    stripe: '#F4F4F4',
    border: 'rgba(212,175,55,0.4)',
    label: '#FFFFFF',
  },
  black: {
    fill: '#0E0E0E',
    stripe: '#F4F4F4',
    border: 'rgba(212,175,55,0.75)',
    label: '#5EEAD4',
  },
};

/**
 * Authentic BJJ belt mark:
 * long cloth body + rank sleeve on the right with tape-style stripes.
 */
export function WebBeltBadge({
  belt,
  stripes,
  size = 'md',
}: {
  belt: string;
  stripes: number;
  size?: 'sm' | 'md' | 'lg';
}) {
  const palette = BELT_COLORS[belt] ?? BELT_COLORS.white;
  const width = size === 'lg' ? 280 : size === 'sm' ? 180 : 236;
  const height = size === 'lg' ? 34 : size === 'sm' ? 22 : 28;
  const sleeve = size === 'lg' ? 78 : size === 'sm' ? 52 : 64;
  const tapeW = size === 'lg' ? 7 : 6;
  const tapeH = height - 10;

  return (
    <div className="space-y-3">
      <div
        className="relative overflow-hidden rounded-sm shadow-[inset_0_1px_0_rgba(255,255,255,0.12),0_8px_24px_rgba(0,0,0,0.35)]"
        style={{
          width,
          height,
          backgroundColor: palette.fill,
          border: `1px solid ${palette.border}`,
        }}
        aria-label={`${belt} belt with ${stripes} stripes`}
        role="img"
      >
        {/* woven sheen */}
        <div
          className="pointer-events-none absolute inset-0 opacity-30"
          style={{
            background:
              'linear-gradient(180deg, rgba(255,255,255,0.22) 0%, transparent 45%, rgba(0,0,0,0.18) 100%)',
          }}
        />
        {/* tip stitch */}
        <div
          className="absolute left-1.5 top-1/2 h-[55%] w-1 -translate-y-1/2 rounded-sm"
          style={{ backgroundColor: 'rgba(212,175,55,0.65)' }}
        />
        {/* rank sleeve */}
        <div
          className="absolute right-0 top-0 flex h-full items-center justify-center gap-[5px] border-l"
          style={{
            width: sleeve,
            borderColor: 'rgba(0,0,0,0.28)',
            background:
              belt === 'black'
                ? 'linear-gradient(90deg, rgba(20,20,20,0.95), rgba(30,30,30,0.98))'
                : 'linear-gradient(90deg, rgba(0,0,0,0.12), rgba(0,0,0,0.22))',
          }}
        >
          {Array.from({ length: 4 }).map((_, index) => {
            const filled = index < stripes;
            return (
              <span
                key={index}
                className="rounded-[1px]"
                style={{
                  width: tapeW,
                  height: tapeH,
                  backgroundColor: filled ? palette.stripe : 'transparent',
                  boxShadow: filled
                    ? 'inset 0 0 0 1px rgba(0,0,0,0.15)'
                    : `inset 0 0 0 1px ${palette.stripe}`,
                  opacity: filled ? 1 : 0.22,
                }}
              />
            );
          })}
        </div>
      </div>
      <p className="text-sm capitalize tracking-wide text-white">
        <span className="text-gold-bright">
          {belt.charAt(0).toUpperCase() + belt.slice(1)} Belt
        </span>
        <span className="text-mute">
          {' '}
          · {stripes} stripe{stripes === 1 ? '' : 's'}
        </span>
      </p>
    </div>
  );
}
