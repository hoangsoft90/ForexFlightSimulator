import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTraderStore } from '@/store/trader-store';
import { useSessionStore } from '@/store/session-store';
import { PACKS } from '@/data/packs';
import { ScoreChip } from '@/components/score-chip';
import { colors, spacing, font, radius } from '@/constants/theme';
import { IconPlayerPlay } from '@tabler/icons-react-native';
import { AdBanner } from '@/components/ad-banner';

export default function HomeScreen() {
  const { scores, level, sub, rank, sessionsCompleted } = useTraderStore();
  const { startSession } = useSessionStore();
  const insets = useSafeAreaInsets();

  const handleStartSession = () => {
    // Cycle through packs: session 0 → pack 0, session 1 → pack 1, etc.
    const packIndex = sessionsCompleted % PACKS.length;
    const pack = PACKS[packIndex];
    startSession(pack);
    router.push('/decision');
  };

  // Show which scenario is next
  const nextPackIndex = sessionsCompleted % PACKS.length;
  const nextPack = PACKS[nextPackIndex];

  return (
    <ScrollView
      style={[styles.container, { paddingTop: insets.top }]}
      contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + spacing.xl }]}
    >
      {/* Avatar with level badge */}
      <View style={styles.avatarRow}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>L{level}</Text>
        </View>
      </View>

      {/* Level label */}
      <Text style={styles.levelLabel}>
        Level {level} · sub {sub}
      </Text>
      <Text style={styles.rankLabel}>{rank}</Text>

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
          {sessionsCompleted} session{sessionsCompleted !== 1 ? 's' : ''} completed
        </Text>
      )}

      {/* Next scenario preview */}
      <View style={styles.scenarioPreview}>
        <Text style={styles.scenarioLabel}>Next scenario</Text>
        <Text style={styles.scenarioName}>
          {nextPack.symbol} · {nextPack.timeframe} · {nextPack.referenceZone.setupType}
        </Text>
        <Text style={styles.scenarioHint} numberOfLines={1}>
          {nextPack.contextPrompt}
        </Text>
      </View>

      {/* CTA */}
      <TouchableOpacity
        style={styles.cta}
        onPress={handleStartSession}
        activeOpacity={0.8}
      >
        <IconPlayerPlay size={20} color="#FFFFFF" strokeWidth={2} />
        <Text style={styles.ctaText}>Start session</Text>
      </TouchableOpacity>
      {/* Banner Ad */}
      <AdBanner />
    </ScrollView>
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
    borderColor: colors.primary,
  },
  avatarText: {
    fontSize: font.xxl,
    fontWeight: '600',
    color: colors.primary,
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
  scenarioPreview: {
    backgroundColor: '#F1F5F9',
    borderRadius: radius.sm,
    padding: spacing.md,
    width: '100%',
    gap: 4,
  },
  scenarioLabel: {
    fontSize: font.xs,
    color: colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  scenarioName: {
    fontSize: font.sm,
    fontWeight: '600',
    color: colors.text,
  },
  scenarioHint: {
    fontSize: font.xs,
    color: colors.textSecondary,
  },
  cta: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    backgroundColor: colors.primary,
    width: '100%',
    paddingVertical: spacing.lg,
    borderRadius: radius.sm,
    marginTop: spacing.md,
  },
  ctaText: {
    color: '#FFFFFF',
    fontSize: font.md,
    fontWeight: '500',
  },
});
