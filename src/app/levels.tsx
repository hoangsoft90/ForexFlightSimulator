import React, { useState, useCallback, useMemo } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList, ActivityIndicator } from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTraderStore } from '@/store/trader-store';
import { useSessionStore } from '@/store/session-store';
import { PACKS } from '@/data/packs';
import { colors, spacing, font, radius } from '@/constants/theme';
import {
  IconArrowLeft,
  IconCheck,
  IconPlayerPlay,
} from '@tabler/icons-react-native';
import { AdBanner } from '@/components/ad-banner';
import { useI18n } from '@/i18n/context';
import type { ScenarioPack } from '@/lib/types';

const SETUP_COLORS: Record<string, string> = {
  pullback: colors.green,
  'trend-continuation': colors.blue,
  'head-and-shoulders': colors.amber,
  'double-bottom': colors.green,
  'news-spike': colors.red,
  range: colors.textSecondary,
};

function getSetupColor(setupType: string): string {
  const key = Object.keys(SETUP_COLORS).find((k) =>
    setupType.toLowerCase().includes(k),
  );
  return key ? SETUP_COLORS[key] : colors.primary;
}

// ── Lazy loading config ────────────────────────────────────────────────────────
const INITIAL_BATCH = 20;
const LOAD_MORE_BATCH = 15;
const CARD_HEIGHT = 80; // estimated card height for getItemLayout

export default function LevelsScreen() {
  const { completedPacks } = useTraderStore();
  const { startSession } = useSessionStore();
  const insets = useSafeAreaInsets();
  const { t } = useI18n();

  const [visibleCount, setVisibleCount] = useState(INITIAL_BATCH);
  const [loadingMore, setLoadingMore] = useState(false);

  const visiblePacks = useMemo(() => PACKS.slice(0, visibleCount), [visibleCount]);
  const hasMore = visibleCount < PACKS.length;

  const handleSelectPack = (pack: ScenarioPack) => {
    startSession(pack);
    router.push('/decision');
  };

  const handleEndReached = useCallback(() => {
    if (!hasMore || loadingMore) return;
    setLoadingMore(true);
    // Simulate a tiny delay so the spinner is visible (prevents jank)
    setTimeout(() => {
      setVisibleCount((prev) => Math.min(prev + LOAD_MORE_BATCH, PACKS.length));
      setLoadingMore(false);
    }, 150);
  }, [hasMore, loadingMore]);

  const renderItem = useCallback(({ item: pack, index }: { item: ScenarioPack; index: number }) => {
    const isCompleted = completedPacks.includes(pack.id);
    const setupColor = getSetupColor(pack.referenceZone.setupType);

    return (
      <TouchableOpacity
        style={[styles.card, isCompleted && styles.cardCompleted]}
        onPress={() => handleSelectPack(pack)}
        activeOpacity={0.7}
      >
        {/* Number badge */}
        <View style={[styles.numberBadge, { backgroundColor: setupColor + '15' }]}>
          <Text style={[styles.numberText, { color: setupColor }]}>
            {index + 1}
          </Text>
        </View>

        {/* Card content */}
        <View style={styles.cardBody}>
          <View style={styles.cardTop}>
            <Text style={styles.cardTitle}>{pack.symbol}</Text>
            <Text style={styles.cardTimeframe}>{pack.timeframe}</Text>
            {isCompleted && (
              <View style={[styles.checkBadge, { backgroundColor: colors.green }]}>
                <IconCheck size={12} color="#FFFFFF" strokeWidth={3} />
              </View>
            )}
          </View>
          <Text style={[styles.cardSetup, { color: setupColor }]}>
            {pack.referenceZone.setupType}
          </Text>
          <Text style={styles.cardPrompt} numberOfLines={1}>
            {pack.contextPrompt}
          </Text>
        </View>

        {/* Arrow */}
        <IconPlayerPlay size={18} color={colors.textMuted} strokeWidth={1.5} />
      </TouchableOpacity>
    );
  }, [completedPacks, startSession]);

  const keyExtractor = useCallback((item: ScenarioPack) => item.id, []);

  // getItemLayout for FlatList optimization — avoids measuring each card
  const getItemLayout = useCallback((_: any, index: number) => ({
    length: CARD_HEIGHT + 8, // card height + gap
    offset: (CARD_HEIGHT + 8) * index,
    index,
  }), []);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + spacing.sm }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <IconArrowLeft size={22} color={colors.text} strokeWidth={2} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t('levels.title')}</Text>
        <View style={{ width: 36 }} />
      </View>

      <FlatList
        data={visiblePacks}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        getItemLayout={getItemLayout}
        // Performance tuning for 100 items
        initialNumToRender={INITIAL_BATCH}
        maxToRenderPerBatch={LOAD_MORE_BATCH}
        windowSize={5}
        removeClippedSubviews={true}
        // Lazy loading
        onEndReached={handleEndReached}
        onEndReachedThreshold={0.4}
        ListHeaderComponent={
          <Text style={styles.progressText}>
            {t('levels.completed', { done: completedPacks.length, total: PACKS.length })}
          </Text>
        }
        ListFooterComponent={
          loadingMore ? (
            <ActivityIndicator style={{ paddingVertical: spacing.lg }} color={colors.primary} />
          ) : hasMore ? (
            <Text style={styles.loadMoreHint}>
              {t('levels.scrollMore')}
            </Text>
          ) : (
            <Text style={styles.loadMoreHint}>
              {t('levels.allLoaded', { count: PACKS.length })}
            </Text>
          )
        }
        contentContainerStyle={{
          padding: spacing.xl,
          paddingBottom: insets.bottom + 72, // space for fixed AdBanner
          gap: spacing.sm,
        }}
      />

      {/* Fixed ad banner — always above Android nav bar */}
      <AdBanner />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  headerTitle: {
    fontSize: font.lg,
    fontWeight: '600',
    color: colors.text,
  },
  progressText: {
    fontSize: font.sm,
    color: colors.textMuted,
    marginBottom: spacing.sm,
  },
  loadMoreHint: {
    fontSize: font.xs,
    color: colors.textMuted,
    textAlign: 'center',
    paddingVertical: spacing.lg,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: radius.sm,
    padding: spacing.lg,
    gap: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  cardCompleted: {
    borderColor: colors.green + '30',
    backgroundColor: colors.green + '05',
  },
  numberBadge: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  numberText: {
    fontSize: font.lg,
    fontWeight: '700',
  },
  cardBody: {
    flex: 1,
    gap: 2,
  },
  cardTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  cardTitle: {
    fontSize: font.md,
    fontWeight: '600',
    color: colors.text,
  },
  cardTimeframe: {
    fontSize: font.xs,
    color: colors.textMuted,
    backgroundColor: colors.borderLight,
    paddingHorizontal: spacing.xs,
    paddingVertical: 1,
    borderRadius: 4,
    overflow: 'hidden',
  },
  checkBadge: {
    width: 18,
    height: 18,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardSetup: {
    fontSize: font.sm,
    fontWeight: '500',
    textTransform: 'capitalize',
  },
  cardPrompt: {
    fontSize: font.xs,
    color: colors.textMuted,
    marginTop: 2,
  },
});
