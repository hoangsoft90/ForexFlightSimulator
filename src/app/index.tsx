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
    const pack = PACKS[0]; // MVP: only one pack
    startSession(pack);
    router.push('/decision');
  };

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

      {/* CTA */}
      <TouchableOpacity
        style={styles.cta}
        onPress={handleStartSession}
        activeOpacity={0.8}
      >
        <IconPlayerPlay size={20} color="#FFFFFF" strokeWidth={2} />
        <Text style={styles.ctaText}>Today's session</Text>
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
