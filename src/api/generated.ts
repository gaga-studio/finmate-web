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
        get: operations["getDisclosureConsent"];
        /** @description Activates only the fields that were previewed and explicitly confirmed as exact values. */
        put: operations["updateDisclosureConsent"];
        post?: never;
        /** @description Immediately opts out and removes every selected field from discovery and recommendation reads. */
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
        get: operations["getOnboarding"];
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
        /** @description Exact synthetic financial values selected by an active, granular disclosure consent. */
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
        get: operations["getDailyRecord"];
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
        /** @description Registered only under the demo profile and for synthetic users. */
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
         * @description Whole Korean won.
         */
        KrwAmount: number;
        /**
         * Format: int64
         * @description Signed whole Korean won.
         */
        SignedKrwAmount: number;
        BasisPoints: number;
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
            disposableIncomeKrw: components["schemas"]["KrwAmount"];
            spendingRateBps: components["schemas"]["BasisPoints"];
            savingRateBps: components["schemas"]["BasisPoints"];
            investmentJudgmentBps: components["schemas"]["BasisPoints"];
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
            spendingDefenseBps: components["schemas"]["BasisPoints"];
            savingHpBps: components["schemas"]["BasisPoints"];
            investmentJudgmentBps: components["schemas"]["BasisPoints"];
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
            totalAssetsKrw: components["schemas"]["KrwAmount"];
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
            scoreBps: components["schemas"]["BasisPoints"];
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
            friendId: string;
            alias: string;
            avatarCode: string;
            questCompletedToday: boolean;
        };
        /** @description Read-only friend summary. friendCount is the number of accepted friend relationships, not the denominator for financial-stat averages. Source aggregation tracks scoredFriendCount separately when averages are exposed by a future contract. */
        MateFriendOverview: {
            /** @description Total accepted friends; do not interpret as scoredFriendCount. */
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
            /** @description Fixed internal points offered after the quest's verification rule succeeds. */
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
            /** @description Positive for EARN and negative for SPEND. */
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
            primaryActivity: components["schemas"]["DailyActivity"];
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
        /** @description Authenticated email/password session. */
        AuthSessionResponse: {
            headers: {
                "Set-Cookie": components["headers"]["RefreshCookie"];
                [name: string]: unknown;
            };
            content: {
                "application/json": components["schemas"]["AuthSession"];
            };
        };
        /** @description RFC 7807 problem. */
        ProblemResponse: {
            headers: {
                [name: string]: unknown;
            };
            content: {
                "application/problem+json": components["schemas"]["Problem"];
            };
        };
        /** @description An active goal is required for this command. */
        GoalRequired: {
            headers: {
                [name: string]: unknown;
            };
            content: {
                "application/problem+json": components["schemas"]["Problem"];
            };
        };
        /** @description A main goal is already active. */
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
        /** @description Goal is missing or an active routine requires explicit replacement. */
        RoutineImportConflict: {
            headers: {
                [name: string]: unknown;
            };
            content: {
                "application/problem+json": components["schemas"]["Problem"];
            };
        };
        /** @description A goal is missing or the synthetic source data is stale. */
        RoutineRecommendationConflict: {
            headers: {
                [name: string]: unknown;
            };
            content: {
                "application/problem+json": components["schemas"]["Problem"];
            };
        };
        /** @description The last synthetic calculation is too old for this command. */
        DataStale: {
            headers: {
                [name: string]: unknown;
            };
            content: {
                "application/problem+json": components["schemas"]["Problem"];
            };
        };
        /** @description Synthetic source periods or classifications are insufficient. */
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
        IdempotencyKey: string;
        /** @description Opaque 30-day refresh token held only in a browser cookie. */
        RefreshCookie: string;
        GroupId: string;
        AdventurerId: string;
        RoutineId: string;
        AdaptationId: string;
        CandidateId: string;
        ProductId: string;
        CosmeticId: string;
        QuestId: string;
        RecordDate: string;
        CharacterReportType: components["schemas"]["CharacterReportType"];
        Month: string;
    };
    requestBodies: never;
    headers: {
        /**
         * @description Rotated opaque refresh token with secure browser attributes.
         * @example finmate_refresh=opaque-token; Path=/api/v1/auth; Max-Age=2592000; HttpOnly; SameSite=Lax; Secure
         */
        RefreshCookie: string;
        /**
         * @description Revokes the browser cookie with the same attributes and Max-Age=0.
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
                /** @description Opaque 30-day refresh token held only in a browser cookie. */
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
                /** @description Opaque 30-day refresh token held only in a browser cookie. */
                finmate_refresh: components["parameters"]["RefreshCookie"];
            };
        };
        requestBody?: never;
        responses: {
            /** @description Refresh session revoked and browser cookie cleared. */
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
            /** @description Current granular disclosure consent. New users are opted out by default. */
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
            /** @description Active versioned disclosure consent. */
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
            /** @description Disclosure withdrawn and version advanced. */
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
            /** @description Exact-value preview plus fields that can never be disclosed. */
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
            /** @description Current onboarding draft or completed state. */
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
            /** @description Onboarding completed in explore-only mode; a goal may be confirmed later. */
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
            /** @description The user's one active main goal. */
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
            /** @description The one active main goal. */
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
            /** @description Explore-only or goal-active home projection. */
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
            /** @description Current raid projection calculated from financial evidence. */
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
                reportType: components["parameters"]["CharacterReportType"];
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description One of the four character-backed financial reports. */
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
                month: components["parameters"]["Month"];
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Monthly financial and activity report. */
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
            /** @description Synthetic read-only friend progress and comparison summary. */
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
            /** @description Amount-free synthetic friend activity feed. */
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
            /** @description Amount-free synthetic shared streaks. This resource is read-only in MVP. */
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
            /** @description Eligible groups and explicit synthetic demo groups. */
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
                groupId: components["parameters"]["GroupId"];
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Anonymous group ranges, distributions, and goal-achiever preview. */
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
                groupId: components["parameters"]["GroupId"];
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Anonymous adventurers recommended inside the selected group. */
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
                groupId: components["parameters"]["GroupId"];
                adventurerId: components["parameters"]["AdventurerId"];
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description One anonymous adventurer's approved public context. */
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
                groupId: components["parameters"]["GroupId"];
                adventurerId: components["parameters"]["AdventurerId"];
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Range-based comparison and evidence for the adventurer's routines. */
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
                groupId: components["parameters"]["GroupId"];
                adventurerId: components["parameters"]["AdventurerId"];
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Only consented sections are present. Product and trade data are information-only. */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["PublicFinancialProfile"];
                };
            };
            /** @description Profile missing or its disclosure consent has been withdrawn. */
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
                groupId: components["parameters"]["GroupId"];
                adventurerId: components["parameters"]["AdventurerId"];
                routineId: components["parameters"]["RoutineId"];
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Routine detail in group and anonymous adventurer context. */
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
            /** @description Synthetic read-only adventurers for an approved filter combination. */
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
            /** @description One recommended candidate plus optional intensity alternatives. */
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
                "Idempotency-Key": components["parameters"]["IdempotencyKey"];
            };
            path: {
                adaptationId: components["parameters"]["AdaptationId"];
                candidateId: components["parameters"]["CandidateId"];
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description New active routine build when none exists. */
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
            /** @description The one global active routine build. */
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
            /** @description Previous build archived and candidate build activated atomically. */
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
                productId: components["parameters"]["ProductId"];
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Reviewed informational catalog item, separate from peer and routine data. */
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
            /** @description Quest tab projection. */
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
                questId: components["parameters"]["QuestId"];
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Quest detail and verification rule. */
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
                "Idempotency-Key": components["parameters"]["IdempotencyKey"];
            };
            path: {
                questId: components["parameters"]["QuestId"];
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Available quest accepted without changing financial stats. */
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
                "Idempotency-Key": components["parameters"]["IdempotencyKey"];
            };
            path: {
                questId: components["parameters"]["QuestId"];
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Behavior completion grants XP/internal rewards without financial-stat change. */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["QuestCompletion"];
                };
            };
            /** @description Financial evidence awaits synthetic MyData recalculation. */
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
                from: string;
                to: string;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Daily record page. */
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
                month: components["parameters"]["Month"];
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Ordered monthly stepping-stone journey. */
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
                date: components["parameters"]["RecordDate"];
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description One daily record for the bottom sheet. */
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
            /** @description Daily record with saved reflection; calculations are unchanged. */
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
            /** @description Non-transferable internal point balance and ledger. */
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
            /** @description Fixed cosmetic items only; no cash, coupon, random box, or report lock. */
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
                "Idempotency-Key": components["parameters"]["IdempotencyKey"];
            };
            path: {
                cosmeticId: components["parameters"]["CosmeticId"];
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Idempotent fixed cosmetic purchase with internal points. */
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
            /** @description Deterministic six-frame synthetic timeline and current projections. */
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
