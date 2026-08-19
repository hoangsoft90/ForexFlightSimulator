import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, spacing, font, radius } from '@/constants/theme';
import { IconAlertTriangle, IconCheck } from '@tabler/icons-react-native';

interface InsightBlockProps {
  variant: 'error' | 'positive';
  label: string;
  description: string;
}

const VARIANT_CONFIG = {
  error: {
    bg: colors.amberLight,
    border: '#FDE68A',
    iconColor: colors.amber,
    Icon: IconAlertTriangle,
  },
  positive: {
    bg: colors.greenLight,
    border: '#BBF7D0',
    iconColor: colors.green,
    Icon: IconCheck,
  },
};

export function InsightBlock({ variant, label, description }: InsightBlockProps) {
  const config = VARIANT_CONFIG[variant];
  const IconComponent = config.Icon;

  return (
    <View style={[styles.block, { backgroundColor: config.bg, borderColor: config.border }]}>
      <View style={styles.header}>
        <IconComponent size={16} color={config.iconColor} strokeWidth={2} />
        <Text style={[styles.label, { color: config.iconColor }]}>{label}</Text>
      </View>
      <Text style={styles.description}>{description}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  block: {
    padding: spacing.lg,
    borderRadius: radius.sm,
    borderWidth: 1,
    gap: spacing.sm,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  label: {
    fontSize: font.md,
    fontWeight: '500',
  },
  description: {
    fontSize: font.sm,
    color: colors.text,
    lineHeight: 20,
  },
});
