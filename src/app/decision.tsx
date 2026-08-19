import React, { useState, useCallback, useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, BackHandler } from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useSessionStore } from '@/store/session-store';
import { CandleChart } from '@/components/candle-chart';
import { ActionButtons } from '@/components/action-buttons';
import { ResultBadge } from '@/components/result-badge';
import { computeOutcome } from '@/lib/outcome';
import { computeAllScores } from '@/lib/scoring';
import { findRootCause, findPositiveNote } from '@/lib/rootCauses';
import { colors, spacing, font, radius } from '@/constants/theme';
import { IconChevronLeft, IconChartCandle } from '@tabler/icons-react-native';
import type { ActionType, SessionDecision, TradeResult } from '@/lib/types';
import type { ExtendedReferenceZone } from '@/data/packs';

type Phase = 'deciding' | 'reveal' | 'result';

export default function DecisionScreen() {
  const { pack, setDecision, setAutopsy } = useSessionStore();
  const insets = useSafeAreaInsets();

  const [phase, setPhase] = useState<Phase>('deciding');
  const [action, setAction] = useState<ActionType | null>(null);
  const [outcome, setOutcome] = useState<{ result: TradeResult; resultPrice: number; pips: number } | null>(null);
  const [visibleCount, setVisibleCount] = useState(12);
  const revealTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Clean up timers on unmount (prevents setState on unmounted component)
  useEffect(() => {
    return () => {
      if (revealTimer.current) clearTimeout(revealTimer.current);
    }
  }, []);

  // Deep-link guard: redirect to Home if no session data
  if (!pack) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>No scenario loaded</Text>
        <TouchableOpacity onPress={() => router.replace('/')}
          style={{ marginTop: 12 }}
        >
          <Text style={styles.linkText}>Go home</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const zone = pack.referenceZone as ExtendedReferenceZone;
  const decisionIndex = pack.decisionIndex;

  const handleAction = useCallback((selectedAction: ActionType) => {
    setAction(selectedAction);

    if (selectedAction === 'wait') {
      // For wait: log decision, compute reference outcome, go to result phase
      const decision: SessionDecision = {
        scenarioId: pack.id,
        action: 'wait',
        entryIndex: decisionIndex,
        log: [{
          type: 'enter',
          timestamp: pack.candles[decisionIndex].timestamp,
          price: pack.candles[decisionIndex].close,
          detail: 'Wait — no trade taken',
        }],
        result: 'skipped',
        pips: 0,
        refOutcome: computeOutcome(pack.candles, decisionIndex, zone.direction as ActionType, zone).result,
      };
      setDecision(decision);

      // Reveal a few more candles after decision
      setVisibleCount(15);
      setPhase('reveal');

      // After animation, show result
      revealTimer.current = setTimeout(() => {
        setOutcome({ result: 'skipped', resultPrice: 0, pips: 0 });
        setPhase('result');
      }, 1200);
    } else {
      // For buy/sell: compute outcome
      const oc = computeOutcome(pack.candles, decisionIndex, selectedAction, zone);

      const decision: SessionDecision = {
        scenarioId: pack.id,
        action: selectedAction,
        entryPrice: pack.candles[decisionIndex].close,
        entryIndex: decisionIndex,
        log: [{
          type: 'enter',
          timestamp: pack.candles[decisionIndex].timestamp,
          price: pack.candles[decisionIndex].close,
          detail: `${selectedAction.toUpperCase()} at ${pack.candles[decisionIndex].close.toFixed(1)}`,
        }],
        result: oc.result,
        resultPrice: oc.resultPrice,
        pips: oc.pips,
      };
      setDecision(decision);

      // Reveal candles to show outcome
      setVisibleCount(25);
      setPhase('reveal');

      revealTimer.current = setTimeout(() => {
        setOutcome(oc);
        setPhase('result');
      }, 1500);
    }
  }, [pack, decisionIndex, zone, setDecision]);

  const handleContinue = useCallback(() => {
    if (!pack || !action) return;

    // Recompute decision for store (with result)
    const decision: SessionDecision = {
      scenarioId: pack.id,
      action,
      entryPrice: action !== 'wait' ? pack.candles[decisionIndex].close : undefined,
      entryIndex: decisionIndex,
      log: [{
        type: 'enter',
        timestamp: pack.candles[decisionIndex].timestamp,
        price: pack.candles[decisionIndex].close,
        detail: action === 'wait' ? 'Wait' : `${action.toUpperCase()} at ${pack.candles[decisionIndex].close.toFixed(1)}`,
      }],
      result: outcome?.result,
      resultPrice: outcome?.resultPrice,
      pips: outcome?.pips,
      refOutcome: action === 'wait'
        ? computeOutcome(pack.candles, decisionIndex, zone.direction as ActionType, zone).result
        : undefined,
    };
    setDecision(decision);

    // Compute scores
    const scores = computeAllScores(decision, pack.candles, zone);
    const rootCause = findRootCause({ decision, candles: pack.candles, zone, scores });
    const positiveNote = findPositiveNote({ decision, candles: pack.candles, zone, scores });

    const autopsy = { decision, scores, rootCause, positiveNote };
    setAutopsy(scores, autopsy);

    router.push('/autopsy');
  }, [pack, action, outcome, decisionIndex, zone, setDecision, setAutopsy]);

  // Decide exactly which candles the chart renders:
  // - deciding: ~15 candles ending at the decision point
  // - reveal/result: sliding window that always includes the decision candle + new candles (max 15 on screen)
  const CHART_MAX = 15;
  let chartStart: number;
  let chartEnd: number;
  if (phase === 'deciding') {
    chartStart = Math.max(0, decisionIndex + 1 - CHART_MAX);
    chartEnd = decisionIndex + 1;
  } else {
    // Left edge: slide right with revealed candles, but never past the decision candle
    chartStart = Math.min(
      decisionIndex,
      Math.max(0, decisionIndex + 1 - CHART_MAX + visibleCount),
    );
    // Right edge: cap at CHART_MAX candles from start
    chartEnd = Math.min(
      chartStart + CHART_MAX,
      Math.min(decisionIndex + 1 + visibleCount, pack.candles.length),
    );
  }
  const visibleCandles = pack.candles.slice(chartStart, chartEnd);

  return (
    <ScrollView
      style={[styles.container, { paddingTop: insets.top }]}
      contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + spacing.xl }]}
    >
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.replace('/')} style={styles.backBtn}>
          <IconChevronLeft size={24} color={colors.text} strokeWidth={2} />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <View style={styles.headerRow}>
            <IconChartCandle size={14} color={colors.textSecondary} strokeWidth={1.5} />
            <Text style={styles.headerText}>
              {pack.symbol} · {pack.timeframe}
            </Text>
          </View>
          <Text style={styles.headerSub}>#1/1</Text>
        </View>
        <View style={styles.backBtn} /> {/* spacer */}
      </View>

      {/* Candle Chart */}
      <CandleChart candles={visibleCandles} />

      {/* Context prompt */}
      <View style={styles.promptContainer}>
        <Text style={styles.promptText}>{pack.contextPrompt}</Text>
      </View>

      {/* Phase: deciding */}
      {phase === 'deciding' && (
        <ActionButtons onSelect={handleAction} />
      )}

      {/* Phase: reveal */}
      {phase === 'reveal' && (
        <View style={styles.revealContainer}>
          <Text style={styles.revealText}>Market is moving...</Text>
        </View>
      )}

      {/* Phase: result */}
      {phase === 'result' && outcome && (
        <View style={styles.resultContainer}>
          <ResultBadge
            result={outcome.result}
            pips={outcome.pips}
            resultPrice={outcome.resultPrice}
            action={action ?? undefined}
          />
          <TouchableOpacity style={styles.continueBtn} onPress={handleContinue} activeOpacity={0.8}>
            <Text style={styles.continueText}>See autopsy →</Text>
          </TouchableOpacity>
        </View>
      )}
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
  headerCenter: {
    alignItems: 'center',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  headerText: {
    fontSize: font.md,
    fontWeight: '500',
    color: colors.text,
  },
  headerSub: {
    fontSize: font.xs,
    color: colors.textMuted,
  },
  promptContainer: {
    padding: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  promptText: {
    fontSize: font.sm,
    color: colors.textSecondary,
    lineHeight: 20,
    textAlign: 'center',
  },
  revealContainer: {
    alignItems: 'center',
    paddingVertical: spacing.lg,
  },
  revealText: {
    fontSize: font.sm,
    color: colors.textMuted,
  },
  resultContainer: {
    gap: spacing.lg,
  },
  continueBtn: {
    backgroundColor: colors.primary,
    paddingVertical: spacing.md,
    borderRadius: radius.sm,
    alignItems: 'center',
  },
  continueText: {
    color: '#FFFFFF',
    fontSize: font.md,
    fontWeight: '500',
  },
});
