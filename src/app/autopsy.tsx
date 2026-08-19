import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, BackHandler, Platform } from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useSessionStore } from '@/store/session-store';
import { useTraderStore } from '@/store/trader-store';
import { ResultBadge } from '@/components/result-badge';
import { InsightBlock } from '@/components/insight-block';
import { formatPrice, formatTime } from '@/lib/format';
import { colors, spacing, font, radius } from '@/constants/theme';
import { IconChevronLeft, IconClock } from '@tabler/icons-react-native';
import { showInterstitial, preloadInterstitial } from '@/lib/ads';

export default function AutopsyScreen() {
  const { pack, decision, autopsy } = useSessionStore();
  const { completeSession } = useTraderStore();
  const insets = useSafeAreaInsets();

  // Persist scores on first render (only runs once thanks to Zustand)
  useEffect(() => {
    if (autopsy?.scores) {
      completeSession(autopsy.scores);
    }
  }, [autopsy?.scores, completeSession]);

  // Android hardware back: always go to Home (not back to Decision)
  useEffect(() => {
    if (Platform.OS !== 'android') return;
    const handler = BackHandler.addEventListener('hardwareBackPress', () => {
      router.dismissAll();
      return true; // handled
    });
    return () => handler.remove();
  }, []);

  if (!decision || !autopsy || !pack) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>No autopsy data</Text>
        <TouchableOpacity onPress={() => router.replace('/')}>
          <Text style={styles.linkText}>Go home</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const { rootCause, positiveNote } = autopsy;

  // Build timeline entries from decision log
  const timelineEntries = [
    {
      time: decision.log[0]?.timestamp ?? 0,
      label: decision.action === 'wait'
        ? 'Decided to wait'
        : `Entered ${decision.action.toUpperCase()} at ${formatPrice(decision.entryPrice ?? 0)}`,
    },
    ...(decision.result && decision.result !== 'skipped'
      ? [{
          time: decision.log[decision.log.length - 1]?.timestamp ?? 0,
          label: decision.result === 'win'
            ? `Take profit at ${formatPrice(decision.resultPrice ?? 0)}`
            : decision.result === 'loss'
              ? `Stop loss at ${formatPrice(decision.resultPrice ?? 0)}`
              : 'Closed at breakeven',
        }]
      : []),
  ];

  return (
    <ScrollView
      style={[styles.container, { paddingTop: insets.top }]}
      contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + spacing.xl }]}
    >
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.dismissAll()} style={styles.backBtn}>
          <IconChevronLeft size={24} color={colors.text} strokeWidth={2} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Trade Autopsy</Text>
        <View style={styles.backBtn} />
      </View>

      {/* 1. Result badge — always first per design.md §3 */}
      <ResultBadge
        result={decision.result ?? 'skipped'}
        pips={decision.pips ?? 0}
        resultPrice={decision.resultPrice}
        action={decision.action}
      />

      {/* 2. Timeline — max 4 lines, HH:MM + clock icon + description */}
      <View style={styles.timelineSection}>
        <Text style={styles.sectionLabel}>Timeline</Text>
        <View style={styles.timeline}>
          {timelineEntries.map((entry, i) => (
            <View key={i} style={styles.timelineRow}>
              <IconClock size={12} color={colors.textMuted} strokeWidth={1.5} />
              <Text style={styles.timelineTime}>{formatTime(entry.time)}</Text>
              <Text style={styles.timelineLabel}>{entry.label}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* 3. Root cause — amber block, per design.md §3 */}
      <InsightBlock
        variant="error"
        label={rootCause.label}
        description={rootCause.description}
      />

      {/* 4. What you did right — green block, ALWAYS present per design.md §0 + plan §2.6 */}
      <InsightBlock
        variant="positive"
        label={positiveNote.label}
        description={positiveNote.description}
      />

      {/* Back to Home — show interstitial ad if ready, then reset stack to root */}
      <TouchableOpacity
        style={styles.homeBtn}
        onPress={() => {
          const shown = showInterstitial();
          if (!shown) preloadInterstitial(); // prep for next time
          router.dismissAll();
        }}
        activeOpacity={0.8}
      >
        <Text style={styles.homeBtnText}>Back to profile</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  content: {
    padding: spacing.lg,
    gap: spacing.lg,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.md,
  },
  errorText: {
    fontSize: font.md,
    color: colors.textSecondary,
  },
  linkText: {
    fontSize: font.md,
    color: colors.primary,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backBtn: {
    width: 40,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: font.md,
    fontWeight: '500',
    color: colors.text,
  },
  timelineSection: {
    gap: spacing.sm,
  },
  sectionLabel: {
    fontSize: font.xs,
    color: colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  timeline: {
    gap: spacing.sm,
    backgroundColor: colors.surface,
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: colors.borderLight,
    padding: spacing.md,
  },
  timelineRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  timelineTime: {
    fontSize: font.sm,
    color: colors.textMuted,
    fontVariant: ['tabular-nums'],
    minWidth: 36,
  },
  timelineLabel: {
    fontSize: font.sm,
    color: colors.text,
    flex: 1,
  },
  homeBtn: {
    backgroundColor: colors.primary,
    paddingVertical: spacing.md,
    borderRadius: radius.sm,
    alignItems: 'center',
  },
  homeBtnText: {
    color: '#FFFFFF',
    fontSize: font.md,
    fontWeight: '500',
  },
});
