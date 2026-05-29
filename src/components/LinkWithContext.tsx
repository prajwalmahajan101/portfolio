import { type ReactNode, forwardRef } from 'react';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

interface Props {
  /** href — mailto:, https:, or anchor */
  href: string;
  /** Visible label used in aria-label (`${label} — ${context}`) */
  label: string;
  /** One short sentence shown in the tooltip and appended to aria-label */
  context: string;
  /** Override the rendered children (icons + text). If omitted, just renders label. */
  children?: ReactNode;
  /** Forwarded to the anchor */
  className?: string;
  target?: string;
  rel?: string;
  /** Tooltip side; defaults to top */
  side?: 'top' | 'right' | 'bottom' | 'left';
  /** Forwarded to the anchor — keep existing data-cursor="hover" semantics */
  'data-cursor'?: string;
  onClick?: (e: React.MouseEvent<HTMLAnchorElement>) => void;
}

/**
 * Anchor with mandatory descriptive context.
 * - Wraps the anchor in a Radix tooltip (phosphor-mono themed via the shared
 *   TooltipContent in components/ui/tooltip.tsx).
 * - Sets aria-label to `${label} — ${context}` for screen readers.
 * - Inherits the existing TooltipProvider mounted in App.tsx.
 */
const LinkWithContext = forwardRef<HTMLAnchorElement, Props>(function LinkWithContext(
  { href, label, context, children, className, target, rel, side = 'top', onClick, ...rest },
  ref,
) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <a
          ref={ref}
          href={href}
          target={target}
          rel={rel}
          onClick={onClick}
          aria-label={`${label} — ${context}`}
          data-cursor={rest['data-cursor'] ?? 'hover'}
          className={cn('hover-rise inline-flex items-center', className)}
        >
          {children ?? label}
        </a>
      </TooltipTrigger>
      <TooltipContent side={side} className="border-primary/40 bg-background/95 normal-case tracking-[0.06em]">
        <span className="text-primary">▸</span>{' '}
        <span className="text-foreground/90">{context}</span>
      </TooltipContent>
    </Tooltip>
  );
});

export default LinkWithContext;
