// Generated from finmate-api/docs/vnext/06-api/openapi.yaml. Do not edit.
export interface paths {
    "/auth/signup": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * 이메일로 회원가입
         * @description 이메일과 비밀번호로 계정을 만들고 액세스 토큰 및 갱신 쿠키를 발급합니다.
         */
        post: operations["signUp"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/auth/login": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * 로그인
         * @description 가입한 이메일과 비밀번호를 검증하고 인증 세션을 발급합니다.
         */
        post: operations["logIn"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/auth/refresh": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * 인증 세션 갱신
         * @description 브라우저의 갱신 쿠키를 회전하고 새로운 액세스 토큰을 발급합니다.
         */
        post: operations["refreshSession"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/auth/logout": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * 로그아웃
         * @description 갱신 세션을 폐기하고 브라우저 쿠키를 삭제합니다.
         */
        post: operations["logOut"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/me/disclosures": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * 금융정보 공개 동의 조회
         * @description 현재 사용자의 항목별 공개 동의 상태와 버전을 조회합니다.
         */
        get: operations["getDisclosureConsent"];
        /**
         * 금융정보 공개 동의 변경
         * @description 미리보기에서 확인하고 명시적으로 동의한 정확값 항목만 공개합니다.
         */
        put: operations["updateDisclosureConsent"];
        post?: never;
        /**
         * 금융정보 공개 동의 철회
         * @description 공개를 즉시 중단하고 선택했던 모든 항목을 탐색 및 추천 조회에서 제거합니다.
         */
        delete: operations["withdrawDisclosureConsent"];
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/me/disclosures/preview": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * 공개될 금융정보 미리보기
         * @description 저장하기 전에 선택한 공개 항목의 실제 노출 형태와 공개 불가 항목을 확인합니다.
         */
        post: operations["previewDisclosure"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/onboarding": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * 온보딩 상태 조회
         * @description 작성 중인 온보딩 초안 또는 완료 상태를 조회합니다.
         */
        get: operations["getOnboarding"];
        /**
         * 온보딩 완료
         * @description 생활맥락과 금융성향을 저장하고 목표 없이 탐색 가능한 상태로 온보딩을 완료합니다.
         */
        put: operations["completeOnboarding"];
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/goals": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * 주 목표 확정
         * @description 사용자가 검토한 목표명, 현재값, 목표값과 목표 월을 하나의 활성 주 목표로 확정합니다.
         */
        post: operations["confirmUserGoal"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/goals/active": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * 활성 주 목표 조회
         * @description 사용자가 현재 진행 중인 단일 주 목표를 조회합니다.
         */
        get: operations["getActiveUserGoal"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/home": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * 홈 화면 조회
         * @description 목표 설정 여부에 따라 탐색 홈 또는 레이드가 활성화된 홈 정보를 반환합니다. 검증된 총자산 원천이 없으므로 totalAssetsKrw는 null입니다.
         */
        get: operations["getHome"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/raids/current": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * 현재 레이드 조회
         * @description 검증된 금융데이터로 계산한 현재 목표 진행률과 레이드 상태를 조회합니다.
         */
        get: operations["getCurrentRaid"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/reports/characters/{reportType}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * 캐릭터별 금융 리포트 조회
         * @description 소비·저축·투자 판단·퀘스트 경험치 중 선택한 캐릭터 영역의 리포트를 조회합니다. 금융 추이는 저장된 월별 계산 스냅샷만 사용합니다.
         */
        get: operations["getCharacterReport"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/reports/monthly": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * 월간 금융 리포트 조회
         * @description 지정한 월의 금융 변화와 퀘스트·루틴 활동을 요약해 조회합니다.
         */
        get: operations["getMonthlyReport"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/mate/friends/overview": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * 친구 현황 조회
         * @description 인증 사용자의 영구 연결 합성 페르소나를 기준으로 친구 관계와 오늘 퀘스트 완료 상태를 조회합니다. 원본 합성 페르소나 식별자와 정확 금융값은 반환하지 않습니다.
         */
        get: operations["getMateFriendOverview"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/mate/friends/feed": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * 친구 금융 근황 피드 조회
         * @description 인증 사용자의 친구에게 허용된 금융 습관 근황만 조회합니다. 원본 L3 메시지는 전달하지 않고 정제된 이벤트 유형으로부터 검수 문구를 재구성합니다.
         */
        get: operations["getMateFriendFeed"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/mate/friends/streaks": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * 친구 연속기록 조회
         * @description 인증 사용자의 친구 관계에 연결된 pair_daily 연속기록만 읽기 전용으로 조회합니다. 개인 연속기록과 월 저축 연속기록은 이 응답에 포함하지 않습니다.
         */
        get: operations["getMateFriendStreaks"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/mate/groups": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * 유사 메이트 그룹 목록 조회
         * @description 사용자의 생활맥락과 금융 기준선에 맞는 유사그룹 및 시연용 합성 그룹을 조회합니다.
         */
        get: operations["listMateGroups"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/mate/groups/{groupId}/report": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * 유사그룹 리포트 조회
         * @description 선택한 그룹의 익명 범위값, 금융 스탯 분포와 목표 달성 모험가 미리보기를 조회합니다.
         */
        get: operations["getMateGroupReport"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/mate/groups/{groupId}/adventurers": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * 추천 익명 모험가 목록 조회
         * @description 선택한 유사그룹 안에서 공개·품질 조건을 통과한 익명 모험가를 조회합니다.
         */
        get: operations["listRecommendedAdventurers"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/mate/groups/{groupId}/adventurers/{adventurerId}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * 추천 익명 모험가 상세 조회
         * @description 익명 모험가가 동의한 생활맥락, 루틴과 검증 기준일을 조회합니다.
         */
        get: operations["getRecommendedAdventurer"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/mate/groups/{groupId}/adventurers/{adventurerId}/report": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * 모험가 비교 리포트 조회
         * @description 나와 모험가의 범위화된 지표와 해당 모험가가 유지한 루틴의 근거를 비교합니다.
         */
        get: operations["getAdventurerReport"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/mate/groups/{groupId}/adventurers/{adventurerId}/financial-profile": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * 공개 금융 프로필 조회
         * @description 활성화된 항목별 동의로 선택된 합성 금융 정확값만 조회합니다.
         */
        get: operations["getPublicFinancialProfile"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/mate/groups/{groupId}/adventurers/{adventurerId}/routines/{routineId}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * 모험가 루틴 상세 조회
         * @description 그룹과 익명 모험가 맥락 안에서 선택한 루틴의 행동, 빈도와 유지기간을 조회합니다.
         */
        get: operations["getAdventurerRoutine"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/mate/explore/search": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * 조건별 익명 모험가 탐색
         * @description 인증 사용자의 바인딩 페르소나는 제외하고, 공개 동의·최신 데이터·승인 루틴·30일 이상 유지 조건을
         *     모두 통과한 합성 익명 모험가를 검색합니다. 소득과 저축 조건은 항상 정확히 일치해야 하며,
         *     결과가 부족할 때만 나이, 직업, 소비, 투자 조건 순서로 누적 완화합니다.
         */
        post: operations["searchMateAdventurers"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/routine-adaptations": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * 개인화 루틴 추천 생성
         * @description 선택한 모험가 루틴을 내 금융 기준선에 맞춰 추천안 하나와 선택 가능한 강도안으로 계산합니다.
         */
        post: operations["createRoutineRecommendation"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/routine-adaptations/{adaptationId}/candidates/{candidateId}/import": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * 개인화 루틴 적용
         * @description 활성 루틴이 없을 때 선택한 개인화 후보를 새 활성 루틴으로 적용합니다.
         */
        post: operations["importRoutineAdaptationCandidate"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/routine-builds/active": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * 활성 루틴 조회
         * @description 사용자가 현재 적용 중인 단일 활성 루틴을 조회합니다.
         */
        get: operations["getActiveRoutineBuild"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/routine-builds/active/replacement": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * 활성 루틴 교체
         * @description 사용자 확인 후 기존 루틴을 보관하고 선택한 후보를 새 활성 루틴으로 원자적으로 교체합니다.
         */
        post: operations["replaceActiveRoutineBuild"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/hana-products/{productId}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * 관련 하나 상품 정보 조회
         * @description 또래·루틴 데이터와 분리된 검수 완료 금융상품 정보를 열람합니다. 조회는 성장이나 보상에 영향을 주지 않습니다.
         */
        get: operations["getRelatedHanaProductInfo"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/quests": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * 퀘스트 화면 조회
         * @description 참여 가능, 진행 중, 금융데이터 반영 대기와 완료 퀘스트를 구분해 조회합니다.
         */
        get: operations["listQuests"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/quests/{questId}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * 퀘스트 상세 조회
         * @description 퀘스트의 현재값, 목표값, 기간, 검증 방식과 XP 보상을 조회합니다.
         */
        get: operations["getQuest"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/quests/{questId}/accept": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * 퀘스트 수락
         * @description 참여 가능한 퀘스트를 진행 중 상태로 변경합니다. 금융 스탯과 레이드는 변경하지 않습니다.
         */
        post: operations["acceptQuest"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/quests/{questId}/complete": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * 퀘스트 완료 처리
         * @description 행동형 퀘스트에는 XP와 내부 보상을 지급하고, 금융 근거가 필요한 퀘스트는 데이터 재계산을 기다립니다.
         */
        post: operations["completeQuest"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/records": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * 기간별 일일 기록 목록 조회
         * @description 시작일과 종료일 사이의 연결된 합성 금융활동, 앱 퀘스트·재계산 이벤트와 회고를 Asia/Seoul 날짜순으로 조회합니다.
         */
        get: operations["listDailyRecords"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/records/journey": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * 월간 금융 여정 조회
         * @description 지정한 월의 날짜별 대표 활동과 보조 활동을 순서가 보장된 발판 여정으로 조회합니다. 대표 활동은 금액 절댓값이 가장 큰 실제 활동입니다.
         */
        get: operations["getDailyJourneyMonth"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/records/{date}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * 일일 기록 상세 조회
         * @description 선택한 날짜의 수입·지출·저축·투자·퀘스트와 예산 상태를 조회합니다.
         */
        get: operations["getDailyRecord"];
        /**
         * 일일 회고 저장
         * @description 선택한 날짜에 사용자 회고를 저장합니다. 금융 계산 결과에는 영향을 주지 않습니다.
         */
        put: operations["saveDailyReflection"];
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/rewards/points": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * 내부 포인트 내역 조회
         * @description 양도와 환금이 불가능한 내부 포인트 잔액 및 적립·사용 내역을 조회합니다.
         */
        get: operations["getPointLedger"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/rewards/cosmetics": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * 꾸미기 상품 목록 조회
         * @description 현금·쿠폰·랜덤 상자 없이 가격이 확정된 캐릭터 꾸미기 항목만 조회합니다.
         */
        get: operations["listCosmetics"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/rewards/cosmetics/{cosmeticId}/purchase": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * 꾸미기 상품 구매
         * @description 내부 포인트로 선택한 확정형 꾸미기 항목을 멱등하게 구매합니다.
         */
        post: operations["purchaseCosmetic"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/demo/timeline/advance": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * 시연 타임라인 진행
         * @description demo 프로필과 합성 사용자에게만 등록되는 시연 전용 API입니다.
         */
        post: operations["advanceDemoTimeline"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
}
export type webhooks = Record<string, never>;
export interface components {
    schemas: {
        /**
         * Format: int64
         * @description 음수가 아닌 원 단위 정수 금액입니다.
         */
        KrwAmount: number;
        /**
         * Format: int64
         * @description 원천이 부족하면 null인 원 단위 금액입니다.
         */
        NullableKrwAmount: number | null;
        /**
         * Format: int64
         * @description 수입·지출 방향을 부호로 표현하는 원 단위 정수 금액입니다.
         */
        SignedKrwAmount: number;
        BasisPoints: number;
        NullableBasisPoints: number | null;
        /** Format: date-time */
        Timestamp: string;
        /** Format: date-time */
        NullableTimestamp: string | null;
        /** @enum {string} */
        DataState: "FRESH" | "PENDING" | "STALE" | "INSUFFICIENT";
        /** @enum {string} */
        OnboardingState: "EXPLORE_ONLY" | "GOAL_ACTIVE";
        /** @enum {string} */
        GoalDomain: "SPENDING" | "SAVING";
        /** @enum {string} */
        AdaptationDomain: "SPENDING" | "SAVING" | "INVESTMENT_JUDGMENT";
        /** @enum {string} */
        Difficulty: "LIGHT" | "STANDARD" | "CHALLENGE";
        /** @enum {string} */
        CharacterReportType: "SPENDING_DEFENSE" | "SAVING_HP" | "INVESTMENT_JUDGMENT" | "QUEST_XP";
        /** @enum {string} */
        DisclosureField: "ASSETS" | "INCOME" | "SPENDING" | "SAVING" | "FINANCIAL_PRODUCTS" | "INVESTMENT_HOLDINGS" | "TRADES";
        /** @enum {string} */
        PermanentlyExcludedDisclosureField: "ACCOUNT_NUMBER" | "RAW_TRANSACTION_MEMO" | "DETAILED_EMPLOYER" | "DETAILED_LOCATION" | "AUTHENTICATION_IDENTIFIER";
        DisclosureRequest: {
            fields: components["schemas"]["DisclosureField"][];
            consentVersion: string;
            /** @enum {boolean} */
            confirmExactValues: true;
        };
        DisclosureConsent: {
            /** @enum {string} */
            state: "ACTIVE" | "OPTED_OUT";
            exactValues: boolean;
            fields: components["schemas"]["DisclosureField"][];
            consentVersion: string;
            /** Format: int64 */
            version: number;
            updatedAt: components["schemas"]["Timestamp"];
        };
        DisclosurePreview: {
            /** @enum {boolean} */
            exactValues: true;
            fields: components["schemas"]["DisclosureField"][];
            permanentlyExcludedFields: components["schemas"]["PermanentlyExcludedDisclosureField"][];
            consentVersion: string;
        };
        SignUpRequest: {
            /** Format: email */
            email: string;
            password: string;
            displayName: string;
        };
        LoginRequest: {
            /** Format: email */
            email: string;
            password: string;
        };
        AuthUser: {
            /** Format: uuid */
            userId: string;
            /** Format: email */
            email: string;
            displayName: string;
            /** @enum {string} */
            onboardingStatus: "NOT_STARTED" | "IN_PROGRESS" | "COMPLETED";
        };
        AuthSession: {
            accessToken: string;
            /** @enum {string} */
            tokenType: "Bearer";
            expiresAt: components["schemas"]["Timestamp"];
            user: components["schemas"]["AuthUser"];
        };
        ProfileContext: {
            /** @enum {string} */
            incomeRegularity: "REGULAR" | "IRREGULAR" | "NONE";
            /** @enum {string} */
            housingType: "WITH_FAMILY" | "RENT" | "DORMITORY" | "OTHER";
            /** @enum {string} */
            fixedCostBurden: "LOW" | "MEDIUM" | "HIGH";
        };
        CompleteOnboardingRequest: {
            displayName: string;
            context: components["schemas"]["ProfileContext"];
            /** @enum {string} */
            moneyConcern: "SPENDING" | "SAVING" | "EMERGENCY_FUND" | "INVESTMENT_JUDGMENT" | "UNSURE";
            /** @enum {string} */
            financialTendency: "CAUTIOUS" | "BALANCED" | "EXPLORING";
            lifestyleTags: string[];
            anonymousShareConsent: boolean;
            /** @enum {boolean} */
            syntheticMyDataConsent: true;
            /** @enum {string} */
            finishMode: "EXPLORE_ONLY";
        };
        BaselineSummary: {
            disposableIncomeKrw: components["schemas"]["NullableKrwAmount"];
            spendingRateBps: components["schemas"]["NullableBasisPoints"];
            savingRateBps: components["schemas"]["NullableBasisPoints"];
            investmentJudgmentBps: components["schemas"]["NullableBasisPoints"];
        };
        OnboardingView: {
            /** @enum {string} */
            status: "IN_PROGRESS" | "COMPLETED";
            onboardingState: components["schemas"]["OnboardingState"];
            displayName?: string;
            context?: components["schemas"]["ProfileContext"];
            baseline: components["schemas"]["BaselineSummary"];
            mainGoal?: components["schemas"]["UserGoal"];
            calculationVersion: string;
            dataState: components["schemas"]["DataState"];
            lastSyncedAt: components["schemas"]["NullableTimestamp"];
        };
        UserGoalDraft: {
            title: string;
            domain: components["schemas"]["GoalDomain"];
            currentAmountKrw: components["schemas"]["KrwAmount"];
            targetAmountKrw: components["schemas"]["KrwAmount"];
            targetMonth: string;
        };
        ConfirmUserGoalRequest: {
            goal: components["schemas"]["UserGoalDraft"];
            /** @enum {boolean} */
            confirm: true;
        };
        UserGoal: {
            goalId: string;
            title: string;
            domain: components["schemas"]["GoalDomain"];
            currentAmountKrw: components["schemas"]["KrwAmount"];
            targetAmountKrw: components["schemas"]["KrwAmount"];
            targetMonth: string;
            /** @enum {string} */
            state: "ACTIVE" | "PAUSED" | "COMPLETED" | "CANCELLED" | "EXPIRED";
            confirmedAt: components["schemas"]["Timestamp"];
            calculationVersion: string;
            dataState: components["schemas"]["DataState"];
            lastSyncedAt: components["schemas"]["NullableTimestamp"];
        };
        FinancialStats: {
            spendingDefenseBps: components["schemas"]["NullableBasisPoints"];
            savingHpBps: components["schemas"]["NullableBasisPoints"];
            investmentJudgmentBps: components["schemas"]["NullableBasisPoints"];
            questXp: number;
        };
        RaidView: {
            raidId: string;
            goalId: string;
            stage: number;
            bossHpBps: components["schemas"]["BasisPoints"];
            currentProgressBps: components["schemas"]["BasisPoints"];
            highestProgressBps: components["schemas"]["BasisPoints"];
            /** @enum {string} */
            status: "ACTIVE" | "WAITING_FOR_DATA" | "COMPLETED";
            financialStats: components["schemas"]["FinancialStats"];
            coachCopyKey: string;
            calculationVersion: string;
            dataState: components["schemas"]["DataState"];
            lastSyncedAt: components["schemas"]["NullableTimestamp"];
        };
        HomeView: {
            mode: components["schemas"]["OnboardingState"];
            totalAssetsKrw: components["schemas"]["NullableKrwAmount"];
            mainGoal?: components["schemas"]["UserGoal"];
            raid?: components["schemas"]["RaidView"];
            financialStats: components["schemas"]["FinancialStats"];
            activeRoutineBuild?: components["schemas"]["ActiveRoutineBuild"];
            nextQuest?: components["schemas"]["Quest"];
            lockedActions: ("RAID" | "QUEST_ACCEPT" | "ROUTINE_IMPORT" | "PERSONALIZED_PRODUCT_INFO")[];
            calculationVersion: string;
            dataState: components["schemas"]["DataState"];
            lastSyncedAt: components["schemas"]["NullableTimestamp"];
        } & ({
            /** @enum {string} */
            mode: "EXPLORE_ONLY";
        } | {
            /** @enum {string} */
            mode: "GOAL_ACTIVE";
        });
        CharacterMetric: {
            label: string;
            displayValue: string;
            reasonCopyKey: string;
        };
        TrendPoint: {
            /** Format: date */
            date: string;
            value: number;
        };
        CharacterReport: {
            reportType: components["schemas"]["CharacterReportType"];
            /** @enum {string} */
            characterName: "BEAR" | "SEAL" | "RABBIT" | "BIRD";
            scoreBps: components["schemas"]["NullableBasisPoints"];
            metrics: components["schemas"]["CharacterMetric"][];
            trend30Days: components["schemas"]["TrendPoint"][];
            nextQuestId: string;
            calculationVersion: string;
            dataState: components["schemas"]["DataState"];
            lastSyncedAt: components["schemas"]["NullableTimestamp"];
        };
        MonthlyReport: {
            month: string;
            goalProgressBps: components["schemas"]["BasisPoints"];
            financialStats: components["schemas"]["FinancialStats"];
            xpEarned: number;
            completedQuestCount: number;
            calculationVersion: string;
            dataState: components["schemas"]["DataState"];
            lastSyncedAt: components["schemas"]["NullableTimestamp"];
        };
        MateGroup: {
            groupId: string;
            name: string;
            memberCount: number;
            syntheticDemo: boolean;
            eligibleForProductionAggregation: boolean;
        } & ({
            memberCount?: number;
            /** @enum {boolean} */
            syntheticDemo?: false;
            /** @enum {boolean} */
            eligibleForProductionAggregation?: true;
        } | {
            /** @enum {boolean} */
            syntheticDemo?: true;
            /** @enum {boolean} */
            eligibleForProductionAggregation?: false;
        });
        MateGroupPage: {
            items: components["schemas"]["MateGroup"][];
        };
        MateFriendStatus: {
            /** @description 원본 합성 페르소나 식별자와 무관한 결정적 공개 식별자입니다. */
            friendId: string;
            /** @description 원본 식별자를 포함하지 않는 결정적 익명 별칭입니다. */
            alias: string;
            /** @description 결정적으로 배정된 메이트 아바타 코드입니다. */
            avatarCode: string;
            questCompletedToday: boolean;
        };
        /** @description 읽기 전용 친구 요약입니다. friendCount는 수락된 친구 관계 수이며 금융 스탯 평균의 분모가 아닙니다. 향후 평균값을 공개할 때는 원천 집계의 scoredFriendCount를 별도로 사용합니다. */
        MateFriendOverview: {
            /** @description 수락된 전체 친구 수입니다. scoredFriendCount로 해석하지 않습니다. */
            friendCount: number;
            completedToday: number;
            /** @enum {boolean} */
            readOnly: true;
            friends: components["schemas"]["MateFriendStatus"][];
        };
        MateFeedItem: {
            friendId: string;
            alias: string;
            avatarCode: string;
            /** @enum {string} */
            eventType: "QUEST" | "ROUTINE" | "STREAK";
            /** @description 원본 L3 문구가 아니라 이벤트 유형과 익명 별칭으로 재구성된 검수 문구입니다. */
            message: string;
            completed: boolean;
            occurredAt: components["schemas"]["Timestamp"];
        };
        MateFriendFeed: {
            /** @enum {boolean} */
            readOnly: true;
            items: components["schemas"]["MateFeedItem"][];
        };
        MateStreakItem: {
            friendId: string;
            alias: string;
            label: string;
            daysTogether: number;
        };
        MateStreakPage: {
            /** @enum {boolean} */
            readOnly: true;
            items: components["schemas"]["MateStreakItem"][];
        };
        DistributionRange: {
            p25Bps: components["schemas"]["BasisPoints"];
            medianBps: components["schemas"]["BasisPoints"];
            p75Bps: components["schemas"]["BasisPoints"];
        };
        MateGroupReport: {
            group: components["schemas"]["MateGroup"];
            selectionReasons: string[];
            spendingRateRange: components["schemas"]["DistributionRange"];
            savingRateRange: components["schemas"]["DistributionRange"];
            averageStats: components["schemas"]["FinancialStats"];
            achieverCount: number;
            adventurerPreview: components["schemas"]["RecommendedAdventurerCard"][];
            coachCopyKeys: string[];
            calculationVersion: string;
            dataState: components["schemas"]["DataState"];
            lastSyncedAt: components["schemas"]["NullableTimestamp"];
        };
        RoutineSummary: {
            routineId: string;
            title: string;
            domain: components["schemas"]["AdaptationDomain"];
            maintenanceDays: number;
        };
        RecommendedAdventurerCard: {
            adventurerId: string;
            groupId: string;
            alias: string;
            contextTags: string[];
            similarityReasons: string[];
            goalAchievementLabel: string;
            routines: components["schemas"]["RoutineSummary"][];
            verifiedAt: components["schemas"]["Timestamp"];
            approvedAt: components["schemas"]["Timestamp"];
        };
        RecommendedAdventurerPage: {
            groupId: string;
            items: components["schemas"]["RecommendedAdventurerCard"][];
            calculationVersion: string;
            dataState: components["schemas"]["DataState"];
            lastSyncedAt: components["schemas"]["NullableTimestamp"];
        };
        ComparisonMetric: {
            label: string;
            myRange: string;
            adventurerRange: string;
            interpretationCopyKey: string;
        };
        AdventurerReport: {
            adventurer: components["schemas"]["RecommendedAdventurerCard"];
            comparisonMetrics: components["schemas"]["ComparisonMetric"][];
            routineEvidence: string[];
            calculationVersion: string;
            dataState: components["schemas"]["DataState"];
            lastSyncedAt: components["schemas"]["NullableTimestamp"];
        };
        PublicAssetEntry: {
            name: string;
            category: string;
            balanceKrw: components["schemas"]["KrwAmount"];
            /** Format: date */
            asOfDate: string;
        };
        PublicCashflowEntry: {
            name: string;
            category: string;
            amountKrw: components["schemas"]["KrwAmount"];
            /** Format: date */
            asOfDate: string;
        };
        PublicProductHolding: {
            productName: string;
            category: string;
            balanceKrw: components["schemas"]["KrwAmount"];
            /** Format: date */
            asOfDate: string;
        };
        PublicInvestmentHolding: {
            name: string;
            ticker: string;
            balanceKrw: components["schemas"]["KrwAmount"];
            allocationBps: components["schemas"]["BasisPoints"];
            quantity: number;
            /** Format: date */
            asOfDate: string;
        };
        PublicTradeRecord: {
            name: string;
            ticker: string;
            /** @enum {string} */
            action: "BUY" | "SELL";
            amountKrw: components["schemas"]["KrwAmount"];
            quantity: number;
            occurredAt: components["schemas"]["Timestamp"];
        };
        PublicFinancialProfile: {
            adventurerId: string;
            alias: string;
            /** @enum {boolean} */
            synthetic: true;
            /** @enum {boolean} */
            exactValues: true;
            visibleFields: components["schemas"]["DisclosureField"][];
            consentVersion: string;
            updatedAt: components["schemas"]["Timestamp"];
            assets?: components["schemas"]["PublicAssetEntry"][];
            income?: components["schemas"]["PublicCashflowEntry"][];
            spending?: components["schemas"]["PublicCashflowEntry"][];
            savings?: components["schemas"]["PublicCashflowEntry"][];
            products?: components["schemas"]["PublicProductHolding"][];
            investments?: components["schemas"]["PublicInvestmentHolding"][];
            trades?: components["schemas"]["PublicTradeRecord"][];
        };
        AdventurerRoutine: {
            routineId: string;
            adventurerId: string;
            groupId: string;
            title: string;
            domain: components["schemas"]["AdaptationDomain"];
            maintenanceDays: number;
            steps: string[];
            evidenceCopyKeys: string[];
        };
        MateExploreSearchRequest: {
            /** @enum {string} */
            ageBand: "AGE_19_23" | "AGE_24_29" | "AGE_30_34";
            /** @enum {string} */
            occupationGroup: "STUDENT" | "EARLY_CAREER" | "FREELANCER" | "JOB_SEEKER";
            /** @enum {string} */
            incomeBand: "NONE" | "UNDER_200" | "FROM_200_TO_300" | "OVER_300";
            /** @enum {string} */
            spendingTendency: "PLANNED" | "BALANCED" | "VARIABLE";
            /** @enum {string} */
            savingRateBand: "UNDER_10" | "FROM_10_TO_20" | "OVER_20";
            /** @enum {string} */
            investmentTendency: "CAUTIOUS" | "BALANCED" | "LEARNING";
        };
        MateExploreSearchRoutine: {
            /** @description 승인된 런타임 루틴 식별자입니다. */
            routineId: string;
            title: string;
            domain: components["schemas"]["AdaptationDomain"];
        };
        /** @description 정확 금융값이나 보유자산·종목을 포함하지 않는 탐색 전용 카드입니다. */
        MateExploreSearchCard: {
            /** @description 원본 페르소나를 노출하지 않는 탐색 전용 익명 식별자입니다. */
            adventurerId: string;
            /**
             * @description 기존 상세 링크 조합을 위한 호환 그룹 식별자입니다.
             * @enum {string}
             */
            groupId: "synthetic-runtime";
            /** @description 모험가가 속한 런타임 합성 유사그룹 식별자입니다. */
            sourceGroupId: string;
            alias: string;
            contextTags: string[];
            representativeRoutine: components["schemas"]["MateExploreSearchRoutine"];
            /** @description 유지 개월에 30일을 곱한 값입니다. */
            maintenanceDays: number;
            similarityScoreBps: components["schemas"]["BasisPoints"];
            matchedFilters: ("ageBand" | "occupationGroup" | "incomeBand" | "spendingTendency" | "savingRateBand" | "investmentTendency")[];
            /**
             * Format: date
             * @description 런타임 특성 프로필 기준월입니다.
             */
            dataAsOf: string;
        };
        MateExploreSearchResponse: {
            items: components["schemas"]["MateExploreSearchCard"][];
            /** @description 고정 안전조건과 소득·저축 조건을 통과한 전체 인원입니다. */
            totalEligible: number;
            /** @enum {string} */
            matchMode: "EXACT" | "RELAXED" | "NONE";
            /** @description 실제 검색에서 누적 완화한 순서입니다. */
            relaxedFilters: ("ageBand" | "occupationGroup" | "spendingTendency" | "investmentTendency")[];
            /** @enum {string} */
            calculationVersion: "mate-search-runtime-v1";
            /** @enum {string} */
            dataState: "FRESH";
            lastSyncedAt: components["schemas"]["NullableTimestamp"];
        };
        CreateRoutineRecommendationRequest: {
            groupId: string;
            adventurerId: string;
            sourceRoutineId: string;
            selectedDomain: components["schemas"]["AdaptationDomain"];
        };
        RoutineAdaptationCandidate: {
            candidateId: string;
            difficulty: components["schemas"]["Difficulty"];
            domain: components["schemas"]["AdaptationDomain"];
            title: string;
            /** @enum {string} */
            targetKind: "AMOUNT_KRW" | "BASIS_POINTS" | "BEHAVIOR";
            targetAmountKrw?: components["schemas"]["KrwAmount"];
            targetBasisPoints?: components["schemas"]["BasisPoints"];
            behaviorTarget?: string;
            durationDays?: number;
            steps: string[];
        } & ({
            /** @enum {string} */
            domain?: "SPENDING" | "SAVING";
            /** @enum {string} */
            targetKind?: "AMOUNT_KRW";
        } | {
            /** @enum {string} */
            domain?: "SPENDING" | "SAVING";
            /** @enum {string} */
            targetKind?: "BASIS_POINTS";
        } | {
            /** @enum {string} */
            domain?: "SPENDING" | "SAVING" | "INVESTMENT_JUDGMENT";
            /** @enum {string} */
            targetKind?: "BEHAVIOR";
        });
        RoutineRecommendation: {
            adaptationId: string;
            sourceRoutineId: string;
            selectedDomain: components["schemas"]["AdaptationDomain"];
            recommendedCandidate: components["schemas"]["RoutineAdaptationCandidate"];
            recommendationReasonCopyKey: string;
            relatedProductId?: string;
            intensityOptions: components["schemas"]["RoutineAdaptationCandidate"][];
            calculationVersion: string;
            dataState: components["schemas"]["DataState"];
            lastSyncedAt: components["schemas"]["NullableTimestamp"];
        };
        ActiveRoutineBuild: {
            buildId: string;
            candidateId: string;
            sourceRoutineId: string;
            domain: components["schemas"]["AdaptationDomain"];
            difficulty: components["schemas"]["Difficulty"];
            /** @enum {string} */
            status: "ACTIVE" | "COMPLETED" | "ARCHIVED";
            steps: string[];
            activatedAt: components["schemas"]["Timestamp"];
            archivedAt?: components["schemas"]["NullableTimestamp"];
            replacesBuildId: string | null;
            replacedByBuildId?: string | null;
            calculationVersion: string;
            dataState: components["schemas"]["DataState"];
            lastSyncedAt: components["schemas"]["NullableTimestamp"];
        };
        ReplaceActiveRoutineBuildRequest: {
            adaptationId: string;
            candidateId: string;
            /** @enum {boolean} */
            confirmReplacement: true;
        };
        RoutineBuildReplacement: {
            archivedBuild: components["schemas"]["ActiveRoutineBuild"];
            activeBuild: components["schemas"]["ActiveRoutineBuild"];
            replacedAt: components["schemas"]["Timestamp"];
        };
        RelatedHanaProductInfo: {
            productId: string;
            displayName: string;
            category: string;
            relatedRoutineDomain: components["schemas"]["AdaptationDomain"];
            keyConditions: string[];
            cautions: string[];
            /** Format: date */
            informationAsOf: string;
            /** Format: uri */
            officialInformationUrl: string;
            /** @enum {boolean} */
            reviewedCatalog: true;
            /** @enum {boolean} */
            inAppEnrollmentAvailable: false;
            /** @enum {boolean} */
            affectsProgress: false;
        };
        Quest: {
            questId: string;
            title: string;
            /** @enum {string} */
            status: "AVAILABLE" | "ACTIVE" | "DATA_PENDING" | "COMPLETED" | "EXPIRED" | "CANCELLED";
            /** @enum {string} */
            verificationKind: "BEHAVIOR" | "SYNTHETIC_MYDATA";
            currentValue: number;
            targetValue: number;
            /** @enum {string} */
            unit: "COUNT" | "KRW" | "BASIS_POINTS";
            durationLabel: string;
            xpReward: number;
            /** @description 퀘스트 검증 규칙을 통과한 뒤 지급하는 확정형 내부 포인트입니다. */
            pointReward: number;
            /** @enum {boolean} */
            financialStatsChanged: false;
            acceptedAt?: components["schemas"]["NullableTimestamp"];
            calculationVersion: string;
            dataState: components["schemas"]["DataState"];
            lastSyncedAt: components["schemas"]["NullableTimestamp"];
        };
        QuestPage: {
            items: components["schemas"]["Quest"][];
            completedTodayCount: number;
            totalTodayCount: number;
            totalXp: number;
            calculationVersion: string;
            dataState: components["schemas"]["DataState"];
            lastSyncedAt: components["schemas"]["NullableTimestamp"];
        };
        QuestAcceptance: {
            quest: components["schemas"]["Quest"];
            acceptedAt: components["schemas"]["Timestamp"];
            /** @enum {boolean} */
            financialStatsChanged: false;
        };
        QuestCompletion: {
            quest: components["schemas"]["Quest"];
            xpAwarded: number;
            pointsAwarded: number;
            /** @enum {boolean} */
            financialStatsChanged: false;
        };
        PointLedgerEntry: {
            /** @enum {string} */
            entryType: "EARN" | "SPEND";
            /** @description 적립은 양수, 사용은 음수로 표현합니다. */
            amountPoints: number;
            /** @enum {string} */
            sourceType: "QUEST" | "COSMETIC";
            sourceId: string;
            occurredAt: components["schemas"]["Timestamp"];
        };
        PointLedgerView: {
            balance: number;
            entries: components["schemas"]["PointLedgerEntry"][];
        };
        CosmeticCatalogItem: {
            id: string;
            /** @enum {string} */
            itemType: "OUTFIT" | "PROFILE_FRAME" | "THEME";
            name: string;
            description: string;
            pricePoints: number;
            owned: boolean;
        };
        CosmeticCatalogView: {
            items: components["schemas"]["CosmeticCatalogItem"][];
        };
        CosmeticPurchase: {
            cosmeticId: string;
            /** @enum {boolean} */
            owned: true;
            balance: number;
        };
        DailyActivity: {
            activityId: string;
            /** @enum {string} */
            activityType: "INCOME" | "EXPENSE" | "SAVING" | "INVESTMENT" | "QUEST" | "ROUTINE" | "MYDATA_RECALCULATION";
            title: string;
            amountKrw?: components["schemas"]["SignedKrwAmount"];
            occurredAt: components["schemas"]["Timestamp"];
            primary: boolean;
            categoryLabels?: string[];
        };
        BudgetStatus: {
            budgetKrw: components["schemas"]["KrwAmount"];
            spentKrw: components["schemas"]["KrwAmount"];
            remainingKrw: components["schemas"]["KrwAmount"];
            usedBps: components["schemas"]["BasisPoints"];
        };
        DailyRecord: {
            /** Format: date */
            date: string;
            /** @enum {string} */
            status: "RECORDED" | "TODAY" | "PLANNED" | "EMPTY";
            activities: components["schemas"]["DailyActivity"][];
            budget: components["schemas"]["BudgetStatus"];
            xpEarned: number;
            reflection: string | null;
            recalculationSummary?: string | null;
            calculationVersion: string;
            dataState: components["schemas"]["DataState"];
            lastSyncedAt: components["schemas"]["NullableTimestamp"];
        };
        DailyRecordPage: {
            items: components["schemas"]["DailyRecord"][];
            calculationVersion: string;
            dataState: components["schemas"]["DataState"];
            lastSyncedAt: components["schemas"]["NullableTimestamp"];
        };
        JourneyNode: {
            /** Format: date */
            date: string;
            /** @enum {string} */
            status: "RECORDED" | "TODAY" | "PLANNED" | "LOCKED" | "EMPTY";
            primaryActivity: components["schemas"]["DailyActivity"] | null;
            secondaryActivityTypes: ("INCOME" | "EXPENSE" | "SAVING" | "INVESTMENT" | "QUEST" | "ROUTINE")[];
            hiddenActivityCount: number;
            detailAvailable: boolean;
        };
        MonthlyMoneySummary: {
            incomeKrw: components["schemas"]["KrwAmount"];
            expenseKrw: components["schemas"]["KrwAmount"];
            savingKrw: components["schemas"]["KrwAmount"];
        };
        DailyJourneyMonth: {
            month: string;
            recordedDayCount: number;
            dayCount: number;
            moneySummary: components["schemas"]["MonthlyMoneySummary"];
            nodes: components["schemas"]["JourneyNode"][];
            calculationVersion: string;
            dataState: components["schemas"]["DataState"];
            lastSyncedAt: components["schemas"]["NullableTimestamp"];
        };
        SaveReflectionRequest: {
            reflection: string;
        };
        AdvanceDemoTimelineRequest: {
            /** @enum {string} */
            fixtureId: "EUROPE_TRAVEL_JANUARY";
            expectedFrameIndex: number;
        };
        DemoTimelineFrame: {
            frameIndex: number;
            month: string;
            savingEventKrw: components["schemas"]["KrwAmount"];
            goalCurrentAmountKrw: components["schemas"]["KrwAmount"];
            goalProgressBps: components["schemas"]["BasisPoints"];
            /** @enum {string} */
            dataState: "FRESH";
        };
        DemoTimelineView: {
            /** @enum {string} */
            fixtureId: "EUROPE_TRAVEL_JANUARY";
            initialGoalAmountKrw: components["schemas"]["KrwAmount"];
            targetGoalAmountKrw: components["schemas"]["KrwAmount"];
            currentFrameIndex: number;
            frames: components["schemas"]["DemoTimelineFrame"][];
            mainGoal: components["schemas"]["UserGoal"];
            raid: components["schemas"]["RaidView"];
            calculationVersion: string;
            dataState: components["schemas"]["DataState"];
            lastSyncedAt: components["schemas"]["NullableTimestamp"];
        };
        FieldError: {
            field: string;
            message: string;
        };
        Problem: {
            /** Format: uri */
            type: string;
            title: string;
            status: number;
            detail: string;
            instance: string;
            /** @enum {string} */
            code: "VALIDATION_FAILED" | "UNAUTHORIZED" | "INVALID_CREDENTIALS" | "DUPLICATE_EMAIL" | "NOT_FOUND" | "ACTIVE_MAIN_GOAL_EXISTS" | "GOAL_REQUIRED" | "DATA_STALE" | "DATA_INSUFFICIENT" | "ACTIVE_ROUTINE_BUILD_EXISTS" | "DEMO_PROFILE_REQUIRED";
            traceId: string;
            fieldErrors?: components["schemas"]["FieldError"][];
        };
    };
    responses: {
        /** @description 인증된 이메일·비밀번호 세션입니다. */
        AuthSessionResponse: {
            headers: {
                "Set-Cookie": components["headers"]["RefreshCookie"];
                [name: string]: unknown;
            };
            content: {
                "application/json": components["schemas"]["AuthSession"];
            };
        };
        /** @description RFC 7807 형식의 표준 오류 응답입니다. */
        ProblemResponse: {
            headers: {
                [name: string]: unknown;
            };
            content: {
                "application/problem+json": components["schemas"]["Problem"];
            };
        };
        /** @description 이 명령을 실행하려면 활성 주 목표가 필요합니다. */
        GoalRequired: {
            headers: {
                [name: string]: unknown;
            };
            content: {
                "application/problem+json": components["schemas"]["Problem"];
            };
        };
        /** @description 이미 활성화된 주 목표가 있습니다. */
        ActiveGoalConflict: {
            headers: {
                [name: string]: unknown;
            };
            content: {
                /**
                 * @example {
                 *       "type": "https://finmate.example/problems/active-main-goal-exists",
                 *       "title": "Active main goal exists",
                 *       "status": 409,
                 *       "detail": "Complete or cancel the current goal before confirming another.",
                 *       "instance": "/api/v1/goals",
                 *       "code": "ACTIVE_MAIN_GOAL_EXISTS",
                 *       "traceId": "trace-goal-conflict"
                 *     }
                 */
                "application/problem+json": components["schemas"]["Problem"];
            };
        };
        /** @description 활성 목표가 없거나 기존 활성 루틴을 명시적으로 교체해야 합니다. */
        RoutineImportConflict: {
            headers: {
                [name: string]: unknown;
            };
            content: {
                "application/problem+json": components["schemas"]["Problem"];
            };
        };
        /** @description 활성 목표가 없거나 합성 원천 데이터가 오래되었습니다. */
        RoutineRecommendationConflict: {
            headers: {
                [name: string]: unknown;
            };
            content: {
                "application/problem+json": components["schemas"]["Problem"];
            };
        };
        /** @description 마지막 합성데이터 계산 시점이 오래되어 이 명령을 실행할 수 없습니다. */
        DataStale: {
            headers: {
                [name: string]: unknown;
            };
            content: {
                "application/problem+json": components["schemas"]["Problem"];
            };
        };
        /** @description 합성 원천 데이터의 기간 또는 분류 정보가 계산하기에 부족합니다. */
        DataInsufficient: {
            headers: {
                [name: string]: unknown;
            };
            content: {
                "application/problem+json": components["schemas"]["Problem"];
            };
        };
    };
    parameters: {
        /** @description 동일한 명령의 중복 처리를 막기 위한 클라이언트 생성 고유 키입니다. */
        IdempotencyKey: string;
        /** @description 브라우저 쿠키에만 보관하는 불투명한 30일 갱신 토큰입니다. */
        RefreshCookie: string;
        /** @description 유사그룹 식별자 */
        GroupId: string;
        /** @description 익명 모험가 식별자 */
        AdventurerId: string;
        /** @description 모험가 루틴 식별자 */
        RoutineId: string;
        /** @description 루틴 개인화 결과 식별자 */
        AdaptationId: string;
        /** @description 개인화 루틴 후보 식별자 */
        CandidateId: string;
        /** @description 검수 상품 식별자 */
        ProductId: string;
        /** @description 꾸미기 상품 식별자 */
        CosmeticId: string;
        /** @description 퀘스트 식별자 */
        QuestId: string;
        /** @description 조회할 기록 날짜 */
        RecordDate: string;
        /** @description 조회할 캐릭터 금융 리포트 영역 */
        CharacterReportType: components["schemas"]["CharacterReportType"];
        /** @description 조회 월(YYYY-MM) */
        Month: string;
    };
    requestBodies: never;
    headers: {
        /**
         * @description 안전한 브라우저 속성과 함께 회전된 불투명 갱신 토큰입니다.
         * @example finmate_refresh=opaque-token; Path=/api/v1/auth; Max-Age=2592000; HttpOnly; SameSite=Lax; Secure
         */
        RefreshCookie: string;
        /**
         * @description 동일한 속성과 Max-Age=0을 사용해 브라우저 쿠키를 폐기합니다.
         * @example finmate_refresh=; Path=/api/v1/auth; Max-Age=0; HttpOnly; SameSite=Lax; Secure
         */
        ClearedRefreshCookie: string;
    };
    pathItems: never;
}
export type $defs = Record<string, never>;
export interface operations {
    signUp: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["SignUpRequest"];
            };
        };
        responses: {
            201: components["responses"]["AuthSessionResponse"];
            default: components["responses"]["ProblemResponse"];
        };
    };
    logIn: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["LoginRequest"];
            };
        };
        responses: {
            200: components["responses"]["AuthSessionResponse"];
            default: components["responses"]["ProblemResponse"];
        };
    };
    refreshSession: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie: {
                /** @description 브라우저 쿠키에만 보관하는 불투명한 30일 갱신 토큰입니다. */
                finmate_refresh: components["parameters"]["RefreshCookie"];
            };
        };
        requestBody?: never;
        responses: {
            200: components["responses"]["AuthSessionResponse"];
            default: components["responses"]["ProblemResponse"];
        };
    };
    logOut: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie: {
                /** @description 브라우저 쿠키에만 보관하는 불투명한 30일 갱신 토큰입니다. */
                finmate_refresh: components["parameters"]["RefreshCookie"];
            };
        };
        requestBody?: never;
        responses: {
            /** @description 갱신 세션을 폐기하고 브라우저 쿠키를 삭제했습니다. */
            204: {
                headers: {
                    "Set-Cookie": components["headers"]["ClearedRefreshCookie"];
                    [name: string]: unknown;
                };
                content?: never;
            };
            default: components["responses"]["ProblemResponse"];
        };
    };
    getDisclosureConsent: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description 현재 항목별 공개 동의입니다. 신규 사용자의 기본값은 모두 비공개입니다. */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["DisclosureConsent"];
                };
            };
            default: components["responses"]["ProblemResponse"];
        };
    };
    updateDisclosureConsent: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["DisclosureRequest"];
            };
        };
        responses: {
            /** @description 적용된 버전 관리형 공개 동의입니다. */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["DisclosureConsent"];
                };
            };
            default: components["responses"]["ProblemResponse"];
        };
    };
    withdrawDisclosureConsent: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description 공개 동의를 철회하고 동의 버전을 갱신했습니다. */
            204: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            default: components["responses"]["ProblemResponse"];
        };
    };
    previewDisclosure: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["DisclosureRequest"];
            };
        };
        responses: {
            /** @description 정확값 공개 미리보기와 절대 공개할 수 없는 항목 목록입니다. */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["DisclosurePreview"];
                };
            };
            default: components["responses"]["ProblemResponse"];
        };
    };
    getOnboarding: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description 현재 온보딩 초안 또는 완료 상태입니다. */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["OnboardingView"];
                };
            };
            default: components["responses"]["ProblemResponse"];
        };
    };
    completeOnboarding: {
        parameters: {
            query?: never;
            header: {
                /** @description 동일한 명령의 중복 처리를 막기 위한 클라이언트 생성 고유 키입니다. */
                "Idempotency-Key": components["parameters"]["IdempotencyKey"];
            };
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["CompleteOnboardingRequest"];
            };
        };
        responses: {
            /** @description 탐색 전용 상태로 온보딩을 완료했습니다. 주 목표는 나중에 확정할 수 있습니다. */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["OnboardingView"];
                };
            };
            default: components["responses"]["ProblemResponse"];
        };
    };
    confirmUserGoal: {
        parameters: {
            query?: never;
            header: {
                /** @description 동일한 명령의 중복 처리를 막기 위한 클라이언트 생성 고유 키입니다. */
                "Idempotency-Key": components["parameters"]["IdempotencyKey"];
            };
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["ConfirmUserGoalRequest"];
            };
        };
        responses: {
            /** @description 사용자에게 하나만 허용되는 활성 주 목표입니다. */
            201: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["UserGoal"];
                };
            };
            409: components["responses"]["ActiveGoalConflict"];
            default: components["responses"]["ProblemResponse"];
        };
    };
    getActiveUserGoal: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description 현재 활성화된 단일 주 목표입니다. */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["UserGoal"];
                };
            };
            404: components["responses"]["ProblemResponse"];
            default: components["responses"]["ProblemResponse"];
        };
    };
    getHome: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description 탐색 전용 또는 목표 활성 상태의 홈 화면 데이터입니다. */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HomeView"];
                };
            };
            default: components["responses"]["ProblemResponse"];
        };
    };
    getCurrentRaid: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description 금융 근거 데이터로 계산한 현재 레이드 상태입니다. */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["RaidView"];
                };
            };
            404: components["responses"]["ProblemResponse"];
            default: components["responses"]["ProblemResponse"];
        };
    };
    getCharacterReport: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description 조회할 캐릭터 금융 리포트 영역 */
                reportType: components["parameters"]["CharacterReportType"];
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description 네 캐릭터와 연결된 금융 리포트 중 하나입니다. */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["CharacterReport"];
                };
            };
            default: components["responses"]["ProblemResponse"];
        };
    };
    getMonthlyReport: {
        parameters: {
            query: {
                /** @description 조회 월(YYYY-MM) */
                month: components["parameters"]["Month"];
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description 월간 금융 및 활동 요약 리포트입니다. */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["MonthlyReport"];
                };
            };
            default: components["responses"]["ProblemResponse"];
        };
    };
    getMateFriendOverview: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description 읽기 전용 합성 친구 진행 현황과 비교 요약입니다. */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["MateFriendOverview"];
                };
            };
            default: components["responses"]["ProblemResponse"];
        };
    };
    getMateFriendFeed: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description 금액을 노출하지 않는 합성 친구 활동 피드입니다. */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["MateFriendFeed"];
                };
            };
            default: components["responses"]["ProblemResponse"];
        };
    };
    getMateFriendStreaks: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description 금액 없는 합성 공동 연속기록입니다. MVP에서는 읽기만 가능합니다. */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["MateStreakPage"];
                };
            };
            default: components["responses"]["ProblemResponse"];
        };
    };
    listMateGroups: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description 추천 조건을 충족한 그룹과 명시적인 합성 시연 그룹입니다. */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["MateGroupPage"];
                };
            };
            default: components["responses"]["ProblemResponse"];
        };
    };
    getMateGroupReport: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description 유사그룹 식별자 */
                groupId: components["parameters"]["GroupId"];
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description 익명 그룹의 범위, 분포와 목표 달성 모험가 미리보기입니다. */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["MateGroupReport"];
                };
            };
            default: components["responses"]["ProblemResponse"];
        };
    };
    listRecommendedAdventurers: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description 유사그룹 식별자 */
                groupId: components["parameters"]["GroupId"];
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description 선택한 그룹 안에서 추천된 익명 모험가 목록입니다. */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["RecommendedAdventurerPage"];
                };
            };
            default: components["responses"]["ProblemResponse"];
        };
    };
    getRecommendedAdventurer: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description 유사그룹 식별자 */
                groupId: components["parameters"]["GroupId"];
                /** @description 익명 모험가 식별자 */
                adventurerId: components["parameters"]["AdventurerId"];
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description 익명 모험가 한 명이 공개에 동의한 맥락 정보입니다. */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["RecommendedAdventurerCard"];
                };
            };
            default: components["responses"]["ProblemResponse"];
        };
    };
    getAdventurerReport: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description 유사그룹 식별자 */
                groupId: components["parameters"]["GroupId"];
                /** @description 익명 모험가 식별자 */
                adventurerId: components["parameters"]["AdventurerId"];
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description 범위 기반 비교와 모험가 루틴의 유지 근거입니다. */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdventurerReport"];
                };
            };
            default: components["responses"]["ProblemResponse"];
        };
    };
    getPublicFinancialProfile: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description 유사그룹 식별자 */
                groupId: components["parameters"]["GroupId"];
                /** @description 익명 모험가 식별자 */
                adventurerId: components["parameters"]["AdventurerId"];
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description 동의한 영역만 포함합니다. 상품과 매매 데이터는 정보 열람용입니다. */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["PublicFinancialProfile"];
                };
            };
            /** @description 프로필이 없거나 금융정보 공개 동의가 철회되었습니다. */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/problem+json": components["schemas"]["Problem"];
                };
            };
            default: components["responses"]["ProblemResponse"];
        };
    };
    getAdventurerRoutine: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description 유사그룹 식별자 */
                groupId: components["parameters"]["GroupId"];
                /** @description 익명 모험가 식별자 */
                adventurerId: components["parameters"]["AdventurerId"];
                /** @description 모험가 루틴 식별자 */
                routineId: components["parameters"]["RoutineId"];
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description 그룹 및 익명 모험가 맥락을 포함한 루틴 상세입니다. */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdventurerRoutine"];
                };
            };
            default: components["responses"]["ProblemResponse"];
        };
    };
    searchMateAdventurers: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["MateExploreSearchRequest"];
            };
        };
        responses: {
            /** @description 유사도와 루틴 유지기간으로 정렬된 최대 6명의 읽기 전용 합성 모험가입니다. */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["MateExploreSearchResponse"];
                };
            };
            default: components["responses"]["ProblemResponse"];
        };
    };
    createRoutineRecommendation: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["CreateRoutineRecommendationRequest"];
            };
        };
        responses: {
            /** @description 우선 추천 후보 하나와 선택 가능한 강도별 대안입니다. */
            201: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["RoutineRecommendation"];
                };
            };
            409: components["responses"]["RoutineRecommendationConflict"];
            422: components["responses"]["DataInsufficient"];
            default: components["responses"]["ProblemResponse"];
        };
    };
    importRoutineAdaptationCandidate: {
        parameters: {
            query?: never;
            header: {
                /** @description 동일한 명령의 중복 처리를 막기 위한 클라이언트 생성 고유 키입니다. */
                "Idempotency-Key": components["parameters"]["IdempotencyKey"];
            };
            path: {
                /** @description 루틴 개인화 결과 식별자 */
                adaptationId: components["parameters"]["AdaptationId"];
                /** @description 개인화 루틴 후보 식별자 */
                candidateId: components["parameters"]["CandidateId"];
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description 기존 활성 루틴이 없을 때 생성된 새 활성 루틴입니다. */
            201: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ActiveRoutineBuild"];
                };
            };
            409: components["responses"]["RoutineImportConflict"];
            default: components["responses"]["ProblemResponse"];
        };
    };
    getActiveRoutineBuild: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description 사용자에게 하나만 허용되는 현재 활성 루틴입니다. */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ActiveRoutineBuild"];
                };
            };
            404: components["responses"]["ProblemResponse"];
            default: components["responses"]["ProblemResponse"];
        };
    };
    replaceActiveRoutineBuild: {
        parameters: {
            query?: never;
            header: {
                /** @description 동일한 명령의 중복 처리를 막기 위한 클라이언트 생성 고유 키입니다. */
                "Idempotency-Key": components["parameters"]["IdempotencyKey"];
            };
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["ReplaceActiveRoutineBuildRequest"];
            };
        };
        responses: {
            /** @description 기존 루틴을 보관하고 후보 루틴을 하나의 트랜잭션으로 활성화했습니다. */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["RoutineBuildReplacement"];
                };
            };
            default: components["responses"]["ProblemResponse"];
        };
    };
    getRelatedHanaProductInfo: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description 검수 상품 식별자 */
                productId: components["parameters"]["ProductId"];
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description 또래 및 루틴 데이터와 분리된 검수 완료 정보성 상품 항목입니다. */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["RelatedHanaProductInfo"];
                };
            };
            409: components["responses"]["GoalRequired"];
            default: components["responses"]["ProblemResponse"];
        };
    };
    listQuests: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description 퀘스트 탭 전체 화면 데이터입니다. */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["QuestPage"];
                };
            };
            default: components["responses"]["ProblemResponse"];
        };
    };
    getQuest: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description 퀘스트 식별자 */
                questId: components["parameters"]["QuestId"];
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description 퀘스트 상세와 완료 검증 규칙입니다. */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Quest"];
                };
            };
            default: components["responses"]["ProblemResponse"];
        };
    };
    acceptQuest: {
        parameters: {
            query?: never;
            header: {
                /** @description 동일한 명령의 중복 처리를 막기 위한 클라이언트 생성 고유 키입니다. */
                "Idempotency-Key": components["parameters"]["IdempotencyKey"];
            };
            path: {
                /** @description 퀘스트 식별자 */
                questId: components["parameters"]["QuestId"];
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description 금융 스탯 변경 없이 수락된 퀘스트입니다. */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["QuestAcceptance"];
                };
            };
            409: components["responses"]["GoalRequired"];
            default: components["responses"]["ProblemResponse"];
        };
    };
    completeQuest: {
        parameters: {
            query?: never;
            header: {
                /** @description 동일한 명령의 중복 처리를 막기 위한 클라이언트 생성 고유 키입니다. */
                "Idempotency-Key": components["parameters"]["IdempotencyKey"];
            };
            path: {
                /** @description 퀘스트 식별자 */
                questId: components["parameters"]["QuestId"];
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description 행동 완료로 XP와 내부 보상만 지급했으며 금융 스탯은 변경하지 않았습니다. */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["QuestCompletion"];
                };
            };
            /** @description 합성 마이데이터 재계산을 통해 금융 근거가 확인되기를 기다립니다. */
            202: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["QuestCompletion"];
                };
            };
            default: components["responses"]["ProblemResponse"];
        };
    };
    listDailyRecords: {
        parameters: {
            query: {
                /** @description 조회 시작일(포함) */
                from: string;
                /** @description 조회 종료일(포함) */
                to: string;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description 기간 내 일일 기록 페이지입니다. */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["DailyRecordPage"];
                };
            };
            default: components["responses"]["ProblemResponse"];
        };
    };
    getDailyJourneyMonth: {
        parameters: {
            query: {
                /** @description 조회 월(YYYY-MM) */
                month: components["parameters"]["Month"];
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description 날짜 순서가 보장된 월간 발판형 금융 여정입니다. */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["DailyJourneyMonth"];
                };
            };
            default: components["responses"]["ProblemResponse"];
        };
    };
    getDailyRecord: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description 조회할 기록 날짜 */
                date: components["parameters"]["RecordDate"];
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description 일일 기록 바텀시트에 표시할 상세 데이터입니다. */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["DailyRecord"];
                };
            };
            default: components["responses"]["ProblemResponse"];
        };
    };
    saveDailyReflection: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description 조회할 기록 날짜 */
                date: components["parameters"]["RecordDate"];
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["SaveReflectionRequest"];
            };
        };
        responses: {
            /** @description 회고가 저장된 일일 기록입니다. 금융 계산값은 변경되지 않습니다. */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["DailyRecord"];
                };
            };
            default: components["responses"]["ProblemResponse"];
        };
    };
    getPointLedger: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description 양도할 수 없는 내부 포인트 잔액과 원장입니다. */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["PointLedgerView"];
                };
            };
            default: components["responses"]["ProblemResponse"];
        };
    };
    listCosmetics: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description 확정형 꾸미기 항목만 포함하며 현금, 쿠폰, 랜덤 상자와 리포트 잠금은 없습니다. */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["CosmeticCatalogView"];
                };
            };
            default: components["responses"]["ProblemResponse"];
        };
    };
    purchaseCosmetic: {
        parameters: {
            query?: never;
            header: {
                /** @description 동일한 명령의 중복 처리를 막기 위한 클라이언트 생성 고유 키입니다. */
                "Idempotency-Key": components["parameters"]["IdempotencyKey"];
            };
            path: {
                /** @description 꾸미기 상품 식별자 */
                cosmeticId: components["parameters"]["CosmeticId"];
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description 내부 포인트로 처리한 멱등한 확정형 꾸미기 구매 결과입니다. */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["CosmeticPurchase"];
                };
            };
            default: components["responses"]["ProblemResponse"];
        };
    };
    advanceDemoTimeline: {
        parameters: {
            query?: never;
            header: {
                /** @description 동일한 명령의 중복 처리를 막기 위한 클라이언트 생성 고유 키입니다. */
                "Idempotency-Key": components["parameters"]["IdempotencyKey"];
            };
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["AdvanceDemoTimelineRequest"];
            };
        };
        responses: {
            /** @description 결정적으로 재현되는 6단계 합성 타임라인과 현재 화면 데이터입니다. */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["DemoTimelineView"];
                };
            };
            default: components["responses"]["ProblemResponse"];
        };
    };
}
