import React, { useMemo } from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import Svg, { Rect, Line } from 'react-native-svg';
import type { Candle, ReferenceZone } from '@/lib/types';
import { colors } from '@/constants/theme';

interface CandleChartProps {
  candles: Candle[];       // already sliced to exactly what should be shown
  zone?: ReferenceZone;
  style?: ViewStyle;
}

const CHART_PADDING = { top: 12, bottom: 12, left: 0, right: 0 };
const CANDLE_GAP = 2;

export function CandleChart({
  candles,
  zone,
  style,
}: CandleChartProps) {
  const visible = candles;

  const layout = useMemo(() => {
    if (visible.length === 0) return null;

    // Find min/max across visible candles
    let minPrice = Infinity;
    let maxPrice = -Infinity;
    for (const c of visible) {
      if (c.low < minPrice) minPrice = c.low;
      if (c.high > maxPrice) maxPrice = c.high;
    }

    // Add 5% padding above/below
    const range = maxPrice - minPrice || 1;
    const paddedMin = minPrice - range * 0.05;
    const paddedMax = maxPrice + range * 0.05;
    const paddedRange = paddedMax - paddedMin;

    // Fixed chart dimensions
    const width = 300;
    const height = 196; // 220 - 24 padding
    const plotWidth = width;
    const plotHeight = height - CHART_PADDING.top - CHART_PADDING.bottom;

    const candleWidth = Math.max(
      4,
      Math.floor((plotWidth - (visible.length - 1) * CANDLE_GAP) / visible.length),
    );

    const priceToY = (price: number): number =>
      CHART_PADDING.top + plotHeight * (1 - (price - paddedMin) / paddedRange);

    return {
      width,
      height,
      plotWidth,
      plotHeight,
      candleWidth,
      paddedMin,
      paddedMax,
      paddedRange,
      priceToY,
    };
  }, [visible]);

  if (!layout || visible.length === 0) {
    return (
      <View style={[styles.container, style]}>
        <View style={styles.empty} />
      </View>
    );
  }

  return (
    <View style={[styles.container, style]}>
      <Svg width={layout.width} height={layout.height} viewBox={`0 0 ${layout.width} ${layout.height}`}>
        {/* Optional zone lines */}
        {zone && (
          <>
            <Line
              x1={0}
              y1={layout.priceToY(zone.entryLow)}
              x2={layout.width}
              y2={layout.priceToY(zone.entryLow)}
              stroke={colors.border}
              strokeWidth={0.5}
              strokeDasharray="4,4"
            />
            <Line
              x1={0}
              y1={layout.priceToY(zone.entryHigh)}
              x2={layout.width}
              y2={layout.priceToY(zone.entryHigh)}
              stroke={colors.border}
              strokeWidth={0.5}
              strokeDasharray="4,4"
            />
          </>
        )}

        {/* Candles */}
        {visible.map((candle, i) => {
          const isGreen = candle.close >= candle.open;
          const fill = isGreen ? colors.green : colors.red;
          const bodyTop = layout.priceToY(Math.max(candle.open, candle.close));
          const bodyBottom = layout.priceToY(Math.min(candle.open, candle.close));
          const bodyHeight = Math.max(1, bodyBottom - bodyTop);

          const x = i * (layout.candleWidth + CANDLE_GAP);
          const centerX = x + layout.candleWidth / 2;

          return (
            <React.Fragment key={i}>
              {/* Wick */}
              <Line
                x1={centerX}
                y1={layout.priceToY(candle.high)}
                x2={centerX}
                y2={layout.priceToY(candle.low)}
                stroke={fill}
                strokeWidth={1}
              />
              {/* Body */}
              <Rect
                x={x}
                y={bodyTop}
                width={layout.candleWidth}
                height={bodyHeight}
                fill={fill}
                rx={1}
              />
            </React.Fragment>
          );
        })}
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.surface,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.borderLight,
    padding: 12,
    height: 220,
    alignItems: 'center',
    justifyContent: 'center',
  },
  empty: {
    flex: 1,
  },
});
