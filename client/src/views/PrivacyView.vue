<script setup lang="ts">
import SEOHead from "@/components/common/SEOHead.vue";
import { useConstantsStore } from "@/stores/constants";

const constantsStore = useConstantsStore();
</script>

<template>
  <SEOHead
    title="개인정보 처리방침"
    description="shakilabs.com/travel의 개인정보 처리방침입니다. 여행 경비 계산 입력값의 브라우저 내 처리 원칙, 쿠키와 제3자 광고(Google AdSense), 맞춤 광고 해제 방법과 이용자의 권리를 안내합니다."
  />

  <div class="container py-5">
    <div class="retro-panel">
      <div class="retro-titlebar rounded-t-2xl">
        <h1 class="retro-title">개인정보 처리방침</h1>
      </div>

      <div class="retro-panel-content space-y-4">
        <p class="text-body text-muted-foreground">
          shakilabs.com/travel(이하 "본 서비스")은 이용자의 개인정보를 중요하게 생각하며,
          개인정보 보호 관련 법령을 준수합니다. 본 방침은 서비스가 어떤 정보를 다루고
          어떻게 처리하는지, 이용자가 어떤 권리를 행사할 수 있는지를 설명합니다.
        </p>

        <h2 class="text-heading font-bold">1. 수집하지 않는 정보 — 여행 경비 계산 입력값</h2>
        <p class="text-body text-muted-foreground">
          위탁수하물 계산의 여행 인원·가방 개수·무게 구간, eSIM/로밍 비교의 여행 일수·데이터
          사용량, 환전 비교의 환전 금액·통화 등 이용자가 계산기에 입력하는 모든 값은
          이용자의 브라우저 안에서만 연산되며, 서버로 전송되지 않고 어떠한 데이터베이스에도
          저장되지 않습니다. 본 서비스는 회원가입·로그인 기능이 없어 이름, 이메일 주소,
          연락처 같은 계정 정보도 수집하지 않습니다. 계산 조건은 공유 편의를 위해 페이지
          주소(URL)의 쿼리 파라미터로만 반영되며, 이 역시 서버에 별도로 기록되지 않습니다.
        </p>

        <h2 class="text-heading font-bold">2. 자동으로 수집되는 정보</h2>
        <p class="text-body text-muted-foreground">
          서비스 개선을 위해 Google Analytics를 사용하며, 이를 통해 방문 페이지, 체류 시간,
          브라우저·기기 유형, 대략적인 접속 지역 등 개인을 직접 식별할 수 없는 비식별
          데이터가 수집될 수 있습니다. 이 정보는 익명화된 통계 형태로만 처리되며 특정 개인을
          추적하거나 식별하는 목적으로 사용하지 않습니다. Google의 데이터 처리에 대한 자세한
          내용은
          <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" class="retro-link">
            Google 개인정보 처리방침</a>을 참조하세요.
        </p>

        <h2 class="text-heading font-bold">3. 쿠키와 제3자 광고 (Google AdSense)</h2>
        <p class="text-body text-muted-foreground">
          본 서비스는 무료 운영을 위해 Google AdSense 광고를 게재하며, 이와 관련하여 다음
          사항을 알려드립니다.
        </p>
        <ul class="text-body text-muted-foreground space-y-1 list-disc list-inside">
          <li>
            Google을 포함한 제3자 광고 사업자는 쿠키를 사용하여 이용자가 본 서비스 또는
            다른 웹사이트를 방문한 기록을 기반으로 광고를 게재합니다.
          </li>
          <li>
            Google은 광고 쿠키를 사용하여 이용자의 본 사이트 및 다른 사이트 방문 기록에
            기반한 맞춤 광고를 제공합니다.
          </li>
          <li>
            이용자는
            <a href="https://adssettings.google.com" target="_blank" rel="noopener noreferrer" class="retro-link">Google 광고 설정(adssettings.google.com)</a>에서
            맞춤 광고를 해제할 수 있으며,
            <a href="https://www.aboutads.info/choices" target="_blank" rel="noopener noreferrer" class="retro-link">aboutads.info/choices</a>에서
            제3자 광고 사업자의 맞춤 광고용 쿠키 사용을 일괄 거부할 수 있습니다.
          </li>
          <li>
            브라우저 설정에서 쿠키 저장을 거부하거나 저장된 쿠키를 삭제할 수 있습니다.
            쿠키를 거부해도 계산 기능 이용에는 제한이 없습니다.
          </li>
        </ul>
        <p class="text-body text-muted-foreground">
          Google의 광고 데이터 처리에 대한 자세한 내용은
          <a href="https://policies.google.com/technologies/ads" target="_blank" rel="noopener noreferrer" class="retro-link">
            Google 광고 기술 정책</a>에서 확인할 수 있습니다.
        </p>

        <h2 class="text-heading font-bold">4. 수집 목적과 보유·파기</h2>
        <p class="text-body text-muted-foreground">
          자동 수집되는 접속 통계는 서비스 개선, 오류 진단, 콘텐츠 품질 향상, 광고 성과 측정
          목적으로만 이용됩니다. 본 서비스는 개인을 식별할 수 있는 정보를 직접 수집·보관하지
          않으므로 별도의 파기 대상 개인정보가 없으며, Google Analytics 및 AdSense를 통해
          수집되는 비식별 데이터는 각 서비스의 보유 정책에 따라 보존 기간이 지나면 파기됩니다.
        </p>

        <h2 class="text-heading font-bold">5. 이용자의 권리</h2>
        <ul class="text-body text-muted-foreground space-y-1 list-disc list-inside">
          <li>브라우저 설정에서 쿠키를 차단하거나 삭제할 수 있습니다.</li>
          <li>위 3항의 링크를 통해 언제든지 맞춤 광고를 해제할 수 있습니다.</li>
          <li>Google Analytics 수집을 원하지 않는 경우
            <a href="https://tools.google.com/dlpage/gaoptout" target="_blank" rel="noopener noreferrer" class="retro-link">Google Analytics 차단 브라우저 부가기능</a>을
            설치할 수 있습니다.
          </li>
          <li>개인정보 관련 열람·정정·삭제를 요청하려면 아래 연락처로 문의해 주세요.
            확인 가능한 범위에서 지체 없이 처리합니다.</li>
        </ul>
        <p class="text-body text-muted-foreground">
          본 서비스는 만 14세 미만 아동의 개인정보를 의도적으로 수집하지 않습니다.
        </p>

        <h2 class="text-heading font-bold">6. 제3자 제공과 처리 위탁</h2>
        <p class="text-body text-muted-foreground">
          본 서비스는 법령에 근거한 경우를 제외하고 수집된 정보를 제3자에게 제공하지 않습니다.
          다만 광고(Google AdSense)와 트래픽 분석(Google Analytics) 도구는 각 사업자의 쿠키를
          통해 정보를 처리하며, 이 경우 해당 사업자의 개인정보 처리방침이 적용됩니다.
        </p>

        <h2 class="text-heading font-bold">7. 방침 변경 고지</h2>
        <p class="text-body text-muted-foreground">
          본 개인정보 처리방침이 변경되는 경우, 변경 사항을 본 페이지에 게시하며
          시행일을 갱신합니다.
        </p>

        <h2 class="text-heading font-bold">8. 문의</h2>
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
          시행일: 2026년 8월 5일 (최초 시행일: 2026년 3월 15일)
        </p>
      </div>
    </div>
  </div>
</template>
