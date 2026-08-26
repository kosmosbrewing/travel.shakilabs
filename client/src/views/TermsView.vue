<script setup lang="ts">
import SEOHead from "@/components/common/SEOHead.vue";
import { useConstantsStore } from "@/stores/constants";

const constantsStore = useConstantsStore();
</script>

<template>
  <SEOHead
    title="이용약관"
    description="shakilabs.com/travel의 서비스 이용약관입니다. 수하물·eSIM·환전 계산 결과의 성격(예산 시나리오), 항공사 운송약관·통신사 요금제·은행 고시환율이 우선한다는 점, 광고 게재와 면책 범위를 안내합니다."
  />

  <div class="container py-5">
    <div class="retro-panel">
      <div class="retro-titlebar rounded-t-2xl">
        <h1 class="retro-title">이용약관</h1>
      </div>

      <div class="retro-panel-content space-y-4">
        <p class="text-body text-muted-foreground">
          shakilabs.com/travel(이하 "본 서비스")을 이용해 주셔서 감사합니다. 본 서비스에 접속하여
          계산 기능을 이용하는 경우 아래 약관에 동의한 것으로 봅니다.
        </p>

        <h2 class="text-heading font-bold">1. 서비스 개요</h2>
        <p class="text-body text-muted-foreground">
          본 서비스는 출국 전에 결정해야 하는 세 가지 비용 — 위탁수하물 예산, 해외 데이터 옵션
          (eSIM·통신사 로밍·포켓와이파이), 환전 우대율별 수수료 — 을 같은 기준으로 나열해 비교하는
          무료 계산 도구입니다. 회원가입 없이 누구나 이용할 수 있고, 입력값은 서버로 전송되지 않고
          브라우저 안에서만 처리됩니다. 본 서비스는 항공권·숙소·통신 상품의 예약이나 결제를
          대행하지 않으며, 여행업 등록 사업자가 아닙니다.
        </p>

        <h2 class="text-heading font-bold">2. 계산 결과의 성격 — 견적이 아닌 예산 시나리오</h2>
        <p class="text-body text-muted-foreground">
          본 서비스가 표시하는 금액은 특정 사업자가 이용자에게 제시한 견적이 아니라, 공개된 요금
          구조를 단순화한 가정값으로 계산한 예산 시나리오입니다. 수하물 요금은 항공사별 확정
          요금표가 아닌 낮음·중간·높음 세 구간의 예산 가정이고, 통신 요금은 대표 요금제를 용량과
          기간으로 단순화한 값이며, 환전은 통화별 대표 스프레드에 우대율을 적용한 추정치입니다.
          따라서 계산 결과를 근거로 특정 사업자에게 같은 금액을 요구할 수 없습니다.
        </p>

        <h2 class="text-heading font-bold">3. 각 사업자의 약관이 우선합니다</h2>
        <p class="text-body text-muted-foreground">
          본 서비스의 설명과 실제 조건이 다를 경우 언제나 아래의 공식 문서가 우선합니다.
        </p>
        <ul class="text-body text-muted-foreground space-y-1 list-disc list-inside">
          <li>
            <span class="font-bold">수하물</span> — 무료 허용량, 초과 요금, 가방 크기·개수 제한,
            사전 구매 마감 시각과 공항 현장 요금은 각 항공사의 운송약관과 요금표에 따릅니다. 본
            서비스는 기내 반입 규격, 특수 수하물(악기·스포츠 장비·반려동물), 위험물 규정을 다루지
            않습니다.
          </li>
          <li>
            <span class="font-bold">해외 데이터</span> — eSIM은 단말기의 eSIM 지원 여부와 통신사
            잠금 해제 상태에 따라 사용이 불가능할 수 있으며, 현지 통신망의 속도·커버리지는 본
            서비스가 보증하지 않습니다. 요금제 구성과 데이터 소진 후 정책은 각 통신사·판매처의
            약관에 따릅니다.
          </li>
          <li>
            <span class="font-bold">환전</span> — 실제 적용 환율과 우대율은 각 은행·환전소가 고시
            시점마다 정하며, 앱 전용 우대·이벤트 우대·공항 지점 별도 요율 등으로 달라집니다. 본
            서비스는 특정 은행을 지정하거나 추천하지 않습니다.
          </li>
        </ul>

        <h2 class="text-heading font-bold">4. 다루지 않는 영역</h2>
        <p class="text-body text-muted-foreground">
          비자·입국 요건, 검역과 통관 규정, 여행경보 단계, 여행자보험 보장 범위는 본 서비스의 범위
          밖입니다. 해당 사항은 외교부·법무부·관세청 등 관계 기관의 공식 안내를 확인해야 하며, 본
          서비스의 어떤 문장도 그 안내를 대신하지 않습니다.
        </p>

        <h2 class="text-heading font-bold">5. 면책 조항</h2>
        <ul class="text-body text-muted-foreground space-y-1 list-disc list-inside">
          <li>
            계산 결과는 참고용이며 실제 결제 금액과 차이가 있을 수 있습니다. 프로모션, 실시간 환율,
            카드사 제휴 할인, 현장 발권 수수료는 계산에 반영되지 않습니다.
          </li>
          <li>
            요금 가정값과 환율은 공개 정보를 기준으로 사람이 확인한 시점에만 갱신하며, 정해진
            점검 주기나 자동 수집 수단이 없습니다. 따라서 사업자의 변경 사항이 즉시 반영되지
            않을 수 있습니다. 각 계산기 화면 상단에는 그 값을 마지막으로 확인한 날짜를 표시합니다.
          </li>
          <li>
            운영자는 계산 결과와 콘텐츠의 정확성·완전성·최신성을 유지하기 위해 노력하지만 이를
            법적으로 보증하지 않으며, 본 서비스의 정보를 근거로 한 예약·환전·구매 결정과 그로 인한
            손해에 대해 고의 또는 중대한 과실이 없는 한 책임을 지지 않습니다.
          </li>
          <li>
            무료 서비스 특성상 시스템 점검, 장애, 불가항력으로 인한 일시적 중단에 대해서도 같습니다.
          </li>
        </ul>

        <h2 class="text-heading font-bold">6. 광고와 외부 링크</h2>
        <p class="text-body text-muted-foreground">
          본 서비스는 무료 운영 재원을 마련하기 위해 Google AdSense 등 제3자 광고를 게재합니다.
          광고 영역은 계산 결과·본문과 구분되어 표시되며, 광고에 소개되는 상품·서비스는 운영자가
          보증하는 것이 아닙니다. 이용자가 광고를 통해 광고주와 거래하는 경우 그 책임은 이용자와
          광고주에게 있습니다. 항공사·통신사 공식 페이지로 연결되는 링크는 요금 확인을 돕기 위한
          것으로 현재 제휴 수수료를 받지 않으며, 향후 수수료를 받는 링크를 게재하게 되면 해당
          화면에 그 사실을 표시합니다. 맞춤 광고와 해제 방법은 개인정보 처리방침에서 안내합니다.
        </p>

        <h2 class="text-heading font-bold">7. 지식재산권</h2>
        <p class="text-body text-muted-foreground">
          본 서비스의 디자인, 코드, 계산 로직, 가이드 문서에 대한 권리는 운영자에게 있습니다. 계산
          결과의 공유·인용은 자유롭게 가능하나 출처와 확인 시점을 함께 표기해 주시고, 서비스 자체의
          복제·재배포는 금지합니다. 인용한 항공사·공공기관 자료의 권리는 각 권리자에게 있습니다.
        </p>

        <h2 class="text-heading font-bold">8. 이용자의 의무</h2>
        <p class="text-body text-muted-foreground">
          이용자는 서비스의 안정적인 운영을 방해하는 행위를 해서는 안 됩니다. 과도한 자동화
          접근(크롤링·스크래핑), 서비스 역설계, 광고 시스템에 대한 부정 클릭 유도 등이 이에
          해당하며, 위반으로 발생한 손해는 해당 이용자가 부담합니다.
        </p>

        <h2 class="text-heading font-bold">9. 서비스 변경 및 중단</h2>
        <p class="text-body text-muted-foreground">
          운영자는 계산 기준, 가정값, 화면 구성을 사전 고지 없이 변경하거나 서비스를 중단할 수
          있습니다. 무료 서비스 특성상 변경·중단에 따른 별도 보상은 제공되지 않으나, 계산 결과에
          영향이 큰 기준 변경은 가능한 범위에서 화면에 안내합니다.
        </p>

        <h2 class="text-heading font-bold">10. 약관 변경과 준거법</h2>
        <p class="text-body text-muted-foreground">
          본 약관은 필요 시 변경될 수 있으며, 변경된 약관은 본 페이지에 게시하는 것으로 효력이
          발생합니다. 게시 이후 서비스를 계속 이용하는 경우 변경 약관에 동의한 것으로 봅니다. 본
          약관은 대한민국 법령에 따라 해석하며, 분쟁은 우선 협의로 해결하고 협의가 이루어지지 않는
          경우 민사소송법상 관할 법원에 소를 제기할 수 있습니다.
        </p>

        <h2 class="text-heading font-bold">11. 문의</h2>
        <p class="text-body text-muted-foreground">
          운영: ShakiLabs · 문의:
          <a :href="`mailto:${constantsStore.supportEmail}`" class="retro-link">
            {{ constantsStore.supportEmail }}
          </a>
        </p>
        <p class="text-body text-muted-foreground">
          약관과 서비스 이용에 관한 문의, 요금 가정값 오류 제보는 위 연락처로 보내주시면 영업일
          기준 24~48시간 이내에 답변드립니다.
        </p>

        <p class="text-tiny text-muted-foreground mt-6">
          시행일: 2026년 8월 10일 (최초 시행일: 2026년 3월 15일 · 직전 개정일: 2026년 8월 5일)
        </p>
      </div>
    </div>
  </div>
</template>
