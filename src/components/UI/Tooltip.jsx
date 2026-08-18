import * as RadixTooltip from "@radix-ui/react-tooltip";

export function TooltipProvider({ children }) {
    return <RadixTooltip.Provider delayDuration={300} skipDelayDuration={100}>{children}</RadixTooltip.Provider>;
}

export default function Tooltip({ content, children, side = "top" }) {
    if (!content) return children;

    return (
        <RadixTooltip.Root>
            <RadixTooltip.Trigger asChild>{children}</RadixTooltip.Trigger>
            <RadixTooltip.Portal>
                <RadixTooltip.Content
                    side={side}
                    sideOffset={6}
                    collisionPadding={8}
                    className="tooltip-content z-100 select-none rounded-md bg-gray-900 dark:bg-gray-700 px-2.5 py-1.5 text-xs font-medium text-white shadow-lg"
                >
                    {content}
                    <RadixTooltip.Arrow className="fill-gray-900 dark:fill-gray-700" />
                </RadixTooltip.Content>
            </RadixTooltip.Portal>
        </RadixTooltip.Root>
    );
}
