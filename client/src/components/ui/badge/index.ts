import { cva, type VariantProps } from "class-variance-authority";

export const badgeVariants = cva(
  "inline-flex items-center rounded-sm border px-2 py-0.5 text-caption font-bold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "border-transparent bg-primary text-primary-foreground",
        secondary: "border-transparent bg-secondary text-secondary-foreground",
        destructive: "border-transparent bg-destructive text-destructive-foreground",
        outline: "text-foreground",
        deduction: "border-transparent bg-deduction text-deduction-foreground",
        highlight: "border-transparent bg-highlight text-highlight-foreground",
        // muted-foreground/70 위의 흰 글씨는 라이트 3.37:1 · 다크 3.46:1로 양쪽 다 미달이었다.
        // 알파를 걷고 배경 토큰을 글자색으로 뒤집어 라이트 6.51:1 · 다크 8.64:1 확보.
        neutral: "border-border/50 bg-muted-foreground text-background",
        // /12는 Tailwind opacity 스케일 밖이라 배경이 생성되지 않았다 -> /10
        profit: "border-transparent bg-profit/10 text-profit",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export type BadgeVariants = VariantProps<typeof badgeVariants>;

export { default as Badge } from "./Badge.vue";
