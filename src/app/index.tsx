import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTraderStore } from '@/store/trader-store';
import { useSessionStore } from '@/store/session-store';
import { PACKS, getNextPack, getLevelDef, getLevelProgress, LEVELS } from '@/data/packs';
import { ScoreChip } from '@/components/score-chip';
import { colors, spacing, font, radius } from '@/constants/theme';
import { IconList, IconSettings, IconPlayerPlay } from '@tabler/icons-react-native';
import { AdBanner } from '@/components/ad-banner';
import { useI18n } from '@/i18n/context';

export default function HomeScreen() {
  const { scores, level, sub, rank, sessionsCompleted, completedPacks, currentLevelProgress } = useTraderStore();
  const { startSession } = useSessionStore();
  const insets = useSafeAreaInsets();
  const { t, lang } = useI18n();

  const nextPack = getNextPack({ scores, level, sub, rank, sessionsCompleted, completedPacks, currentLevelProgress });
  const levelDef = getLevelDef(level);
  const levelProgress = getLevelProgress(level, completedPacks);

  const handlePlayNext = () => {
    if (nextPack) {
      startSession(nextPack);
      router.push('/decision');
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={[
          styles.content,
          { paddingTop: insets.top + spacing.md, paddingBottom: insets.bottom + 72 },
        ]}
      >
        {/* Settings icon top-right */}
        <TouchableOpacity
          onPress={() => router.push('/settings')}
          style={[styles.settingsBtn, { marginTop: insets.top + spacing.md }]}
          activeOpacity={0.7}
        >
          <IconSettings size={20} color={colors.textMuted} strokeWidth={1.5} />
        </TouchableOpacity>

        {/* Avatar with level badge */}
        <View style={styles.avatarRow}>
          <View style={[styles.avatar, { borderColor: levelDef?.color ?? colors.primary }]}>
            <Text style={[styles.avatarText, { color: levelDef?.color ?? colors.primary }]}>L{level}</Text>
          </View>
        </View>

        {/* Level label */}
        <Text style={styles.levelLabel}>
          {lang === 'vi' ? levelDef?.nameVi : levelDef?.name} · {t('home.sub')} {sub}
        </Text>
        <Text style={styles.rankLabel}>{rank}</Text>

        {/* Level progress bar */}
        <View style={styles.progressContainer}>
          <View style={styles.progressHeader}>
            <Text style={styles.progressLabel}>
              {lang === 'vi' ? 'Tiến độ' : 'Progress'}
            </Text>
            <Text style={styles.progressValue}>
              {levelProgress.completed}/{levelProgress.total}
            </Text>
          </View>
          <View style={styles.progressBar}>
            <View
              style={[
                styles.progressFill,
                {
                  width: `${levelProgress.percentage}%`,
                  backgroundColor: levelDef?.color ?? colors.primary,
                },
              ]}
            />
          </View>
        </View>

        {/* 4-stat grid: Reading / Entry / Risk / Discipline */}
        <View style={styles.grid}>
          <ScoreChip label="Reading" value={scores.reading.value} icon="reading" />
          <ScoreChip label="Entry" value={scores.entry.value} icon="entry" />
          <ScoreChip label="Risk" value={scores.risk.value} icon="risk" />
          <ScoreChip label="Discipline" value={scores.discipline.value} icon="discipline" />
        </View>

        {/* Sessions completed */}
        {sessionsCompleted > 0 && (
          <Text style={styles.sessionCount}>
            {t('home.sessionsCompleted', { count: sessionsCompleted })}
          </Text>
        )}

        {/* Play Next Session button */}
        {nextPack ? (
          <TouchableOpacity
            style={styles.playBtn}
            onPress={handlePlayNext}
            activeOpacity={0.8}
          >
            <IconPlayerPlay size={20} color="#FFFFFF" strokeWidth={2} />
            <View style={styles.playBtnText}>
              <Text style={styles.playBtnLabel}>{lang === 'vi' ? 'TIẾP TỤC HỌC' : 'PLAY NEXT SESSION'}</Text>
              <Text style={styles.playBtnSub} numberOfLines={1}>
                {lang === 'vi' ? nextPack.setupTypeVi : nextPack.referenceZone.setupType}
              </Text>
            </View>
          </TouchableOpacity>
        ) : (
          <View style={styles.allDoneContainer}>
            <Text style={styles.allDoneText}>🎉 {lang === 'vi' ? 'Hoàn thành tất cả!' : 'All done!'}</Text>
          </View>
        )}

        {/* Choose scenario button */}
        <TouchableOpacity
          style={styles.chooseBtn}
          onPress={() => router.push('/levels')}
          activeOpacity={0.8}
        >
          <IconList size={18} color={colors.textSecondary} strokeWidth={1.5} />
          <Text style={styles.chooseBtnText}>{t('home.chooseScenario')}</Text>
        </TouchableOpacity>
      </ScrollView>

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
  content: {
    padding: spacing.xl,
    alignItems: 'center',
    gap: spacing.lg,
  },
  settingsBtn: {
    position: 'absolute',
    right: spacing.xl,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    zIndex: 10,
  },
  avatarRow: {
    marginTop: spacing.xxxl,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
  },
  avatarText: {
    fontSize: font.xxl,
    fontWeight: '600',
  },
  levelLabel: {
    fontSize: font.md,
    color: colors.textSecondary,
  },
  rankLabel: {
    fontSize: font.sm,
    color: colors.textMuted,
    marginTop: -spacing.sm,
  },
  progressContainer: {
    width: '100%',
    gap: spacing.xs,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  progressLabel: {
    fontSize: font.xs,
    color: colors.textMuted,
  },
  progressValue: {
    fontSize: font.xs,
    fontWeight: '500',
    color: colors.textSecondary,
  },
  progressBar: {
    height: 6,
    backgroundColor: colors.borderLight,
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    width: '100%',
  },
  sessionCount: {
    fontSize: font.sm,
    color: colors.textMuted,
  },
  playBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.md,
    backgroundColor: colors.primary,
    width: '100%',
    paddingVertical: spacing.lg,
    borderRadius: radius.sm,
    marginTop: spacing.md,
  },
  playBtnText: {
    alignItems: 'flex-start',
  },
  playBtnLabel: {
    color: '#FFFFFF',
    fontSize: font.md,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  playBtnSub: {
    color: '#FFFFFF',
    fontSize: font.xs,
    opacity: 0.8,
    marginTop: 2,
  },
  allDoneContainer: {
    backgroundColor: colors.green + '10',
    borderWidth: 1,
    borderColor: colors.green + '30',
    width: '100%',
    paddingVertical: spacing.lg,
    borderRadius: radius.sm,
    alignItems: 'center',
    marginTop: spacing.md,
  },
  allDoneText: {
    fontSize: font.md,
    fontWeight: '500',
    color: colors.green,
  },
  chooseBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    backgroundColor: colors.surface,
    width: '100%',
    paddingVertical: spacing.md,
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  chooseBtnText: {
    color: colors.textSecondary,
    fontSize: font.sm,
    fontWeight: '500',
  },
});
