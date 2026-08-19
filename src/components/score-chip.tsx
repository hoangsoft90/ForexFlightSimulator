import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, spacing, font, radius } from '@/constants/theme';
import { scoreColor } from '@/lib/format';
import {
  IconBook,
  IconTarget,
  IconShield,
  IconBrain,
} from '@tabler/icons-react-native';

interface ScoreChipProps {
  label: string;
  value: number;
  icon: 'reading' | 'entry' | 'risk' | 'discipline';
  size?: 'sm' | 'md' | 'lg';
}

const ICONS = {
  reading: IconBook,
  entry: IconTarget,
  risk: IconShield,
  discipline: IconBrain,
};

export function ScoreChip({ label, value, icon, size = 'md' }: ScoreChipProps) {
  const Icon = ICONS[icon];
  const iconSize = size === 'sm' ? 14 : size === 'lg' ? 22 : 18;
  const valueSize = size === 'sm' ? font.sm : size === 'lg' ? font.xl : font.lg;

  return (
    <View style={[styles.container, size === 'lg' && styles.containerLg]}>
      <Icon size={iconSize} color={colors.textSecondary} strokeWidth={1.5} />
      <Text style={[styles.label, size === 'sm' && styles.labelSm]}>{label}</Text>
      <Text style={[styles.value, { fontSize: valueSize, color: scoreColor(value) }]}>
        {value}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    padding: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: colors.borderLight,
    gap: spacing.xs,
  },
  containerLg: {
    padding: spacing.lg,
  },
  label: {
    fontSize: font.xs,
    color: colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  labelSm: {
    fontSize: 10,
  },
  value: {
    fontWeight: '500',
  },
});
