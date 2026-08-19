import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, spacing, font, radius } from '@/constants/theme';
import type { TradeResult } from '@/lib/types';
import { formatPips, formatPrice } from '@/lib/format';

interface ResultBadgeProps {
  result: TradeResult;
  pips: number;          // raw dollar distance (not pip count)
  resultPrice?: number;
  action?: string;       // 'buy' | 'sell' | 'wait'
}

const RESULT_CONFIG: Record<TradeResult, { bg: string; border: string; label: string }> = {
  win:      { bg: colors.greenLight, border: '#BBF7D0', label: 'Take profit' },
  loss:     { bg: colors.redLight,   border: '#FECACA', label: 'Stop loss' },
  breakeven:{ bg: colors.blueLight,  border: '#BFDBFE', label: 'Breakeven' },
  skipped:  { bg: colors.blueLight,  border: '#BFDBFE', label: 'Setup skipped' },
};

export function ResultBadge({ result, pips, resultPrice, action }: ResultBadgeProps) {
  const config = RESULT_CONFIG[result];
  const pipDisplay = formatPips(pips);

  const subtitle = result === 'skipped'
    ? (action === 'wait' ? 'You chose to wait' : 'No trade taken')
    : resultPrice
      ? `${config.label} · ${formatPrice(resultPrice)}`
      : config.label;

  return (
    <View style={[styles.badge, { backgroundColor: config.bg, borderColor: config.border }]}>
      <Text style={[styles.label, {
        color: result === 'win' ? colors.green
          : result === 'loss' ? colors.red
          : colors.blue,
      }]}>
        {config.label}
      </Text>
      {result !== 'skipped' && (
        <Text style={[styles.pips, {
          color: result === 'win' ? colors.green
            : result === 'loss' ? colors.red
            : colors.textSecondary,
        }]}>
          {pipDisplay} pips
        </Text>
      )}
      <Text style={styles.subtitle}>{subtitle}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    padding: spacing.lg,
    borderRadius: radius.sm,
    borderWidth: 1,
    alignItems: 'center',
    gap: spacing.xs,
  },
  label: {
    fontSize: font.lg,
    fontWeight: '500',
  },
  pips: {
    fontSize: font.xl,
    fontWeight: '500',
  },
  subtitle: {
    fontSize: font.sm,
    color: colors.textSecondary,
  },
});
