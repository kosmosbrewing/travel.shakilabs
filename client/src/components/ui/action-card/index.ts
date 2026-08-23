import { cva, type VariantProps } from "class-variance-authority";

export const actionCardVariants = cva(
  "group flex w-full flex-col rounded-[1.6rem] border p-4 text-left ring-offset-background transition-[background-color,border-color,transform,box-shadow] duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 active:scale-[0.995]",
  {
    variants: {
      variant: {
        default: "border-border/70 bg-card hover:-translate-y-[1px] hover:border-primary/25 hover:bg-muted/15 active:translate-y-0 active:border-primary/30 active:bg-muted/20",
        // rest /10 -> hover /15 -> active /20. 이전 hover /12는 스케일 밖이라 생성되지 않아
        // hover가 rest와 완전히 같은 색이었다(= hover 피드백 없음).
        accent: "border-primary/20 bg-primary/10 hover:-translate-y-[1px] hover:border-primary/35 hover:bg-primary/15 active:translate-y-0 active:border-primary/40 active:bg-primary/20",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export type ActionCardVariants = VariantProps<typeof actionCardVariants>;

export { default as ActionCard } from "./ActionCard.vue";
