import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { colors, spacing, font, radius } from '@/constants/theme';
import type { ActionType } from '@/lib/types';

interface ActionButtonsProps {
  onSelect: (action: ActionType) => void;
}

export function ActionButtons({ onSelect }: ActionButtonsProps) {
  return (
    <View style={styles.row}>
      <TouchableOpacity
        style={[styles.btn, styles.buy]}
        onPress={() => onSelect('buy')}
        activeOpacity={0.7}
      >
        <Text style={[styles.btnText, styles.buyText]}>Buy</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.btn, styles.sell]}
        onPress={() => onSelect('sell')}
        activeOpacity={0.7}
      >
        <Text style={[styles.btnText, styles.sellText]}>Sell</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.btn, styles.wait]}
        onPress={() => onSelect('wait')}
        activeOpacity={0.7}
      >
        <Text style={[styles.btnText, styles.waitText]}>Wait</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  btn: {
    flex: 1,
    paddingVertical: spacing.md,
    borderRadius: radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  buy: {
    backgroundColor: colors.greenLight,
    borderColor: '#BBF7D0',
  },
  sell: {
    backgroundColor: colors.redLight,
    borderColor: '#FECACA',
  },
  wait: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
  },
  btnText: {
    fontSize: font.md,
    fontWeight: '500',
  },
  buyText: { color: colors.green },
  sellText: { color: colors.red },
  waitText: { color: colors.textSecondary },
});
