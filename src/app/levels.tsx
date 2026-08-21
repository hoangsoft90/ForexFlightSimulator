import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList } from 'react-native';
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

export default function LevelsScreen() {
  const { completedPacks } = useTraderStore();
  const { startSession } = useSessionStore();
  const insets = useSafeAreaInsets();

  const handleSelectPack = (pack: ScenarioPack) => {
    startSession(pack);
    router.push('/decision');
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <IconArrowLeft size={22} color={colors.text} strokeWidth={2} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Scenario Packs</Text>
        <View style={{ width: 36 }} />
      </View>

      <FlatList
        data={PACKS}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: spacing.xl, paddingBottom: insets.bottom + spacing.xl, gap: spacing.sm }}
        ListHeaderComponent={
          <Text style={styles.progressText}>
            {completedPacks.length}/{PACKS.length} completed
          </Text>
        }
        renderItem={({ item: pack, index }) => {
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
        }}
      />
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
  content: {
    padding: spacing.xl,
    gap: spacing.sm,
  },
  progressText: {
    fontSize: font.sm,
    color: colors.textMuted,
    marginBottom: spacing.sm,
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
