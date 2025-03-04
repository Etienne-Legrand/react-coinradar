import { useState, memo, useId } from "react";
import {
  useFloating,
  autoUpdate,
  offset,
  flip,
  shift,
  useHover,
  useFocus,
  useInteractions,
  FloatingPortal,
} from "@floating-ui/react";

interface TooltipProps {
  readonly content: string;
  readonly children: React.ReactElement;
  readonly open?: boolean;
  readonly onOpenChange?: (open: boolean) => void;
}

export const Tooltip = memo(function Tooltip({
  content,
  children,
  open: externalOpen,
  onOpenChange,
}: TooltipProps) {
  const tooltipId = useId();
  const [internalOpen, setInternalOpen] = useState(false);
  const isShown = externalOpen ?? internalOpen;

  const handleOpenChange = onOpenChange ?? setInternalOpen;

  const { refs, floatingStyles, context } = useFloating({
    open: isShown,
    onOpenChange: handleOpenChange,
    placement: "top",
    whileElementsMounted: autoUpdate,
    middleware: [offset(8), flip(), shift()],
  });

  const hover = useHover(context);
  const focus = useFocus(context);
  const { getReferenceProps, getFloatingProps } = useInteractions([
    hover,
    focus,
  ]);

  return (
    <>
      <div
        ref={refs.setReference}
        {...getReferenceProps()}
        aria-describedby={isShown ? tooltipId : undefined}
      >
        {children}
      </div>
      <FloatingPortal>
        {isShown && (
          <div
            id={tooltipId}
            role="tooltip"
            ref={refs.setFloating}
            style={floatingStyles}
            {...getFloatingProps()}
            className="z-50 rounded-md bg-gray-200 px-3 py-1.5 text-sm shadow-lg dark:bg-gray-700 dark:text-white"
          >
            {content}
          </div>
        )}
      </FloatingPortal>
    </>
  );
});
