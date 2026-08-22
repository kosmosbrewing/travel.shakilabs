import { nextTick } from "vue";
import type { Router, RouteRecordRaw } from "vue-router";
import { showAlert } from "@/composables/useAlert";
import { trackPageView } from "@/lib/analytics";
import { useAuthStore } from "@/stores/auth";

export const routes: RouteRecordRaw[] = [
  {
    // 리다이렉트였던 시절 "/"는 /luggage의 복제본으로 프리렌더되어 canonical이
    // /travel/luggage를 가리켰고, 그래서 사이트맵에서도 정당하게 빠져 있었다. 앱에서
    // 가장 권위 높은 URL이 색인 후보에서 통째로 누락된 상태였다.
    // 홈이 자기 화면을 가져야 self-canonical이 된다.
    path: "/",
    name: "Home",
    component: () => import("@/views/HomeView.vue"),
  },
  {
    path: "/all",
    name: "AllTools",
    component: () => import("@/views/TravelToolsView.vue"),
    meta: { title: "여행 계산기 전체 보기 | 수하물·통신·환전 도구" },
  },
  {
    path: "/luggage",
    name: "Luggage",
    component: () => import("@/views/LuggageView.vue"),
  },
  {
    path: "/esim",
    name: "Esim",
    component: () => import("@/views/EsimView.vue"),
  },
  {
    path: "/exchange",
    name: "Exchange",
    component: () => import("@/views/ExchangeView.vue"),
  },
  {
    path: "/about",
    name: "About",
    component: () => import("@/views/AboutView.vue"),
  },
  {
    path: "/terms",
    name: "Terms",
    component: () => import("@/views/TermsView.vue"),
  },
  {
    path: "/privacy",
    name: "Privacy",
    component: () => import("@/views/PrivacyView.vue"),
  },
  {
    path: "/:pathMatch(.*)*",
    name: "NotFound",
    component: () => import("@/views/NotFoundView.vue"),
  },
];

function isBrowser(): boolean {
  return typeof window !== "undefined" && typeof document !== "undefined";
}

export function createScrollBehavior(): Router["options"]["scrollBehavior"] {
  return (to, from, savedPosition) => {
    if (savedPosition) return savedPosition;
    if (to.hash) return { el: to.hash, behavior: "smooth", top: 80 };
    // query parameter만 변경된 경우 스크롤 유지
    if (to.path === from.path) return false;
    return { top: 0 };
  };
}

export function setupRouterGuards(router: Router): void {
  router.beforeEach(async (to) => {
    const authStore = useAuthStore();
    const needsAuthState = Boolean(to.meta.requiresAuth || to.meta.requiresAdmin || to.meta.guestOnly);

    if (needsAuthState && !authStore.isInitialized) {
      try {
        await authStore.loadUser({ throwOnError: true });
      } catch {
        if (isBrowser()) {
          showAlert("사용자 정보를 불러오지 못했습니다.", { type: "error" });
        }
        return false;
      }
    }

    if (to.meta.guestOnly && authStore.isAuthenticated) {
      return "/";
    }

    if (to.meta.requiresAuth && !authStore.isAuthenticated) {
      if (isBrowser()) {
        showAlert("로그인이 필요합니다.", { type: "error" });
      }
      return "/";
    }

    if (to.meta.requiresAdmin && !authStore.isAdmin) {
      if (isBrowser()) {
        showAlert("관리자 권한이 필요합니다.", { type: "error" });
      }
      return "/";
    }

    return true;
  });

  router.afterEach((to, _from, failure) => {
    if (failure || !isBrowser()) return;
    void nextTick(() => {
      trackPageView(to.fullPath, document.title);
    });
  });
}
