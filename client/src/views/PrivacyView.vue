<script setup lang="ts">
import SEOHead from "@/components/common/SEOHead.vue";
import { useConstantsStore } from "@/stores/constants";
import { CALCULATOR_SPECS } from "@/data/serviceSpec";

const constantsStore = useConstantsStore();
</script>

<template>
  <SEOHead
    title="개인정보 처리방침"
    description="shakilabs.com/travel의 개인정보 처리방침입니다. 수하물·통신·환전 계산기가 받는 입력값의 브라우저 내 처리 원칙, 여행 앱이지만 여권·예약 정보를 받지 않는 이유, 제3자 광고 쿠키와 맞춤 광고 해제 방법을 안내합니다."
  />

  <div class="container py-5">
    <div class="retro-panel">
      <div class="retro-titlebar rounded-t-2xl">
        <h1 class="retro-title">개인정보 처리방침</h1>
      </div>

      <div class="retro-panel-content space-y-4">
        <p class="text-body text-muted-foreground">
          shakilabs.com/travel(이하 "본 서비스")은 위탁수하물·해외 데이터·환전 비용을 비교하는
          계산 도구입니다. 여행 서비스라는 이름 때문에 예약 정보를 다룰 것으로 오해하기 쉬우므로,
          본 방침은 무엇을 받지 않는지부터 먼저 밝힙니다.
        </p>

        <h2 class="text-heading font-bold">1. 본 서비스가 요구하지 않는 정보</h2>
        <p class="text-body text-muted-foreground">
          본 서비스에는 예약·발권·결제 기능이 없습니다. 따라서 여권번호, 여권 영문 성명, 생년월일,
          항공권 예약번호(PNR), 탑승일과 편명, 숙소 주소, 결제 카드번호를 요구하지 않으며 이런 값을
          입력할 칸 자체가 화면에 존재하지 않습니다. 회원가입·로그인도 없어 이름·이메일 주소·연락처
          같은 계정 정보 역시 수집하지 않습니다. 항공권이나 eSIM을 실제로 구매하려면 각 항공사·판매처
          사이트로 이동해야 하며, 그곳에서 요구하는 정보는 해당 사업자가 자체 방침에 따라 처리합니다.
        </p>

        <h2 class="text-heading font-bold">2. 계산기에 입력하는 값의 처리</h2>
        <p class="text-body text-muted-foreground">
          아래 항목이 본 서비스가 화면에서 받는 입력값 전부이며, 모두 이용자의 브라우저 안에서만
          연산됩니다. 서버로 전송되지 않고, 어떤 데이터베이스에도 저장되지 않으며, 새로 고침하면
          기본값으로 돌아갑니다.
        </p>
        <ul class="text-body text-muted-foreground space-y-1 list-disc list-inside">
          <li v-for="spec in CALCULATOR_SPECS" :key="spec.key">
            <span class="font-bold">{{ spec.title }}</span> — {{ spec.inputs.join(", ") }}
          </li>
        </ul>
        <p class="text-body text-muted-foreground">
          본 서비스는 계산 조건을 페이지 주소(URL)에 쿼리 파라미터로 붙이지 않습니다. 따라서 계산
          화면의 링크를 그대로 복사해 공유해도 몇 명이 며칠 일정으로 얼마를 환전하려 했는지 같은
          여행 조건이 주소에 남지 않습니다.
        </p>

        <h2 class="text-heading font-bold">3. 브라우저에 저장되는 값</h2>
        <p class="text-body text-muted-foreground">
          본 서비스가 이용자의 기기에 저장하는 값은 화면 테마(밝게·어둡게) 선택 한 가지와 안내
          창을 닫은 시각뿐입니다. 두 값 모두 브라우저의 로컬 저장소에 남고 서버로 전송되지 않으며,
          브라우저의 사이트 데이터 삭제 기능으로 언제든지 지울 수 있습니다. 계산에 입력한 인원·금액·
          일정은 저장 대상이 아닙니다.
        </p>

        <h2 class="text-heading font-bold">4. 자동으로 수집되는 접속 기록</h2>
        <p class="text-body text-muted-foreground">
          서비스 개선을 위해 Google Analytics 4를 사용하며, 방문한 계산기 페이지, 체류 시간,
          브라우저·기기 유형, 대략적인 접속 지역 등 개인을 직접 식별할 수 없는 정보가 수집될 수
          있습니다. 계산기 이용 여부를 확인하는 이벤트도 함께 기록되지만, 이 이벤트에는 어떤
          계산기를 열었는지와 상호작용이 있었다는 사실만 담기며 이용자가 입력한 인원·데이터
          사용량·환전 금액은 포함되지 않습니다. 여행 중 해외에서 접속하면 접속 지역이 국가 단위로
          다르게 기록될 수 있으나, 이 역시 통계 목적의 비식별 정보입니다. Google의 데이터 처리에
          관한 자세한 내용은
          <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" class="retro-link">
            Google 개인정보 처리방침</a>에서 확인할 수 있습니다.
        </p>

        <h2 class="text-heading font-bold">5. 제3자 광고와 쿠키 (Google AdSense)</h2>
        <p class="text-body text-muted-foreground">
          본 서비스는 무료 운영 재원을 마련하기 위해 Google AdSense 광고를 게재하며, 이와 관련하여
          다음 사항을 알려드립니다.
        </p>
        <ul class="text-body text-muted-foreground space-y-1 list-disc list-inside">
          <li>
            Google을 포함한 제3자 광고 사업자는 쿠키를 사용하여 이용자가 본 서비스 또는 다른
            웹사이트를 방문한 기록을 기반으로 광고를 게재합니다.
          </li>
          <li>
            Google은 광고 쿠키를 사용하여 이용자의 본 사이트 및 다른 사이트 방문 기록에 기반한
            맞춤 광고를 제공합니다.
          </li>
          <li>
            이용자는
            <a href="https://adssettings.google.com" target="_blank" rel="noopener noreferrer" class="retro-link">Google 광고 설정(adssettings.google.com)</a>에서
            맞춤 광고를 해제할 수 있으며,
            <a href="https://www.aboutads.info/choices" target="_blank" rel="noopener noreferrer" class="retro-link">aboutads.info/choices</a>에서
            제3자 광고 사업자의 맞춤 광고용 쿠키 사용을 일괄 거부할 수 있습니다.
          </li>
          <li>
            맞춤 광고를 해제해도 광고 자체는 계속 표시될 수 있으며, 이 경우 관심사와 무관한 일반
            광고가 노출됩니다. 쿠키를 거부해도 세 계산기의 이용에는 제한이 없습니다.
          </li>
        </ul>
        <p class="text-body text-muted-foreground">
          광고는 계산 결과·본문과 구분되는 위치에만 게재하며, 오류(404) 화면처럼 읽을 내용이 없는
          페이지에는 광고를 싣지 않습니다. Google의 광고 데이터 처리 방식은
          <a href="https://policies.google.com/technologies/ads" target="_blank" rel="noopener noreferrer" class="retro-link">
            Google 광고 기술 정책</a>에 설명되어 있습니다.
        </p>

        <h2 class="text-heading font-bold">6. 이용 목적과 보유 기간</h2>
        <p class="text-body text-muted-foreground">
          자동 수집되는 접속 통계는 어떤 계산기가 실제로 쓰이는지 파악해 가정값 갱신 우선순위를
          정하고, 오류를 진단하며, 광고 성과를 측정하는 목적으로만 이용합니다. 본 서비스가 자체
          데이터베이스에 보관하는 개인정보는 없으므로 별도의 파기 절차 대상이 없으며, Google
          Analytics와 AdSense를 통해 수집되는 비식별 데이터는 각 서비스의 보유 정책에 따라 기간이
          지나면 파기됩니다.
        </p>

        <h2 class="text-heading font-bold">7. 제3자 제공과 국외 이전</h2>
        <p class="text-body text-muted-foreground">
          본 서비스는 법령에 근거한 경우를 제외하고 수집된 정보를 제3자에게 제공하거나 판매하지
          않습니다. 다만 위 4·5항의 통계·광고 도구는 Google LLC가 운영하는 국외 서버에서 접속 기록과
          쿠키 식별자를 처리합니다. 이전 목적은 통계 분석과 광고 게재이고 보유 기간은 각 사업자의
          정책을 따르며, 이전을 원하지 않는 이용자는 아래 8항의 방법으로 수집을 거부할 수 있습니다.
        </p>

        <h2 class="text-heading font-bold">8. 이용자의 권리와 행사 방법</h2>
        <ul class="text-body text-muted-foreground space-y-1 list-disc list-inside">
          <li>브라우저 설정에서 쿠키를 차단하거나 저장된 쿠키·사이트 데이터를 삭제할 수 있습니다.</li>
          <li>위 5항의 두 링크로 맞춤 광고를 언제든지 해제할 수 있습니다.</li>
          <li>
            통계 수집을 원하지 않으면
            <a href="https://tools.google.com/dlpage/gaoptout" target="_blank" rel="noopener noreferrer" class="retro-link">Google Analytics 차단 브라우저 부가기능</a>을
            설치할 수 있습니다.
          </li>
          <li>
            개인정보 처리에 관한 열람·정정·삭제를 요청하려면 아래 연락처로 문의해 주세요. 본
            서비스는 개인을 식별하는 자료를 보관하지 않으므로 확인 가능한 범위에서 지체 없이
            조치합니다.
          </li>
        </ul>
        <p class="text-body text-muted-foreground">
          본 서비스는 만 14세 미만 아동을 대상으로 하지 않으며, 아동의 개인정보를 알면서 수집하지
          않습니다.
        </p>

        <h2 class="text-heading font-bold">9. 안전성 확보 조치</h2>
        <p class="text-body text-muted-foreground">
          모든 페이지는 HTTPS로 암호화되어 전송되며 HSTS를 비롯한 표준 보안 헤더를 적용합니다.
          계산 로직 전체가 브라우저 안에서만 동작하도록 설계한 것이 본 서비스의 가장 근본적인
          보호 장치입니다. 전송할 개인정보가 없으면 유출될 개인정보도 없기 때문입니다.
        </p>

        <h2 class="text-heading font-bold">10. 방침 변경 고지</h2>
        <p class="text-body text-muted-foreground">
          본 방침이 변경되면 변경 내용과 시행일을 이 페이지에 게시합니다. 계산기가 새로 받는 입력
          항목이 생기거나 사용하는 제3자 도구가 바뀌는 경우에는 해당 내용을 위 2·4·5항에 반영합니다.
        </p>

        <h2 class="text-heading font-bold">11. 문의</h2>
        <p class="text-body text-muted-foreground">
          운영: ShakiLabs · 문의:
          <a :href="`mailto:${constantsStore.supportEmail}`" class="retro-link">
            {{ constantsStore.supportEmail }}
          </a>
        </p>
        <p class="text-body text-muted-foreground">
          개인정보 처리에 관한 문의는 위 연락처로 보내주시면 영업일 기준 24~48시간 이내에
          답변드립니다.
        </p>

        <p class="text-tiny text-muted-foreground mt-6">
          시행일: 2026년 8월 10일 (최초 시행일: 2026년 3월 15일 · 직전 개정일: 2026년 8월 5일)
        </p>
      </div>
    </div>
  </div>
</template>
