import { onMounted } from "vue";
import { loadTravelExchangeRates, useExchangeBadgeMessage } from "@/data/exchangeRates";

export function useTravelExchangeRates() {
  const badgeMessage = useExchangeBadgeMessage();

  onMounted(() => {
    void loadTravelExchangeRates();
  });

  return {
    badgeMessage,
  };
}
