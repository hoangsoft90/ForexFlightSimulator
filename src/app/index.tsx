import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTraderStore } from '@/store/trader-store';
import { PACKS } from '@/data/packs';
import { ScoreChip } from '@/components/score-chip';
import { colors, spacing, font, radius } from '@/constants/theme';
import { IconList, IconSettings } from '@tabler/icons-react-native';
import { AdBanner } from '@/components/ad-banner';
import { useI18n } from '@/i18n/context';

export default function HomeScreen() {
  const { scores, level, sub, rank, sessionsCompleted } = useTraderStore();
  const insets = useSafeAreaInsets();
  const { t } = useI18n();

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
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>L{level}</Text>
          </View>
        </View>

        {/* Level label */}
        <Text style={styles.levelLabel}>
          {t('home.level')} {level} · {t('home.sub')} {sub}
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
            {t('home.sessionsCompleted', { count: sessionsCompleted })}
          </Text>
        )}

        {/* Packs progress */}
        <View style={styles.packsPreview}>
          <Text style={styles.packsLabel}>{t('home.scenarioPacks')}</Text>
          <Text style={styles.packsCount}>{t('home.available', { count: PACKS.length })}</Text>
        </View>

        {/* CTA */}
        <TouchableOpacity
          style={styles.cta}
          onPress={() => router.push('/levels')}
          activeOpacity={0.8}
        >
          <IconList size={20} color="#FFFFFF" strokeWidth={2} />
          <Text style={styles.ctaText}>{t('home.chooseScenario')}</Text>
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
  packsPreview: {
    backgroundColor: '#F1F5F9',
    borderRadius: radius.sm,
    padding: spacing.md,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  packsLabel: {
    fontSize: font.sm,
    fontWeight: '500',
    color: colors.text,
  },
  packsCount: {
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
