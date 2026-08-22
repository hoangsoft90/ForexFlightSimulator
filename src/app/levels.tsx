import React, { useState, useCallback, useMemo } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SectionList } from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTraderStore } from '@/store/trader-store';
import { useSessionStore } from '@/store/session-store';
import {
  LEVELS,
  getPacksForLevel,
  getLevelProgress,
  getUnlockedLevels,
} from '@/data/packs';
import { colors, spacing, font, radius } from '@/constants/theme';
import {
  IconArrowLeft,
  IconCheck,
  IconPlayerPlay,
  IconLock,
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

interface SectionData {
  title: string;
  titleVi: string;
  level: number;
  color: string;
  unlocked: boolean;
  data: ScenarioPack[];
  progress: { total: number; completed: number; percentage: number };
}

export default function LevelsScreen() {
  const { completedPacks, scores, level: traderLevel, sub, rank, sessionsCompleted, currentLevelProgress } = useTraderStore();
  const { startSession } = useSessionStore();
  const insets = useSafeAreaInsets();
  const { t, lang } = useI18n();

  const unlockedLevels = useMemo(
    () => getUnlockedLevels({ scores, level: traderLevel, sub, rank, sessionsCompleted, completedPacks, currentLevelProgress }),
    [scores, traderLevel, sub, rank, sessionsCompleted, completedPacks, currentLevelProgress],
  );

  const sections: SectionData[] = useMemo(() => {
    return LEVELS.map((levelDef) => {
      const packs = getPacksForLevel(levelDef.level);
      const progress = getLevelProgress(levelDef.level, completedPacks);
      const isUnlocked = unlockedLevels.includes(levelDef.level);

      return {
        title: `Level ${levelDef.level}: ${levelDef.name}`,
        titleVi: `Cấp ${levelDef.level}: ${levelDef.nameVi}`,
        level: levelDef.level,
        color: levelDef.color,
        unlocked: isUnlocked,
        data: isUnlocked ? packs : [], // Don't show packs if locked
        progress,
      };
    });
  }, [completedPacks, unlockedLevels]);

  const handleSelectPack = (pack: ScenarioPack) => {
    startSession(pack);
    router.push('/decision');
  };

  const renderSectionHeader = useCallback(
    ({ section }: { section: SectionData }) => (
      <View style={[styles.sectionHeader, { borderLeftColor: section.color }]}>
        <View style={styles.sectionHeaderLeft}>
          <Text style={styles.sectionTitle}>
            {lang === 'vi' ? section.titleVi : section.title}
          </Text>
          {!section.unlocked && (
            <View style={styles.lockBadge}>
              <IconLock size={10} color={colors.textMuted} strokeWidth={2} />
              <Text style={styles.lockText}>{lang === 'vi' ? 'Khóa' : 'Locked'}</Text>
            </View>
          )}
        </View>
        <Text style={styles.sectionProgress}>
          {section.progress.completed}/{section.progress.total}
        </Text>
      </View>
    ),
    [lang],
  );

  const renderItem = useCallback(
    ({ item: pack, index, section }: { item: ScenarioPack; index: number; section: SectionData }) => {
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
              {lang === 'vi' ? pack.setupTypeVi : pack.referenceZone.setupType}
            </Text>
            <Text style={styles.cardPrompt} numberOfLines={1}>
              {lang === 'vi' ? pack.contextPromptVi : pack.contextPrompt}
            </Text>
          </View>

          {/* Arrow */}
          <IconPlayerPlay size={18} color={colors.textMuted} strokeWidth={1.5} />
        </TouchableOpacity>
      );
    },
    [completedPacks, lang],
  );

  const keyExtractor = useCallback((item: ScenarioPack) => item.id, []);

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

      <SectionList
        sections={sections}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        renderSectionHeader={renderSectionHeader}
        stickySectionHeadersEnabled={false}
        // Performance tuning
        initialNumToRender={15}
        maxToRenderPerBatch={10}
        windowSize={5}
        removeClippedSubviews={true}
        contentContainerStyle={{
          padding: spacing.xl,
          paddingBottom: insets.bottom + 72,
          gap: spacing.sm,
        }}
        ListFooterComponent={
          <Text style={styles.footerText}>
            {t('levels.allLoaded', { count: 100 })}
          </Text>
        }
      />

      {/* Fixed ad banner */}
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
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: radius.sm,
    borderLeftWidth: 3,
    marginTop: spacing.sm,
  },
  sectionHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  sectionTitle: {
    fontSize: font.md,
    fontWeight: '600',
    color: colors.text,
  },
  sectionProgress: {
    fontSize: font.sm,
    color: colors.textMuted,
  },
  lockBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.borderLight,
    paddingHorizontal: spacing.xs,
    paddingVertical: 2,
    borderRadius: 4,
  },
  lockText: {
    fontSize: font.xs,
    color: colors.textMuted,
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
  footerText: {
    fontSize: font.xs,
    color: colors.textMuted,
    textAlign: 'center',
    paddingVertical: spacing.lg,
  },
});
